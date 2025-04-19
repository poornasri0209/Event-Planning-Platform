// src/components/ui/tabs.jsx
import React from 'react';

const TabsContext = React.createContext(null);

export const Tabs = ({ value, onValueChange, className, children }) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ className, children }) => {
  return (
    <div className={`inline-flex items-center justify-center rounded-md bg-gray-100 p-1 ${className}`}>
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, className, children }) => {
  const { value: selectedValue, onValueChange } = React.useContext(TabsContext);
  const isSelected = value === selectedValue;
  
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      onClick={() => onValueChange(value)}
      className={`inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 
        ${isSelected 
          ? 'bg-white text-indigo-700 shadow-sm' 
          : 'text-gray-500 hover:text-gray-700'
        } ${className}`}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, className, children }) => {
  const { value: selectedValue } = React.useContext(TabsContext);
  const isSelected = value === selectedValue;
  
  if (!isSelected) return null;
  
  return (
    <div
      role="tabpanel"
      className={className}
    >
      {children}
    </div>
  );
};