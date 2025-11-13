import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home } from 'lucide-react';
import logo from '../../public/HH.png';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-1">
            <img 
              src={logo} 
              alt="HomeHeroes Logo" 
              className="w-14 h-14 object-contain rounded-lg"
            />
            {/* <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">
              Home Heroes
            </span> */}
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`${
                isActive('/') 
                  ? 'text-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              } transition-colors font-medium`}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className={`${
                isActive('/services') 
                  ? 'text-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              } transition-colors font-medium`}
            >
              Services
            </Link>
            <Link 
              to="/how-it-works" 
              className={`${
                isActive('/how-it-works') 
                  ? 'text-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              } transition-colors font-medium`}
            >
              How It Works
            </Link>
            {/* <Link 
              to="/providers-login" 
              className={`${
                isActive('/providers-login') 
                  ? 'text-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              } transition-colors font-medium`}
            >
              Become a Provider
            </Link> */}
             <Link 
              to="/login" 
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Find Services
            </Link>
            {/* <Link 
              to="/waitlist" 
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Join Waitlist
            </Link> */}
          </nav>

          <button
            className="md:hidden"
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
                } transition-colors`}
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
                } transition-colors`}
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
                } transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              {/* <Link 
                to="/providers" 
                className={`block px-3 py-2 ${
                  isActive('/providers') 
                    ? 'text-green-600' 
                    : 'text-gray-700 hover:text-green-600'
                } transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Become a Provider
              </Link> */}
              <Link 
                to="/login" 
                className="block w-full text-left bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
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