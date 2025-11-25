import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Briefcase, 
  Calendar, 
  MessageSquare, 
  DollarSign, 
  Settings, 
  User,
  LogOut,
  X,
  Image,
  Bell,
  Shield
} from 'lucide-react';
import logo from '../../public/HHH.png'

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface UserProfile {
  name: string;
  profileImage: string;
  userType: string;
}

interface NotificationCount {
  messages: number;
  total: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const Sidebar: React.FC<SidebarProps> = ({ 
  sidebarOpen, 
  setSidebarOpen 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    profileImage: '',
    userType: 'provider'
  });
  const [notificationCount, setNotificationCount] = useState<NotificationCount>({
    messages: 0,
    total: 0
  });
  
  const baseSidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/provider/dashboard' },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, path: '/provider/jobs' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, path: '/provider/schedule' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/provider/messages' },
    { id: 'earnings', label: 'Earnings', icon: DollarSign, path: '/provider/earnings' },
    { id: 'gallery', label: 'Gallery', icon: Image, path: '/provider/gallery' },
    { id: 'profile', label: 'Profile', icon: User, path: '/provider/profile' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/provider/settings' },
  ];

  // Admin sidebar item - only shown to Peter
  const adminSidebarItem = {
    id: 'admin',
    label: 'Admin Panel',
    icon: Shield,
    path: '/provider/verification'
  };

  // Check if user is Peter to show admin button
  const isPeter = userProfile.name.toLowerCase().includes('peter vjj');

  // Combine sidebar items - add admin item if user is Peter
  const sidebarItems = isPeter 
    ? [...baseSidebarItems, adminSidebarItem]
    : baseSidebarItems;

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
            name: user.name || 'User',
            profileImage: user.profileImage || user.profilePicture || '',
            userType: user.userType || 'provider'
          });
        }
      }
    } catch (err) {
      console.error('Sidebar profile fetch error:', err);
    }
  };

  // Fetch notification counts
  const fetchNotificationCounts = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) return;

      // Fetch unread messages count
      const messagesResponse = await fetch(`${API_BASE_URL}/api/messages/unread-count`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Fetch total unread notifications count
      const notificationsResponse = await fetch(`${API_BASE_URL}/api/notifications/unread-count`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      let messagesCount = 0;
      let totalCount = 0;

      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        messagesCount = messagesData.data?.count || 0;
      }

      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json();
        totalCount = notificationsData.data?.count || 0;
      }

      setNotificationCount({
        messages: messagesCount,
        total: totalCount
      });
    } catch (err) {
      console.error('Sidebar notification count fetch error:', err);
    }
  };

  // Listen for profile updates and notifications
  useEffect(() => {
    fetchUserProfile();
    fetchNotificationCounts();
    
    // Listen for custom events when profile is updated
    const handleProfileUpdate = () => {
      fetchUserProfile();
    };

    // Listen for notification updates
    const handleNotificationUpdate = () => {
      fetchNotificationCounts();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('notificationUpdated', handleNotificationUpdate);
    
    // Poll for updates
    const profileInterval = setInterval(fetchUserProfile, 30000); // Check every 30 seconds
    const notificationInterval = setInterval(fetchNotificationCounts, 15000); // Check every 15 seconds

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('notificationUpdated', handleNotificationUpdate);
      clearInterval(profileInterval);
      clearInterval(notificationInterval);
    };
  }, []);

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      
      // Close sidebar if open
      setSidebarOpen(false);
      
      // Redirect to login page
      navigate('/provider-login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, clear storage and redirect
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      navigate('/provider-login');
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getProfileImageUrl = (imageUrl: string) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return imageUrl.startsWith('/') ? `${API_BASE_URL}${imageUrl}` : imageUrl;
  };

  const getBadgeCount = (itemId: string) => {
    switch (itemId) {
      case 'messages':
        return notificationCount.messages;
      case 'dashboard':
        return notificationCount.total > 0 ? notificationCount.total : 0;
      default:
        return 0;
    }
  };

  const shouldShowBadge = (itemId: string) => {
    const count = getBadgeCount(itemId);
    return count > 0;
  };

  const getBadgeDisplay = (itemId: string) => {
    const count = getBadgeCount(itemId);
    if (count === 0) return '';
    return count > 9 ? '9+' : count.toString();
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-white shadow-xl flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        border-r border-gray-200 overflow-y-auto
      `}>
        {/* Logo & Close Button */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-green-50 to-white">
          <Link to="/" className="flex items-center outline-none focus:outline-none">
            <img 
              src={logo} 
              alt="HomeHeroes Logo" 
              className="w-8 h-8 object-contain rounded-lg"
            />
          </Link>
          
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-green-50">
          <div className="flex items-center space-x-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-lg truncate">
                {userProfile.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  userProfile.userType === 'provider' 
                    ? 'bg-green-100 text-green-800' 
                    : userProfile.userType === 'both'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {userProfile.userType === 'both' ? 'Provider & Customer' : userProfile.userType}
                </span>
                {isPeter && (
                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-800">
                    Admin
                  </span>
                )}
                {notificationCount.total > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium animate-pulse">
                    {notificationCount.total} new
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;
              const hasBadge = shouldShowBadge(item.id);
              const badgeDisplay = getBadgeDisplay(item.id);
              const isAdminItem = item.id === 'admin';
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`group relative flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? isAdminItem
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-[1.02]'
                        : 'bg-gradient-to-r from-green-500 to-green-500 text-white shadow-lg transform scale-[1.02]'
                      : isAdminItem
                      ? 'text-purple-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-purple-50 hover:text-purple-900 hover:shadow-md border border-purple-200'
                      : 'text-gray-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-50 hover:text-gray-900 hover:shadow-md'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 transition-colors relative z-10 flex-shrink-0 ${
                    isActive 
                      ? 'text-white' 
                      : isAdminItem
                      ? 'text-purple-500 group-hover:text-purple-600'
                      : 'text-gray-400 group-hover:text-green-600'
                  }`} />
                  
                  <span className={`font-medium relative z-10 flex-1 ${
                    isActive ? 'text-white' : isAdminItem ? 'text-purple-700' : 'text-gray-700'
                  }`}>
                    {item.label}
                  </span>
                  
                  {/* Notification Badge */}
                  {hasBadge && (
                    <span className={`relative z-10 text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center flex-shrink-0 ${
                      isActive
                        ? isAdminItem
                          ? 'bg-white text-purple-600'
                          : 'bg-white text-green-600'
                        : 'bg-red-500 text-white animate-pulse'
                    }`}>
                      {badgeDisplay}
                    </span>
                  )}

                  {/* Admin Badge */}
                  {isAdminItem && !hasBadge && (
                    <span className="relative z-10 text-xs font-bold px-2 py-1 rounded-full bg-purple-100 text-purple-600 flex-shrink-0">
                      Admin
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Quick Stats & Logout Section */}
        <div className="p-4 border-t border-gray-200 ">
          {/* Admin Notice for Peter */}
          {/* {isPeter && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-700 font-medium">
                  Admin Access
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                You can verify providers in the Admin Panel
              </p>
            </div>
          )} */}
          
          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-red-50 rounded-xl transition-all duration-200 group hover:text-red-600 hover:shadow-sm border border-transparent hover:border-red-200"
          >
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <LogOut className="w-4 h-4 group-hover:text-red-500 transition-colors" />
            </div>
            <span className="font-medium group-hover:text-red-500 transition-colors flex-1 text-left">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;