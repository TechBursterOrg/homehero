import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import Dashboard from './Dashboard';
import Jobs from './Jobs';
import Schedule from './Schedule';
import Messages from './Messages';
import Earnings from './Earnings';
import Profile from './Profile';
import Settings from './Settings';

const ProviderLayout = () => {
  const [notifications, setNotifications] = useState(3);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        notifications={notifications}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          notifications={notifications}
          setSidebarOpen={setSidebarOpen}
        />
        
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/provider/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/messages" element={<Messages notifications={notifications} setNotifications={setNotifications} />} />
            <Route path="/earnings" element={<Earnings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default ProviderLayout;