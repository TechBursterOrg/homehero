import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, User, Menu } from 'lucide-react';

interface TopBarProps {
  notifications: number;
  setSidebarOpen: (open: boolean) => void;
}

interface UserProfile {
  name: string;
  profileImage: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const TopBar: React.FC<TopBarProps> = ({ notifications, setSidebarOpen }) => {
  const location = useLocation();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    profileImage: ''
  });
  
  // Get the current page title from the path
  const getPageTitle = (): string => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/jobs')) return 'Jobs';
    if (path.includes('/schedule')) return 'Schedule';
    if (path.includes('/messages')) return 'Messages';
    if (path.includes('/earnings')) return 'Earnings';
    if (path.includes('/gallery')) return 'Gallery';
    if (path.includes('/profile')) return 'Profile';
    if (path.includes('/settings')) return 'Settings';
    return 'Dashboard'; // Default
  };

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.user) {
          const user = data.data.user;
          setUserProfile({
            name: user.name || '',
            profileImage: user.profileImage || user.profilePicture || ''
          });
        }
      }
    } catch (err) {
      console.error('TopBar profile fetch error:', err);
    }
  };

  // Listen for profile updates
  useEffect(() => {
    fetchUserProfile();
    
    // Listen for custom events when profile is updated
    const handleProfileUpdate = () => {
      fetchUserProfile();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    // Also check periodically for updates
    const interval = setInterval(fetchUserProfile, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      clearInterval(interval);
    };
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const getProfileImageUrl = (imageUrl: string) => {
    if (!imageUrl) return '';
    return imageUrl.startsWith('/') ? `${API_BASE_URL}${imageUrl}` : imageUrl;
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            {getPageTitle()}
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <Bell className="w-6 h-6 text-gray-600 hover:text-gray-900" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {notifications}
                </span>
              )}
            </button>
          </div>
          
          {/* Updated profile image button */}
          <div className="relative group">
            <button className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-200 hover:scale-105 overflow-hidden">
              {userProfile.profileImage ? (
                <>
                  <img
                    src={getProfileImageUrl(userProfile.profileImage)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                  <User className="w-4 h-4 text-white hidden" />
                </>
              ) : (
                <span className="text-white font-bold text-sm">
                  {getInitials(userProfile.name)}
                </span>
              )}
            </button>
            
            {/* Tooltip */}
            <div className="absolute right-0 top-full mt-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              {userProfile.name || 'Profile'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;