import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import {
  BarChart3,
  Calendar,
  Users,
  Settings,
  LogOut,
  X,
  Briefcase,
  DollarSign,
  PieChart,
  Sliders,
  Package
} from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen, setActiveComponent, activeComponent }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const navigation = [
    { name: 'Dashboard', icon: BarChart3 },
    { name: 'Events', icon: Calendar },
    { name: 'Clients', icon: Users },
    { name: 'Vendors', icon: Briefcase },
    { name: 'Resources', icon: Package },
    { name: 'Finances', icon: DollarSign },
    { name: 'Analytics', icon: PieChart },
    { name: 'Settings', icon: Sliders },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className="h-full bg-white shadow-lg w-64">
      {/* Sidebar header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div className="flex items-center">
          <span className="text-xl font-bold text-indigo-600">Sentiment Stories</span>
        </div>
        <button 
          className="md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-6 w-6 text-gray-500" />
        </button>
      </div>
      
      {/* Sidebar content */}
      <div className="flex flex-col h-0 flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4">
          <div className="space-y-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveComponent(item.name);
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeComponent === item.name
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${
                  activeComponent === item.name ? 'text-indigo-500' : 'text-gray-400'
                }`} />
                {item.name}
              </button>
            ))}
          </div>
        </nav>
        
        {/* Logout button */}
        <div className="p-4 border-t border-gray-200">
          <button
            className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5 text-red-500" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;