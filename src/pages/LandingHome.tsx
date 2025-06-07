import  { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import Dashboard from './Dashboard';
import Jobs from './Jobs';
import Schedule from './Schedule';
import Messages from './Messages';
import Earnings from './Earnings';
import Profile from './Profile';
import Settings from './Settings';

const LandingHome = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState(3);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'jobs':
        return <Jobs />;
      case 'schedule':
        return <Schedule />;
      case 'messages':
        return <Messages notifications={notifications} setNotifications={setNotifications} />;
      case 'earnings':
        return <Earnings />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        notifications={notifications}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          activeTab={activeTab} 
          notifications={notifications}
          setSidebarOpen={setSidebarOpen}
        />
        
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default LandingHome;