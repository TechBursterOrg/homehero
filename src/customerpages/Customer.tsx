// Customer.tsx - Fixed version that uses ProvidersList component
import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Sparkles, 
  MoreVertical
} from 'lucide-react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ProfilePage  from '../customercomponents/CustomerProfile';

// Components
import Header from '../customercomponents/Header';
import HeroSection from '../customercomponents/HeroSection';
import ServiceCard from '../customercomponents/ServiceCard';
import PostJobModal from '../customercomponents/PostJobModal';
import MapView from '../customercomponents/MapView';
import ProvidersList from '../customercomponents/ProvidersList'; // Import ProvidersList

// Pages
import BookingsPage from './BookingsPage';
import JobsPage from './JobsPage';
import FavoritesPage from './FavoritesPage';
import MessagesPage from './MessagesPage';

// Types and Data
import { 
  ServiceType, 
  UserProfile,
  Service, 
  Provider as ProviderType, 
  LocationData,
  ChatState
} from '../types';
import { services } from '../data/mockData';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? "https://backendhomeheroes.onrender.com" 
  : "http://localhost:3001";

// Extended UserProfile interface to include id
interface ExtendedUserProfile extends UserProfile {
  id: string;
}

const CustomerContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [serviceType, setServiceType] = useState<ServiceType>('immediate');
  const [showPostJob, setShowPostJob] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchRadius, setSearchRadius] = useState(10);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [currentLocationAddress, setCurrentLocationAddress] = useState('Lagos, Nigeria');
  const [selectedProvider, setSelectedProvider] = useState<ProviderType | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Add ref for providers section
  const providersRef = useRef<HTMLDivElement>(null);
  
  const [profileData, setProfileData] = useState<ExtendedUserProfile>({
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345',
    bio: 'Homeowner looking for reliable service providers for regular maintenance and repairs.',
    avatar: null
  });

  // Chat state (minimal implementation to avoid errors)
  const [chatState] = useState<ChatState>({
    conversations: [],
    activeConversation: null,
    messages: {}
  });

  const unreadMessagesCount = chatState.conversations.reduce(
    (total, conv) => total + (conv.unreadCount || 0),
    0
  );

  // Load auth token on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    setAuthToken(token);
    
    // Load user profile if token exists
    if (token) {
      loadUserProfile(token);
    }

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error parsing favorites:', error);
      }
    }
  }, []);

  const loadUserProfile = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.user) {
          setProfileData({
            id: data.data.user._id,
            name: data.data.user.name,
            email: data.data.user.email,
            phone: data.data.user.phoneNumber || '+1 (555) 123-4567',
            address: data.data.user.address || '123 Main St, City, State 12345',
            bio: 'Homeowner looking for reliable service providers for regular maintenance and repairs.',
            avatar: data.data.user.profileImage || null
          });
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const token = authToken || localStorage.getItem('authToken') || localStorage.getItem('token');
      if (token) {
        const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Logout failed');
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage and redirect
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('favorites');
      setAuthToken(null);
      navigate('/login');
    }
  };

  const handleServiceClick = (service: Service) => {
    setSearchQuery(service.name);
    
    if (providersRef.current) {
      const yOffset = -100;
      const element = providersRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  const handleProviderBook = async (provider: ProviderType) => {
    try {
      const token = authToken || localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        alert('Please log in to book a service');
        return;
      }

      const bookingData = {
        providerId: provider._id || provider.id,
        serviceType: provider.services[0] || 'General Service',
        description: `Booking for ${provider.services[0]}`,
        location: currentLocationAddress,
        timeframe: 'ASAP',
        budget: provider.priceRange,
        contactInfo: {
          phone: profileData.phone,
          email: profileData.email
        }
      };

      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        alert('Booking request sent successfully!');
      } else {
        alert('Failed to book service. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Error booking service. Please try again.');
    }
  };

  const handleToggleFavorite = async (providerId: string) => {
    try {
      const token = authToken || localStorage.getItem('authToken') || localStorage.getItem('token');
      
      const newFavorites = favorites.includes(providerId)
        ? favorites.filter(id => id !== providerId)
        : [...favorites, providerId];
      
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      
      if (token) {
        // Also update on server
        await fetch(`${API_BASE_URL}/api/providers/${providerId}/favorite`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handlePostJob = async () => {
    try {
      const token = authToken || localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        alert('Please log in to post a job');
        return;
      }

      const serviceRequestData = {
        serviceType: searchQuery,
        description: searchQuery,
        location: currentLocationAddress,
        urgency: serviceType === 'immediate' ? 'urgent' : 'normal',
        timeframe: serviceType === 'immediate' ? 'ASAP' : 'Flexible',
        budget: 'Negotiable',
        category: 'general'
      };

      const response = await fetch(`${API_BASE_URL}/api/service-requests`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(serviceRequestData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Job posted successfully!');
        setSearchQuery('');
        setShowPostJob(false);
      } else {
        alert('Failed to post job: ' + data.message);
      }
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Error posting job. Please try again.');
    }
  };

  const handleLocationChange = (location: LocationData) => {
    setCurrentLocationAddress(location.address);
    setUserLocation(location.coordinates);
  };

  const handleSearch = () => {
    console.log('Searching with:', {
      query: searchQuery,
      location: currentLocationAddress,
      radius: searchRadius,
      serviceType
    });
    
    // Scroll to providers section after search
    if (providersRef.current) {
      const yOffset = -100;
      const element = providersRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  const handleProviderSelect = (provider: ProviderType) => {
    setSelectedProvider(provider);
  };

  const handleProviderCall = (provider: ProviderType) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Use phoneNumber from provider if available, otherwise fallback
    const phoneNumber = provider.phoneNumber || '+1 (555) 000-0000';
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
    
    if (isMobile) {
      window.location.href = `tel:${cleanPhoneNumber}`;
      console.log(`Initiating call to ${provider.name} at ${phoneNumber}`);
    } else {
      const userChoice = window.confirm(
        `Call ${provider.name}?\n\nPhone: ${phoneNumber}\n\nClick OK to copy the number to clipboard, or Cancel to close.`
      );
      
      if (userChoice) {
        navigator.clipboard.writeText(phoneNumber).then(() => {
          alert(`Phone number ${phoneNumber} copied to clipboard!`);
        }).catch(() => {
          prompt('Copy this phone number:', phoneNumber);
        });
      }
    }
    
    console.log(`Call initiated to provider: ${provider.name} - ${phoneNumber}`);
  };

  const handleProviderMessage = async (provider: ProviderType) => {
    try {
      const token = authToken || localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        alert('Please log in to message providers');
        return;
      }

      // Create or get conversation with provider
      const response = await fetch(`${API_BASE_URL}/api/messages/conversation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          participantIds: [profileData.id, provider._id || provider.id]
        })
      });

      if (response.ok) {
        navigate('/customer/messages');
      } else {
        alert('Failed to start conversation');
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      alert('Error starting conversation. Please try again.');
    }
  };

  // Home/Dashboard Component
  const HomePage = () => (
    <div className="space-y-8">
      <HeroSection
        serviceType={serviceType}
        setServiceType={setServiceType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLocationChange={handleLocationChange}
        currentLocation={currentLocationAddress}
        onSearch={handleSearch}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchRadius={searchRadius}
        onSearchRadiusChange={setSearchRadius}
        onPostJob={() => setShowPostJob(true)}
      />
      
      {/* Debug button */}
      <div className="bg-yellow-100 p-4 rounded-lg mb-4">
        <button 
          onClick={async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/api/debug/providers`);
              const data = await response.json();
              console.log('🔍 Debug API response:', data);
              alert(`Found ${data.count} providers in database`);
            } catch (error) {
              console.error('Debug failed:', error);
              const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
              alert('Debug failed: ' + errorMessage);
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Debug Providers API
        </button>

        <button 
      onClick={async () => {
        try {
          console.log('🔨 Creating test providers...');
          const response = await fetch(`${API_BASE_URL}/api/debug/create-test-providers`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          console.log('📊 Create test providers response:', data);
          alert(`Create Test Providers: ${data.success ? 'SUCCESS' : 'FAILED'}\nMessage: ${data.message}`);
        } catch (error) {
          console.error('❌ Create test providers failed:', error);
          
        }
      }}
      className="bg-green-500 text-white px-4 py-2 rounded text-sm"
    >
      Create Test Providers
    </button>

    

      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {serviceType === 'immediate' ? 'Available Now' : 'Popular Services'}
          </h2>
          <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
            <span>View all</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              serviceType={serviceType}
              onClick={handleServiceClick}
            />
          ))}
        </div>
      </div>

      {/* FIXED: Now using ProvidersList component instead of manual mapping */}
      <div ref={providersRef} className="space-y-6" id="providers-section">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {serviceType === 'immediate' ? 'Available Providers' : 'Top Rated Providers'}
          </h2>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <MoreVertical className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {viewMode === 'map' ? (
          <MapView
            providers={[]} // MapView will need to be updated to work with ProvidersList
            userLocation={userLocation}
            selectedProvider={selectedProvider}
            onProviderSelect={handleProviderSelect}
            onBook={handleProviderBook}
            searchRadius={searchRadius}
          />
        ) : (
          <ProvidersList
            serviceType={serviceType}
            searchQuery={searchQuery}
            location={currentLocationAddress}
            onBook={handleProviderBook}
            onMessage={handleProviderMessage}
            onCall={handleProviderCall}
            onToggleFavorite={handleToggleFavorite}
            authToken={authToken || undefined}
            currentUser={profileData}
            favorites={favorites}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        unreadMessagesCount={unreadMessagesCount}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="profile" element={
            <ProfilePage 
              profileData={{
                ...profileData,
                avatar: profileData.avatar ?? undefined
              }}
              onProfileUpdate={(data) => setProfileData({
                ...data,
                id: profileData.id, // Preserve the existing ID
                avatar: data.avatar ?? null
              })}
            />
          } />
          <Route path="favorites" element={
            <FavoritesPage 
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onBook={handleProviderBook}
              onMessage={handleProviderMessage}
              onCall={handleProviderCall}
            />
          } />
          <Route path="messages" element={
            <MessagesPage
              chatState={chatState}
              onSendMessage={() => {}}
              onStartConversation={() => {}}
              onSetActiveConversation={() => {}}
            />
          } />
        </Routes>

        <PostJobModal
          isOpen={showPostJob}
          onClose={() => setShowPostJob(false)}
          onSubmit={handlePostJob}
        />
      </main>
    </div>
  );
};

const Customer: React.FC = () => {
  return <CustomerContent />;
};

export default Customer;