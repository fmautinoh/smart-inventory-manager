import React, { useState, useEffect, useCallback } from 'react';
import { InventoryItem, Location, ConservationState, ItemTemplate } from '../types';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: Location[];
  itemTemplates: ItemTemplate[];
  onAddItems: (items: Omit<InventoryItem, 'id' | 'posision'>[]) => void;
}

const AddStockModal: React.FC<AddStockModalProps> = ({ isOpen, onClose, locations, itemTemplates, onAddItems }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [quantities, setQuantities] = useState<Record<ConservationState, number>>({
    [ConservationState.Bueno]: 0,
    [ConservationState.Regular]: 0,
    [ConservationState.Malo]: 0,
  });
  const [observations, setObservations] = useState('');

  useEffect(() => {
    if (locations.length > 0 && !location) {
      setLocation(locations[0].name);
    }
    if(itemTemplates.length > 0 && !selectedTemplateId){
        setSelectedTemplateId(itemTemplates[0].id)
    }
  }, [locations, itemTemplates, location, selectedTemplateId]);

  const handleSubmit = useCallback(() => {
    const template = itemTemplates.find(t => t.id === selectedTemplateId);
    if (!template || !location) {
      alert('Please select an item type and location.');
      return;
    }

    const newItems: Omit<InventoryItem, 'id' | 'posision'>[] = [];
    
    Object.entries(quantities).forEach(([state, count]) => {
      // Fix for: Operator '<' cannot be applied to types 'number' and 'unknown'.
      // TypeScript infers `count` as `unknown` from `Object.entries`, so we cast it to a number.
      for (let i = 0; i < (count as number); i++) {
        newItems.push({
          templateId: template.id,
          location,
          conservationState: state as ConservationState,
          observations,
          serial: '', // Serials must be added individually later
          situation: 'U'
        });
      }
    });

    if (newItems.length > 0) {
      onAddItems(newItems);
      onClose();
    } else {
        alert('Please enter a quantity greater than zero.');
    }
  }, [selectedTemplateId, location, quantities, observations, itemTemplates, onAddItems, onClose]);
  
  const selectedTemplate = itemTemplates.find(t => t.id === selectedTemplateId);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">Add New Stock</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="item-type" className="block text-sm font-medium text-gray-300 mb-1">Item Type</label>
            <select
              id="item-type"
              value={selectedTemplateId}
              onChange={e => setSelectedTemplateId(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
            >
              {itemTemplates.map(t => <option key={t.id} value={t.id}>{t.name} ({t.assetCode})</option>)}
            </select>
          </div>

          {selectedTemplate && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm bg-gray-900/50 p-4 rounded-md">
                <p><strong className="text-gray-400">Asset Code:</strong> {selectedTemplate.assetCode}</p>
                <p><strong className="text-gray-400">Brand:</strong> {selectedTemplate.brand || 'N/A'}</p>
                <p><strong className="text-gray-400">Color:</strong> {selectedTemplate.color || 'N/A'}</p>
                <p><strong className="text-gray-400">Origin:</strong> {selectedTemplate.origin || 'N/A'}</p>
            </div>
          )}

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">Location</label>
            <select
              id="location"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
            >
              {locations.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Quantities by State</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.values(ConservationState).map(state => (
                <div key={state}>
                  <label htmlFor={`quantity-${state}`} className="block text-xs text-gray-400 mb-1">{state}</label>
                  <input
                    type="number"
                    id={`quantity-${state}`}
                    min="0"
                    value={quantities[state]}
                    onChange={e => setQuantities(q => ({...q, [state]: Math.max(0, parseInt(e.target.value) || 0)}))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="observations" className="block text-sm font-medium text-gray-300 mb-1">Observations (Optional)</label>
            <textarea
              id="observations"
              rows={3}
              value={observations}
              onChange={e => setObservations(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white resize-y"
            ></textarea>
          </div>
        </div>
        <div className="p-6 bg-gray-800/50 border-t border-gray-700 flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Add Items</button>
        </div>
      </div>
    </div>
  );
};

export default AddStockModal;