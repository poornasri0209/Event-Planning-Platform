import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center">
              <span className={`text-2xl font-bold ${isScrolled ? 'text-indigo-600' : 'text-white'}`}>
                Sentinent Stories
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <a 
                href="#features" 
                className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-indigo-500 font-medium transition-colors`}
              >
                Features
              </a>
              <a 
                href="#services" 
                className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-indigo-500 font-medium transition-colors`}
              >
                Services
              </a>
              <a 
                href="#testimonials" 
                className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-indigo-500 font-medium transition-colors`}
              >
                Testimonials
              </a>
              <a 
                href="#pricing" 
                className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-indigo-500 font-medium transition-colors`}
              >
                Pricing
              </a>
              <a 
                href="#contact" 
                className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-indigo-500 font-medium transition-colors`}
              >
                Contact
              </a>
            </div>
          </div>

          {/* Login/Register Buttons */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <a 
                href="/login" 
                className={`${isScrolled ? 'text-indigo-600' : 'text-white'} font-medium hover:text-indigo-400 transition-colors`}
              >
                Login
              </a>
              <a 
                href="/register" 
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </a>
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
            <a 
              href="#features" 
              className="block px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#services" 
              className="block px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </a>
            <a 
              href="#testimonials" 
              className="block px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </a>
            <a 
              href="#pricing" 
              className="block px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </a>
            <a 
              href="#contact" 
              className="block px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>
            <div className="pt-4 pb-2 border-t border-gray-200">
              <a 
                href="/login" 
                className="block px-3 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </a>
              <a 
                href="/register" 
                className="block px-3 py-2 mt-2 bg-indigo-600 text-white font-medium rounded-md text-center hover:bg-indigo-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;