import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext"
import { 
  Menu, 
  Bell, 
  Search,
  LogOut
} from 'lucide-react';

const Header = ({ sidebarOpen, setSidebarOpen, setActiveComponent, userEmail }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
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
                Welcome, {userEmail}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center">
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
            
            <button className="ml-4 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            
            {/* Visible logout button in header */}
            <button 
              onClick={handleLogout}
              className="ml-4 flex items-center justify-center p-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 focus:outline-none"
              title="Logout"
            >
              <LogOut className="h-6 w-6" />
            </button>
            
            <div className="ml-4 relative flex-shrink-0">
              <button 
                onClick={() => setActiveComponent('Profile')}
                className="bg-white rounded-full flex items-center focus:outline-none ring-2 ring-indigo-200 hover:ring-indigo-300"
                title="View Profile"
              >
                <img
                  className="h-8 w-8 rounded-full"
                  src="/api/placeholder/32/32"
                  alt="User avatar"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;