import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import {
  BarChart3,
  Calendar,
  Users,
  Settings,
  LogOut,
  X,
  Menu,
  Bell,
  Search,
  Briefcase,
  DollarSign,
  PieChart,
  Sliders,
  Package
} from 'lucide-react';

// Import content components - all from the same directory
import DashboardContent from './DashboardContent';
import EventManagement from './EventManagement';
import ClientManagement from './ClientManagement';
import VendorManagement from './VendorManagement';
import ResourceManagement from './ResourceManagement';
import FinancialManagement from './FinancialManagement';
import AnalyticsDashboard from './AnalyticsDashboard';
import SystemSettings from './SystemSettings';
import AdminProfile from './AdminProfile';

// Fallback component for missing components
const FallbackComponent = ({ name }) => (
  <div className="p-4 bg-white rounded-lg shadow">
    <h2 className="text-xl font-bold mb-4">{name} Component</h2>
    <p>This component is under development.</p>
  </div>
);

const AdminDashboardPage = () => {
  const [activeComponent, setActiveComponent] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation items
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

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Render the appropriate component based on activeComponent
  const renderActiveComponent = () => {
    switch(activeComponent) {
      case 'Dashboard':
        return DashboardContent ? <DashboardContent /> : <FallbackComponent name="Dashboard" />;
      case 'Events':
        return EventManagement ? <EventManagement /> : <FallbackComponent name="Event Management" />;
      case 'Clients':
        return ClientManagement ? <ClientManagement /> : <FallbackComponent name="Client Management" />;
      case 'Vendors':
        return VendorManagement ? <VendorManagement /> : <FallbackComponent name="Vendor Management" />;
      case 'Resources':
        return ResourceManagement ? <ResourceManagement /> : <FallbackComponent name="Resource Management" />;
      case 'Finances':
        return FinancialManagement ? <FinancialManagement /> : <FallbackComponent name="Financial Management" />;
      case 'Analytics':
        return AnalyticsDashboard ? <AnalyticsDashboard /> : <FallbackComponent name="Analytics Dashboard" />;
      case 'Settings':
        return SystemSettings ? <SystemSettings /> : <FallbackComponent name="System Settings" />;
      case 'Profile':
        return AdminProfile ? <AdminProfile /> : <FallbackComponent name="Admin Profile" />;
      default:
        return DashboardContent ? <DashboardContent /> : <FallbackComponent name="Dashboard" />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar - now directly embedded in this component */}
      <div className="md:flex h-full w-64 flex-shrink-0 bg-white">
        <div className="w-full flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">Sentiment Stories</span>
            </div>
            <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          
          {/* Sidebar Navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveComponent(item.name)}
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
            
            {/* Logout Button */}
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
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button
                  type="button"
                  className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div className="ml-4 md:ml-0">
                  <h1 className="text-lg font-semibold text-gray-900">
                    Welcome, {currentUser?.email || 'admin@admin.com'}
                  </h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                  <Bell className="h-6 w-6" />
                </button>
                
                {/* Visible logout button in header */}
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center p-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 focus:outline-none"
                  title="Logout"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderActiveComponent()}
        </main>
      </div>

      {/* Mobile sidebar (shown/hidden based on state) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Background overlay */}
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75" 
            onClick={() => setSidebarOpen(false)}
          ></div>
          
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 flex flex-col w-full max-w-xs bg-white">
            <div className="absolute top-0 right-0 p-1 -mr-10">
              <button
                className="flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            
            {/* Sidebar content for mobile */}
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <span className="text-xl font-bold text-indigo-600">Sentiment Stories</span>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActiveComponent(item.name);
                      setSidebarOpen(false);
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
              </nav>
            </div>
            
            {/* Mobile logout button */}
            <div className="flex-shrink-0 border-t border-gray-200 p-4">
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
      )}
    </div>
  );
};

export default AdminDashboardPage;