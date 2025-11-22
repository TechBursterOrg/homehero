import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import Dashboard from './Dashboard';
import Jobs from './Jobs';
import Schedule from './Schedule';
import Messages from './Messages';
import Earnings from './Earnings';
import Profile from './Profile';
import Settings from './Settings';
import Gallery from './Gallery';
import AdminVerificationPanel from '../pages/AdminVerificationPanel'

// Types
interface UserData {
  isEmailVerified: boolean;
  userType: 'provider' | 'customer' | 'both';
  country?: 'UK' | 'USA' | 'CANADA' | 'NIGERIA';
}

// Helper function to get user data
const getUserData = (): UserData | null => {
  try {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

const ProviderLayout: React.FC = () => {
  const [notifications, setNotifications] = useState<number>(3);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const location = useLocation();

  // Get user data on component mount
  useEffect(() => {
    const userData = getUserData();
    
    // Auto-close sidebar on route change for mobile
    setSidebarOpen(false);
  }, [location.pathname]);

  // Verify user is actually a provider
  const userData = getUserData();
  if (userData && userData.userType && userData.userType !== 'provider' && userData.userType !== 'both') {
    // User is not a provider, redirect to customer dashboard
    return <Navigate to="/customer" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          notifications={notifications}
          setSidebarOpen={setSidebarOpen}
        />
        
        <div className="flex-1 overflow-auto">
          <Routes>
            {/* Default route redirects to dashboard */}
            <Route path="/" element={<Navigate to="/provider/dashboard" replace />} />
            
            {/* Provider routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/earnings" element={<Earnings />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
<Route path="/verification" element={<AdminVerificationPanel />} />
            
            {/* Catch-all redirect to dashboard */}
            <Route path="*" element={<Navigate to="/provider/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default ProviderLayout;