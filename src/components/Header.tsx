import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home } from 'lucide-react';
import logo from '../../src/images/HH.png';

interface HeaderProps {
  scrollY: number;
}

const Header: React.FC<HeaderProps> = ({ scrollY }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-1 outline-none focus:outline-none">
            <img 
              src={logo} 
              alt="HomeHeroes Logo" 
              className="w-14 h-14 object-contain rounded-lg"
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <Link 
              to="/" 
              className={`${
                isActive('/') 
                  ? 'text-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              } transition-colors font-medium outline-none focus:outline-none`}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className={`${
                isActive('/services') 
                  ? 'text-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              } transition-colors font-medium outline-none focus:outline-none`}
            >
              Services
            </Link>
            <Link 
              to="/how-it-works" 
              className={`${
                isActive('/how-it-works') 
                  ? 'text-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              } transition-colors font-medium outline-none focus:outline-none`}
            >
              How It Works
            </Link>
            <Link 
                to="/contact-us" 
                className={`${
                  isActive('/contact-us') 
                    ? 'text-green-600' 
                    : 'text-gray-700 hover:text-green-600'
                } transition-colors font-medium outline-none focus:outline-none`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
          </nav>

          <div className="hidden md:flex items-center">
            <Link 
              to="/login" 
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium outline-none focus:outline-none"
            >
              Find Services
            </Link>
          </div>

          <button
            className="md:hidden outline-none focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                className={`block px-3 py-2 ${
                  isActive('/') 
                    ? 'text-green-600' 
                    : 'text-gray-700 hover:text-green-600'
                } transition-colors outline-none focus:outline-none`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/services" 
                className={`block px-3 py-2 ${
                  isActive('/services') 
                    ? 'text-green-600' 
                    : 'text-gray-700 hover:text-green-600'
                } transition-colors outline-none focus:outline-none`}
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                to="/how-it-works" 
                className={`block px-3 py-2 ${
                  isActive('/how-it-works') 
                    ? 'text-green-600' 
                    : 'text-gray-700 hover:text-green-600'
                } transition-colors outline-none focus:outline-none`}
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link 
                to="/contact-us" 
                className={`block px-3 py-2 ${
                  isActive('/contact-us') 
                    ? 'text-green-600' 
                    : 'text-gray-700 hover:text-green-600'
                } transition-colors outline-none focus:outline-none`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
              <Link 
                to="/login" 
                className="block w-full text-left bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors outline-none focus:outline-none"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Services
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;