import React from 'react';
import { Bell, User, Menu } from 'lucide-react';

interface TopBarProps {
  activeTab: string;
  notifications: number;
  setSidebarOpen: (open: boolean) => void;
}

const TopBar: React.FC<TopBarProps> = ({ activeTab, notifications, setSidebarOpen }) => {
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
          <h2 className="text-lg font-semibold text-gray-900 capitalize">
            {activeTab === 'messages' ? 'Messages' : activeTab}
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
          
          <button className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-200 hover:scale-105">
            <User className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;