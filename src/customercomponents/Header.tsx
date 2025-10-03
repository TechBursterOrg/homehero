import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Bell,
  User,
  Menu,
  X,
  MessageCircle,
  Home,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  unreadMessagesCount?: number;
  onLogout: () => void;
}

// Extended interface to include role
interface ExtendedUserProfile extends UserProfile {
  role?: 'customer' | 'provider';
}

const Header: React.FC<HeaderProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  unreadMessagesCount = 0,
  onLogout
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileData, setProfileData] = useState<ExtendedUserProfile>({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    avatar: null,
    role: 'customer'
  });
  const [loading, setLoading] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fetchingRef = useRef(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? "https://backendhomeheroes.onrender.com" 
    : "http://localhost:3001";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch profile data only once on mount
  useEffect(() => {
    const fetchProfileData = async () => {
      // Prevent multiple simultaneous fetches
      if (fetchingRef.current || profileLoaded) {
        return;
      }

      try {
        fetchingRef.current = true;
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          console.error('No authentication token found');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setProfileData({
              name: data.data.user.name || '',
              email: data.data.user.email || '',
              phone: data.data.user.phone || '',
              address: data.data.user.address || '',
              bio: data.data.user.bio || '',
              avatar: data.data.user.profileImage 
                ? `${API_BASE_URL}${data.data.user.profileImage}` 
                : null,
              role: 'customer' // Set default role
            });
            setProfileLoaded(true);
          }
        } else {
          console.error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };

    fetchProfileData();
  }, [API_BASE_URL]); // Remove location.pathname dependency

  // Update role based on current path without refetching
  useEffect(() => {
    if (profileLoaded) {
      const currentRole = location.pathname.startsWith('/provider') ? 'provider' : 'customer';
      setProfileData(prev => ({
        ...prev,
        role: currentRole
      }));
    }
  }, [location.pathname, profileLoaded]);

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
    setIsDropdownOpen(false);
  };

  const isActivePath = (path: string) => {
    if (path === '/customer') {
      return location.pathname === '/customer' || location.pathname === '/customer/';
    }
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await onLogout();
      setIsMenuOpen(false);
      setIsDropdownOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/login');
    }
  };

  // Show loading state only on initial load, not on navigation
  if (loading && !profileLoaded) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                HomeHeroes
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="animate-pulse bg-gray-200 rounded-full w-10 h-10"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

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
              className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity focus:outline-none"
            >
              HomeHeroes
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`text-sm font-medium transition-colors duration-200 relative focus:outline-none ${
                  isActivePath(item.path) ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
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
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Quick Messages Button - Mobile Only */}
            <button
              onClick={() => handleNavigation('/customer/messages')}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors md:hidden focus:outline-none"
            >
              <MessageCircle className="w-5 h-5" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                </span>
              )}
            </button>
            
            {/* Desktop Profile Dropdown */}
            <div className="hidden md:flex items-center space-x-3 relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg p-2 transition-colors duration-200 focus:outline-none"
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
                  <p className="text-sm font-medium text-gray-900">{profileData.name || 'User'}</p>
                  <p className="text-xs text-gray-600 capitalize">{profileData.role || 'customer'}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  <button
                    onClick={() => handleNavigation('/customer/profile')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile Settings
                  </button>
                  <hr className="my-2 border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors focus:outline-none"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
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
                className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none ${
                  isActivePath(item.path) ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{item.label}</span>
                {item.id === 'messages' && unreadMessagesCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                  </span>
                )}
              </button>
            ))}
            <button
              onClick={() => {
                navigate('/customer/profile');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-50 focus:outline-none"
            >
              Profile
            </button>
            <hr className="my-2 border-gray-200" />
            <button 
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors focus:outline-none"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;