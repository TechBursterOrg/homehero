import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Bell,
  User,
  Menu,
  X,
  MessageCircle,
  Home
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  profileData: UserProfile;
  unreadMessagesCount?: number;
}

const Header: React.FC<HeaderProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  unreadMessagesCount = 0,
  profileData
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { id: 'services', label: 'Find Services', path: '/customer' },
    { id: 'bookings', label: 'My Bookings', path: '/customer/bookings' },
    { id: 'jobs', label: 'My Jobs', path: '/customer/jobs' },
    { id: 'favorites', label: 'Favorites', path: '/customer/favorites' },
    { id: 'messages', label: 'Messages', path: '/customer/messages' }
  ] as const;

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const isActivePath = (path: string) => {
    if (path === '/customer') {
      return location.pathname === '/customer' || location.pathname === '/customer/';
    }
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <button
              onClick={() => navigate('/customer')}
              className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              HomeHero
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`text-sm font-medium transition-colors duration-200 relative ${
                  isActivePath(item.path) ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
                {/* Add unread indicator for Messages */}
                {item.id === 'messages' && unreadMessagesCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Quick Messages Button - Mobile Only */}
            <button
              onClick={() => handleNavigation('/customer/messages')}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
            >
              <MessageCircle className="w-5 h-5" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                </span>
              )}
            </button>
            
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={() => {/* Add profile navigation if needed */}}
                className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg p-2 transition-colors duration-200"
              >
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{profileData.name}</p>
                  <p className="text-xs text-gray-600">Customer</p>
                </div>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActivePath(item.path) ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{item.label}</span>
                {/* Add unread indicator for Messages in mobile menu */}
                {item.id === 'messages' && unreadMessagesCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                  </span>
                )}
              </button>
            ))}
            <button
              onClick={() => {
                // Add profile navigation if needed
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-50"
            >
              Profile
            </button>
            <hr className="my-2 border-gray-200" />
            <button className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;