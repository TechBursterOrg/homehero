import React, { useState } from 'react';
import { Menu, X, Home } from 'lucide-react';

interface HeaderProps {
  scrollY: number;
}

const Header: React.FC<HeaderProps> = ({ scrollY }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrollY > 50 ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              HomeHero
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Services
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              How It Works
            </a>
            <a href="#providers" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Become a Provider
            </a>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Get Started
            </button>
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
              <a href="#services" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                Services
              </a>
              <a href="#how-it-works" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                How It Works
              </a>
              <a href="#providers" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                Become a Provider
              </a>
              <button className="w-full text-left bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;