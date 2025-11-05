import React from 'react';
import { View } from '../App';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const NavButton: React.FC<{ view: View; label: string }> = ({ view, label }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => setCurrentView(view)}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
          isActive
            ? 'bg-indigo-600 text-white shadow-md'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h1 className="text-xl font-bold text-white">Smart Inventory</h1>
          </div>
          <nav className="flex items-center space-x-2 bg-gray-900/50 p-1 rounded-lg">
            <NavButton view="inventory" label="Inventory" />
            <NavButton view="items" label="Items" />
            <NavButton view="locations" label="Locations" />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
