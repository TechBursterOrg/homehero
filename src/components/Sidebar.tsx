import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Briefcase, 
  Calendar, 
  MessageSquare, 
  DollarSign, 
  Settings, 
  User,
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  notifications: number;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  notifications, 
  sidebarOpen, 
  setSidebarOpen 
}) => {
  const location = useLocation();
  
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/provider/dashboard' },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, path: '/provider/jobs' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, path: '/provider/schedule' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/provider/messages' },
    { id: 'earnings', label: 'Earnings', icon: DollarSign, path: '/provider/earnings' },
    { id: 'Gallery', label: 'Gallery', icon: DollarSign, path: '/provider/gallery' },
    { id: 'profile', label: 'Profile', icon: User, path: '/provider/profile' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/provider/settings' },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
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
        fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-white shadow-lg flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo & Close Button */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              HomeHero
            </span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={handleLinkClick}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-green-50 text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`} />
                    <span className="font-medium">{item.label}</span>
                    {item.id === 'messages' && notifications > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-auto animate-pulse">
                        {notifications}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Alex Rodriguez</p>
              <p className="text-sm text-gray-600">Provider</p>
            </div>
          </div>
          <Link to="/login" className="w-full flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors group">
            <LogOut className="w-5 h-5 group-hover:text-red-500 transition-colors" />
            <span className="group-hover:text-red-500 transition-colors">Sign Out</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;