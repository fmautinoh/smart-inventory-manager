import React, { useState, useMemo } from 'react';
import { InventoryItem, Location, ItemTemplate } from '../types';
import AddStockModal from './AddStockModal';
import InventoryTable from './InventoryTable';
import { exportToExcel } from '../services/excelExporter';

// The data structure used for displaying and exporting, combining instance and template details.
export type DisplayInventoryItem = InventoryItem & {
    template: ItemTemplate;
};

interface InventoryDashboardProps {
  inventory: InventoryItem[];
  itemTemplates: ItemTemplate[];
  locations: Location[];
  onAddItems: (items: Omit<InventoryItem, 'id' | 'posision'>[]) => void;
}

const InventoryDashboard: React.FC<InventoryDashboardProps> = ({ inventory, itemTemplates, locations, onAddItems }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [conservationFilter, setConservationFilter] = useState('');
  
  const displayInventory = useMemo((): DisplayInventoryItem[] => {
    const templateMap = new Map(itemTemplates.map(t => [t.id, t]));
    return inventory.map(inv => ({
      ...inv,
      template: templateMap.get(inv.templateId)!,
    })).filter(item => item.template); // Filter out items with no matching template
  }, [inventory, itemTemplates]);

  const filteredInventory = useMemo(() => {
    return displayInventory.filter(item => {
      const searchMatch =
        item.template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.template.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serial.toLowerCase().includes(searchTerm.toLowerCase());
      const locationMatch = locationFilter ? item.location === locationFilter : true;
      const conservationMatch = conservationFilter ? item.conservationState === conservationFilter : true;
      return searchMatch && locationMatch && conservationMatch;
    });
  }, [displayInventory, searchTerm, locationFilter, conservationFilter]);

  const handleExport = () => {
    exportToExcel(filteredInventory, 'InventoryData');
  };
  
  const conservationStates = [...new Set(inventory.map(i => i.conservationState))];

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by name, code, serial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
           <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            <option value="">All Locations</option>
            {locations.map(loc => <option key={loc.id} value={loc.name}>{loc.name}</option>)}
          </select>
          <select
            value={conservationFilter}
            onChange={(e) => setConservationFilter(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            <option value="">All States</option>
            {conservationStates.map(state => <option key={String(state)} value={String(state)}>{String(state)}</option>)}
          </select>
          <div className="flex space-x-2">
            <button
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Add Stock
            </button>
            <button
                onClick={handleExport}
                className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Export
            </button>
          </div>
        </div>
      </div>
      
      <InventoryTable inventory={filteredInventory} />

      {isModalOpen && (
        <AddStockModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          locations={locations}
          itemTemplates={itemTemplates}
          onAddItems={onAddItems}
        />
      )}
    </div>
  );
};

export default InventoryDashboard;
