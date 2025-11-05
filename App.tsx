import React, { useState, useEffect, useMemo } from 'react';
import { InventoryItem, Location, ItemTemplate } from './types';
import { initialInventoryData, initialItemTemplates } from './data/initialData';
import Header from './components/Header';
import InventoryDashboard from './components/InventoryDashboard';
import LocationManager from './components/LocationManager';
import ItemManager from './components/ItemManager';
import {
  getAllItemTemplates,
  getAllInventoryItems,
  getAllLocations,
  createItemTemplate,
  createInventoryItems,
  createLocation,
  updateLocation,
  deleteLocation
} from './services/crud';

export type View = 'inventory' | 'locations' | 'items';

const App: React.FC = () => {
  const [itemTemplates, setItemTemplates] = useState<ItemTemplate[]>(initialItemTemplates);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventoryData);
  const [locations, setLocations] = useState<Location[]>([]);
  const [currentView, setCurrentView] = useState<View>('inventory');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from database on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Wait a bit for initialData to load
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const [templatesData, inventoryData, locationsData] = await Promise.all([
          getAllItemTemplates(),
          getAllInventoryItems(),
          getAllLocations()
        ]);
        
        setItemTemplates(templatesData.length > 0 ? templatesData : initialItemTemplates);
        setInventory(inventoryData.length > 0 ? inventoryData : initialInventoryData);
        
        if (locationsData.length > 0) {
          setLocations(locationsData);
        } else {
          // Extract unique locations from inventory
          const uniqueLocations = [...new Set(
            (inventoryData.length > 0 ? inventoryData : initialInventoryData)
              .map(item => item.location.trim())
              .filter(Boolean)
          )];
          const newLocations = uniqueLocations.map((loc, index) => ({ 
            id: `loc-${index + 1}`, 
            name: loc 
          }));
          setLocations(newLocations);
          
          // Save locations to database
          for (const loc of newLocations) {
            try {
              await createLocation({ name: loc.name });
            } catch (err) {
              console.warn('Location already exists:', loc.name);
            }
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data from database. Using cached data.');
        
        // Fallback to initial data
        if (itemTemplates.length === 0) setItemTemplates(initialItemTemplates);
        if (inventory.length === 0) setInventory(initialInventoryData);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const addInventoryItems = async (items: Omit<InventoryItem, 'id' | 'posision'>[]) => {
    try {
      const lastItemNo = inventory.length > 0 ? Math.max(...inventory.map(i => i.posision)) : 0;
      const itemsToCreate = items.map((item, index) => ({
        ...item,
        posision: lastItemNo + index + 1,
      }));
      
      const createdItems = await createInventoryItems(itemsToCreate);
      setInventory(prev => [...prev, ...createdItems]);
      console.log(`✓ Added ${createdItems.length} items to database`);
    } catch (err) {
      console.error('Error adding inventory items:', err);
      alert('Failed to add items to database. Please try again.');
    }
  };

  const addItemTemplate = async (template: Omit<ItemTemplate, 'id'>) => {
    try {
      const newTemplate = await createItemTemplate(template);
      setItemTemplates(prev => [...prev, newTemplate].sort((a,b) => a.name.localeCompare(b.name)));
      console.log(`✓ Added template to database: ${newTemplate.name}`);
    } catch (err) {
      console.error('Error adding item template:', err);
      alert('Failed to add template to database. Please try again.');
    }
  };

  const handleLocationsUpdate = async (updatedLocations: Location[]) => {
    setLocations(updatedLocations);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      {error && (
        <div className="bg-yellow-900/50 border border-yellow-600 text-yellow-200 px-4 py-3 mx-4 mt-4 rounded">
          <p>{error}</p>
        </div>
      )}
      <main className="p-4 sm:p-6 lg:p-8">
        {currentView === 'inventory' && (
          <InventoryDashboard
            inventory={inventory}
            itemTemplates={itemTemplates}
            locations={locations}
            onAddItems={addInventoryItems}
          />
        )}
        {currentView === 'locations' && (
          <LocationManager locations={locations} setLocations={handleLocationsUpdate} />
        )}
        {currentView === 'items' && (
            <ItemManager itemTemplates={itemTemplates} onAddItemTemplate={addItemTemplate} />
        )}
      </main>
    </div>
  );
};

export default App;
