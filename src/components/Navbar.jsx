import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, User, ChevronDown } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      // Close mobile menu if open
      setIsMenuOpen(false);
      // Redirect to login page
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Check if the current path matches the given path
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Check if any of the Others dropdown paths are active
  const isOthersActive = () => {
    return isActive('/payments') || isActive('/contact-us');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled || !location.pathname.includes('/home') ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to={isAdmin ? "/admin/dashboard" : "/home"} className="flex items-center">
              <span className={`text-2xl font-bold ${isScrolled || !location.pathname.includes('/home') ? 'text-indigo-600' : 'text-white'}`}>
                Sentiment Stories
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {isAdmin ? (
                // Admin Navigation Links
                <>
                  <Link 
                    to="/admin/dashboard" 
                    className={`${isActive('/admin/dashboard') ? 'text-indigo-600' : isScrolled ? 'text-gray-700' : 'text-white'} hover:text-indigo-500 font-medium transition-colors`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/admin/profile" 
                    className={`${isActive('/admin/profile') ? 'text-indigo-600' : isScrolled ? 'text-gray-700' : 'text-white'} hover:text-indigo-500 font-medium transition-colors`}
                  >
                    Profile
                  </Link>
                </>
              ) : (
                // User Navigation Links
                <>
                  <Link 
                    to="/home" 
                    className={`${isActive('/home') ? 'text-indigo-600' : isScrolled || !location.pathname.includes('/home') ? 'text-gray-700' : 'text-white'} hover:text-indigo-500 font-medium transition-colors`}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/events" 
                    className={`${isActive('/events') ? 'text-indigo-600' : isScrolled || !location.pathname.includes('/home') ? 'text-gray-700' : 'text-white'} hover:text-indigo-500 font-medium transition-colors`}
                  >
                    Create Event
                  </Link>
                  <Link 
                    to="/myevents" 
                    className={`${isActive('/myevents') ? 'text-indigo-600' : isScrolled || !location.pathname.includes('/home') ? 'text-gray-700' : 'text-white'} hover:text-indigo-500 font-medium transition-colors`}
                  >
                    My Events
                  </Link>
                  <Link 
                    to="/feedback" 
                    className={`${isActive('/feedback') ? 'text-indigo-600' : isScrolled || !location.pathname.includes('/home') ? 'text-gray-700' : 'text-white'} hover:text-indigo-500 font-medium transition-colors`}
                  >
                    Feedback
                  </Link>
                  <Link 
                    to="/communicate" 
                    className={`${isActive('/communicate') ? 'text-indigo-600' : isScrolled || !location.pathname.includes('/home') ? 'text-gray-700' : 'text-white'} hover:text-indigo-500 font-medium transition-colors`}
                  >
                    Communicate
                  </Link>
                  <div className="relative dropdown-container">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDropdownOpen(!isDropdownOpen);
                      }}
                      className={`flex items-center ${
                        isOthersActive() ? 'text-indigo-600' : 
                        isScrolled || !location.pathname.includes('/home') ? 'text-gray-700' : 'text-white'
                      } hover:text-indigo-500 font-medium transition-colors`}
                    >
                      Others
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                        <div className="py-1">
                          <Link 
                            to="/payments" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-500"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Payments
                          </Link>
                          <Link 
                            to="/contact-us" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-500"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Contact Us
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                  <Link 
                    to="/profile" 
                    className={`${isActive('/profile') ? 'text-indigo-600' : isScrolled || !location.pathname.includes('/home') ? 'text-gray-700' : 'text-white'} hover:text-indigo-500 font-medium transition-colors`}
                  >
                    Profile
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              ) : (
                <>
                  <Link 
                    to="/" 
                    className={`${isScrolled || !location.pathname.includes('/home') ? 'text-indigo-600' : 'text-white'} font-medium hover:text-indigo-400 transition-colors`}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${isScrolled || !location.pathname.includes('/home') ? 'text-gray-800' : 'text-white'} hover:text-indigo-500 transition-colors`}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAdmin ? (
              // Admin Mobile Navigation Links
              <>
                <Link 
                  to="/admin/dashboard" 
                  className={`block px-3 py-2 rounded-md ${isActive('/admin/dashboard') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/admin/profile" 
                  className={`block px-3 py-2 rounded-md ${isActive('/admin/profile') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
              </>
            ) : (
              // User Mobile Navigation Links
              <>
                <Link 
                  to="/home" 
                  className={`block px-3 py-2 rounded-md ${isActive('/home') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/events" 
                  className={`block px-3 py-2 rounded-md ${isActive('/events') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Event
                </Link>
                <Link 
                  to="/myevents" 
                  className={`block px-3 py-2 rounded-md ${isActive('/myevents') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Events
                </Link>
                <Link 
                  to="/feedback" 
                  className={`block px-3 py-2 rounded-md ${isActive('/feedback') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Feedback
                </Link>
                <Link 
                  to="/communicate" 
                  className={`block px-3 py-2 rounded-md ${isActive('/communicate') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Communicate
                </Link>
                <Link 
                  to="/profile" 
                  className={`block px-3 py-2 rounded-md ${isActive('/profile') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>

                {/* Others Section (Mobile) */}
                <div className="py-2 border-t border-gray-200 mt-2">
                  <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Others
                  </p>
                  <Link 
                    to="/payments" 
                    className={`block px-3 py-2 rounded-md ${isActive('/payments') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Payments
                  </Link>
                  <Link 
                    to="/contact-us" 
                    className={`block px-3 py-2 rounded-md ${isActive('/contact-us') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact Us
                  </Link>
                </div>
              </>
            )}
            
            <div className="pt-4 pb-2 border-t border-gray-200">
              {currentUser && (
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 mt-2 w-full text-left text-white bg-indigo-600 font-medium rounded-md hover:bg-indigo-700"
                >
                  <LogOut size={16} className="mr-1" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;