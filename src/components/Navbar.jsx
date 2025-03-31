


import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

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

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/home" className="flex items-center">
              <span className={`text-2xl font-bold ${isScrolled ? 'text-indigo-600' : 'text-white'}`}>
                Sentinent Stories
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link 
                to="#features" 
                className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-indigo-500 font-medium transition-colors`}
              >
                Features
              </Link>
              <Link 
                to="#services" 
                className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-indigo-500 font-medium transition-colors`}
              >
                Services
              </Link>
              <Link 
                to="#testimonials" 
                className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-indigo-500 font-medium transition-colors`}
              >
                Testimonials
              </Link>
              <Link 
                to="#pricing" 
                className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-indigo-500 font-medium transition-colors`}
              >
                Pricing
              </Link>
              <Link 
                to="#contact" 
                className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-indigo-500 font-medium transition-colors`}
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <>
                  <Link 
                    to="/profile" 
                    className={`${isScrolled ? 'text-indigo-600' : 'text-white'} font-medium hover:text-indigo-400 transition-colors`}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/" 
                    className={`${isScrolled ? 'text-indigo-600' : 'text-white'} font-medium hover:text-indigo-400 transition-colors`}
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
              className={`${isScrolled ? 'text-gray-800' : 'text-white'} hover:text-indigo-500 transition-colors`}
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
            <Link 
              to="#features" 
              className="block px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="#services" 
              className="block px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="#testimonials" 
              className="block px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Link 
              to="#pricing" 
              className="block px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="#contact" 
              className="block px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            
            <div className="pt-4 pb-2 border-t border-gray-200">
              {currentUser ? (
                <>
                  <Link 
                    to="/profile" 
                    className="block px-3 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 mt-2 w-full text-left text-white bg-indigo-600 font-medium rounded-md hover:bg-indigo-700"
                  >
                    <LogOut size={16} className="mr-1" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/" 
                    className="block px-3 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block px-3 py-2 mt-2 bg-indigo-600 text-white font-medium rounded-md text-center hover:bg-indigo-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;