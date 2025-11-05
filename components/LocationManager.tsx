
import React, { useState } from 'react';
import { Location } from '../types';
import { createLocation, deleteLocation } from '../services/crud';

interface LocationManagerProps {
  locations: Location[];
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
}

const LocationManager: React.FC<LocationManagerProps> = ({ locations, setLocations }) => {
  const [newLocationName, setNewLocationName] = useState('');

  const handleAddLocation = async () => {
    if (!newLocationName.trim()) {
      alert("Location name cannot be empty.");
      return;
    }
    
    if (locations.some(loc => loc.name.toLowerCase() === newLocationName.trim().toLowerCase())) {
      alert("A location with this name already exists.");
      return;
    }
    
    try {
      const newLocation = await createLocation({ name: newLocationName.trim() });
      setLocations(prev => [...prev, newLocation].sort((a,b) => a.name.localeCompare(b.name)));
      setNewLocationName('');
      console.log(`✓ Location added: ${newLocation.name}`);
    } catch (err) {
      console.error('Error adding location:', err);
      alert('Failed to add location to database. Please try again.');
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this location? This action cannot be undone.")) {
      return;
    }
    
    try {
      await deleteLocation(id);
      setLocations(prev => prev.filter(loc => loc.id !== id));
      console.log(`✓ Location deleted`);
    } catch (err) {
      console.error('Error deleting location:', err);
      alert('Failed to delete location from database. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Manage Locations</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            value={newLocationName}
            onChange={(e) => setNewLocationName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddLocation()}
            placeholder="Enter new location name"
            className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleAddLocation}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex items-center justify-center"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Add Location
          </button>
        </div>

        <div className="space-y-3">
          {locations.map(location => (
            <div key={location.id} className="bg-gray-700/50 rounded-lg p-4 flex justify-between items-center transition-all hover:bg-gray-700">
              <span className="text-gray-200">{location.name}</span>
              <button
                onClick={() => handleDeleteLocation(location.id)}
                className="text-red-400 hover:text-red-300 transition-colors"
                aria-label={`Delete ${location.name}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
           {locations.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    No locations added yet.
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default LocationManager;
