// Customer.tsx - Updated with BookingModal integration
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
import BookingModal from '../customercomponents/BookingModal'; // Import BookingModal
import MapView from '../customercomponents/MapView';
import ProvidersList from '../customercomponents/ProvidersList';

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

interface ExtendedUserProfile extends UserProfile {
  id: string;
}

const CustomerContent: React.FC = () => {
  // State for search parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocationAddress, setCurrentLocationAddress] = useState('');
  
  // Active search parameters that trigger provider list updates
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [activeLocationQuery, setActiveLocationQuery] = useState('');
  const [searchTrigger, setSearchTrigger] = useState(0); // Force re-fetch trigger
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [serviceType, setServiceType] = useState<ServiceType>('immediate');
  const [showPostJob, setShowPostJob] = useState(false);
  
  // BookingModal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedProviderForBooking, setSelectedProviderForBooking] = useState<ProviderType | null>(null);
  
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchRadius, setSearchRadius] = useState(10);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ProviderType | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const navigate = useNavigate();
  
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

  const [chatState] = useState<ChatState>({
    conversations: [],
    activeConversation: null,
    messages: {}
  });

  const unreadMessagesCount = chatState.conversations.reduce(
    (total, conv) => total + (conv.unreadCount || 0),
    0
  );

  // Load auth token and initial data
  useEffect(() => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    setAuthToken(token);
    
    if (token) {
      loadUserProfile(token);
    }

    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error parsing favorites:', error);
      }
    }

    // Trigger initial search on component mount
    setActiveSearchQuery('');
    setActiveLocationQuery('');
    setSearchTrigger(prev => prev + 1);
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
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('favorites');
      setAuthToken(null);
      navigate('/login');
    }
  };

  const handleServiceClick = (service: Service) => {
    // Update both display and active search states
    setSearchQuery(service.name);
    setActiveSearchQuery(service.name);
    setSearchTrigger(prev => prev + 1);
    
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

  // Enhanced location change handler with proper state updates
  const handleLocationChange = (location: LocationData) => {
    console.log('Location changed:', location);
    
    // Update both display and active location states
    setCurrentLocationAddress(location.address);
    setActiveLocationQuery(location.address);
    setUserLocation(location.coordinates);
    
    // Force providers list to re-fetch with new location
    setSearchTrigger(prev => prev + 1);
  };

  // Enhanced search handler with better parameter handling
  const handleSearch = (query: string, location: string, serviceType: 'immediate' | 'long-term') => {
    console.log('Search triggered with:', {
      query,
      location,
      serviceType,
      radius: searchRadius
    });

    // Update active search parameters to trigger ProvidersList re-fetch
    setActiveSearchQuery(query || ''); // Ensure empty string instead of undefined
    setActiveLocationQuery(location || ''); // Default location
    setServiceType(serviceType);
    
    // Force re-fetch
    setSearchTrigger(prev => prev + 1);
    
    // Scroll to providers section
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

  // Service type change should trigger search
  const handleServiceTypeChange = (type: 'immediate' | 'long-term') => {
    console.log('Service type changed to:', type);
    setServiceType(type);
    // Trigger search with current parameters
    handleSearch(searchQuery, currentLocationAddress, type);
  };

  // Search radius change should trigger search
  const handleSearchRadiusChange = (radius: number) => {
    console.log('Search radius changed to:', radius);
    setSearchRadius(radius);
    setSearchTrigger(prev => prev + 1); // Force refresh of providers
  };

  // NEW: Updated handleProviderBook to open BookingModal instead of direct booking
  const handleProviderBook = (provider: ProviderType) => {
    const token = authToken || localStorage.getItem('authToken') || localStorage.getItem('token');
    
    if (!token) {
      alert('Please log in to book a service');
      return;
    }

    // Open the booking modal with the selected provider
    setSelectedProviderForBooking(provider);
    setShowBookingModal(true);
  };

  // NEW: Handle booking confirmation from BookingModal
  // NEW: Handle booking confirmation from BookingModal
const handleBookingConfirm = async (bookingData: any) => {
  try {
    const token = authToken || localStorage.getItem('authToken') || localStorage.getItem('token');
    
    if (!token) {
      alert('Please log in to book a service');
      return;
    }

    console.log('Submitting booking data:', bookingData);

    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      alert('Booking request sent successfully!');
      setShowBookingModal(false);
      setSelectedProviderForBooking(null);
      
      // You might want to refresh the bookings list or show a notification
    } else {
      throw new Error(result.message || 'Failed to book service');
    }
  } catch (error) {
    console.error('Booking error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    alert(`Failed to book service: ${errorMessage}`);
    throw error; // Re-throw so BookingModal can handle the error state
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

  const handlePostJob = async (jobData: {
    serviceType: string;
    description: string;
    location: string;
    urgency: string;
    timeframe: string;
    budget: string;
    category: string;
  }) => {
    try {
      const token = authToken || localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        alert('Please log in to post a job');
        return;
      }

      const serviceRequestData = {
        serviceType: jobData.serviceType,
        description: jobData.description,
        location: jobData.location,
        urgency: jobData.urgency,
        timeframe: jobData.timeframe,
        budget: jobData.budget,
        category: jobData.category,
        status: 'pending'
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
        alert('Job posted successfully! Providers can now see your job.');
        setSearchQuery('');
        setShowPostJob(false);
        
        // Refresh the providers list to show the new job
        setSearchTrigger(prev => prev + 1);
      } else {
        alert('Failed to post job: ' + data.message);
      }
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Error posting job. Please try again.');
    }
  };

  const handleProviderSelect = (provider: ProviderType) => {
    setSelectedProvider(provider);
  };

  const handleProviderCall = (provider: ProviderType) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
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
        setServiceType={handleServiceTypeChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLocationChange={handleLocationChange}
        currentLocation={currentLocationAddress}
        onSearch={handleSearch}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchRadius={searchRadius}
        onSearchRadiusChange={handleSearchRadiusChange}
        onPostJob={() => setShowPostJob(true)}
      />

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

      {/* ProvidersList with enhanced props */}
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
            providers={[]}
            userLocation={userLocation}
            selectedProvider={selectedProvider}
            onProviderSelect={handleProviderSelect}
            onBook={handleProviderBook}
            searchRadius={searchRadius}
          />
        ) : (
          <ProvidersList
            key={`${searchTrigger}-${activeSearchQuery}-${activeLocationQuery}-${serviceType}-${searchRadius}`}
            serviceType={serviceType}
            searchQuery={activeSearchQuery}
            location={activeLocationQuery}
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
                id: profileData.id,
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

        {/* Modals */}
        <PostJobModal
          isOpen={showPostJob}
          onClose={() => setShowPostJob(false)}
          onSubmit={handlePostJob}
        />

        {/* NEW: BookingModal */}
        {selectedProviderForBooking && (
  <BookingModal
    isOpen={showBookingModal}
    provider={selectedProviderForBooking}
    currentUser={profileData}
    onClose={() => {
      setShowBookingModal(false);
      setSelectedProviderForBooking(null);
    }}
    onConfirm={handleBookingConfirm}
    serviceType={serviceType}
    authToken={authToken || undefined}
  />
)}
      </main>
    </div>
  );
};

const Customer: React.FC = () => {
  return <CustomerContent />;
};

export default Customer;