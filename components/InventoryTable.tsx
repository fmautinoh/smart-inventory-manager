import React from 'react';
import { DisplayInventoryItem } from './InventoryDashboard';

interface InventoryTableProps {
  inventory: DisplayInventoryItem[];
}

const ConservationBadge: React.FC<{ state: string }> = ({ state }) => {
    const stateColor = {
        'BUENO': 'bg-green-500/20 text-green-300',
        'REGULAR': 'bg-yellow-500/20 text-yellow-300',
        'MALO': 'bg-red-500/20 text-red-300',
    }[state.toUpperCase()] || 'bg-gray-500/20 text-gray-300';

    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${stateColor}`}>
            {state}
        </span>
    );
};


const InventoryTable: React.FC<InventoryTableProps> = ({ inventory }) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
            <tr>
              <th scope="col" className="px-6 py-3">N°</th>
              <th scope="col" className="px-6 py-3">Asset Code</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Location</th>
              <th scope="col" className="px-6 py-3">Brand</th>
              <th scope="col" className="px-6 py-3">Serial</th>
              <th scope="col" className="px-6 py-3">State</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200">
                <td className="px-6 py-4">{item.posision}</td>
                <td className="px-6 py-4 font-mono text-indigo-300">{item.template.assetCode}</td>
                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{item.template.name}</td>
                <td className="px-6 py-4">{item.location}</td>
                <td className="px-6 py-4">{item.template.brand || '-'}</td>
                <td className="px-6 py-4 font-mono">{item.serial || '-'}</td>
                <td className="px-6 py-4">
                    <ConservationBadge state={String(item.conservationState)} />
                </td>
              </tr>
            ))}
            {inventory.length === 0 && (
                <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-500">
                        No items found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
