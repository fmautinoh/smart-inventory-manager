import React, { useState } from 'react';
import { ItemTemplate } from '../types';

interface ItemManagerProps {
  itemTemplates: ItemTemplate[];
  onAddItemTemplate: (item: Omit<ItemTemplate, 'id'>) => void;
}

const emptyTemplate: Omit<ItemTemplate, 'id'> = {
  assetCode: '', name: '', brand: '', model: '', type: '', 
  color: '', dimensions: '', other: '', origin: ''
};

const ItemManager: React.FC<ItemManagerProps> = ({ itemTemplates, onAddItemTemplate }) => {
  const [newItem, setNewItem] = useState(emptyTemplate);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.assetCode) {
      alert('Asset Code and Name are required.');
      return;
    }
    onAddItemTemplate(newItem);
    setNewItem(emptyTemplate);
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Create New Item</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="assetCode" className="block text-sm font-medium text-gray-300 mb-1">Asset Code*</label>
                <input type="text" name="assetCode" value={newItem.assetCode} onChange={handleInputChange} required className="w-full bg-gray-700 rounded-md p-2 text-white" />
              </div>
               <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name*</label>
                <input type="text" name="name" value={newItem.name} onChange={handleInputChange} required className="w-full bg-gray-700 rounded-md p-2 text-white" />
              </div>
               <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-300 mb-1">Brand</label>
                <input type="text" name="brand" value={newItem.brand} onChange={handleInputChange} className="w-full bg-gray-700 rounded-md p-2 text-white" />
              </div>
               <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-1">Model</label>
                <input type="text" name="model" value={newItem.model} onChange={handleInputChange} className="w-full bg-gray-700 rounded-md p-2 text-white" />
              </div>
               <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                <input type="text" name="type" value={newItem.type} onChange={handleInputChange} className="w-full bg-gray-700 rounded-md p-2 text-white" />
              </div>
               <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-300 mb-1">Color</label>
                <input type="text" name="color" value={newItem.color} onChange={handleInputChange} className="w-full bg-gray-700 rounded-md p-2 text-white" />
              </div>
               <div>
                <label htmlFor="dimensions" className="block text-sm font-medium text-gray-300 mb-1">Dimensions</label>
                <input type="text" name="dimensions" value={newItem.dimensions} onChange={handleInputChange} className="w-full bg-gray-700 rounded-md p-2 text-white" />
              </div>
               <div>
                <label htmlFor="origin" className="block text-sm font-medium text-gray-300 mb-1">Origin</label>
                <input type="text" name="origin" value={newItem.origin} onChange={handleInputChange} className="w-full bg-gray-700 rounded-md p-2 text-white" />
              </div>
               <div className="sm:col-span-2">
                <label htmlFor="other" className="block text-sm font-medium text-gray-300 mb-1">Other Details</label>
                <textarea name="other" value={newItem.other} onChange={handleInputChange} rows={2} className="w-full bg-gray-700 rounded-md p-2 text-white resize-y" />
              </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Save Item Template
          </button>
        </form>
      </div>

      <div className="lg:col-span-2 bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Existing Item Templates</h2>
        <div className="overflow-x-auto max-h-[70vh]">
            <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700/50 sticky top-0">
                    <tr>
                        <th className="px-4 py-3">Asset Code</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Brand</th>
                        <th className="px-4 py-3">Color</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    {itemTemplates.map(template => (
                        <tr key={template.id} className="hover:bg-gray-700/50">
                            <td className="px-4 py-3 font-mono text-indigo-300">{template.assetCode}</td>
                            <td className="px-4 py-3 font-medium text-white">{template.name}</td>
                            <td className="px-4 py-3">{template.brand || '-'}</td>
                            <td className="px-4 py-3">{template.color || '-'}</td>
                        </tr>
                    ))}
                    {itemTemplates.length === 0 && (
                        <tr>
                            <td colSpan={4} className="text-center py-10 text-gray-500">No item templates created yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default ItemManager;
