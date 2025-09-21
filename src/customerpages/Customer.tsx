// Customer.tsx
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
import BookingModal from '../customercomponents/BookingModal';
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
  const [searchTrigger, setSearchTrigger] = useState(0);
  
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

  const checkTokenValidity = async (token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      return false;
    }

    return response.ok;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};


const handleAPICall = async (url: string, options: RequestInit = {}) => {
  const token = authToken || localStorage.getItem('authToken') || localStorage.getItem('token');
  
  if (!token) {
    navigate('/login');
    throw new Error('Authentication required');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    setAuthToken(null);
    navigate('/login');
    throw new Error('Session expired');
  }

  return response;
};


  useEffect(() => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  
  const initializeApp = async () => {
    if (token) {
      const isValid = await checkTokenValidity(token);
      if (isValid) {
        setAuthToken(token);
        await loadUserProfile(token);
      } else {
        // Redirect to login if token is invalid
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
    } else {
      // No token found, redirect to login
      navigate('/login');
      return;
    }

    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error parsing favorites:', error);
      }
    }

    setActiveSearchQuery('');
    setActiveLocationQuery('');
    setSearchTrigger(prev => prev + 1);
  };

  initializeApp();
}, [navigate]);


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

  const handleLocationChange = (location: LocationData) => {
    setCurrentLocationAddress(location.address);
    setActiveLocationQuery(location.address);
    setUserLocation(location.coordinates);
    setSearchTrigger(prev => prev + 1);
  };

  const handleSearch = (query: string, location: string, serviceType: 'immediate' | 'long-term') => {
    setActiveSearchQuery(query || '');
    setActiveLocationQuery(location || '');
    setServiceType(serviceType);
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

  const handleServiceTypeChange = (type: 'immediate' | 'long-term') => {
    setServiceType(type);
    handleSearch(searchQuery, currentLocationAddress, type);
  };

  const handleSearchRadiusChange = (radius: number) => {
    setSearchRadius(radius);
    setSearchTrigger(prev => prev + 1);
  };

  const handleProviderBook = (provider: ProviderType) => {
    const token = authToken || localStorage.getItem('authToken') || localStorage.getItem('token');
    
    if (!token) {
      alert('Please log in to book a service');
      return;
    }

    setSelectedProviderForBooking(provider);
    setShowBookingModal(true);
  };

  const handleBookingConfirm = async (bookingData: any) => {
    try {
      const token = authToken || localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        alert('Please log in to book a service');
        return;
      }

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
      } else {
        throw new Error(result.message || 'Failed to book service');
      }
    } catch (error) {
      console.error('Booking error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to book service: ${errorMessage}`);
      throw error;
    }
  };

  const handleToggleFavorite = async (providerId: string) => {
  try {
    const method = favorites.includes(providerId) ? 'DELETE' : 'POST';
    const response = await handleAPICall(`${API_BASE_URL}/api/favorites/${providerId}`, {
      method,
    });

    if (response.ok) {
      const newFavorites = favorites.includes(providerId)
        ? favorites.filter(id => id !== providerId)
        : [...favorites, providerId];
      
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    }
  } catch (err) {
    console.error('Error toggling favorite:', err);
    alert('Failed to update favorites. Please try again.');
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
        alert('Job posted successfully!');
        setSearchQuery('');
        setShowPostJob(false);
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
          <Route 
            path="jobs" 
            element={
              <JobsPage 
                authToken={authToken}
                userId={profileData.id}
              />
            } 
          />
          <Route 
            path="profile" 
            element={
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
            } 
          />
          <Route 
            path="favorites" 
            element={
              <FavoritesPage 
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onBook={handleProviderBook}
                onMessage={handleProviderMessage}
                onCall={handleProviderCall}
              />
            } 
          />
          <Route 
            path="messages" 
            element={
              <MessagesPage
                chatState={chatState}
                onSendMessage={() => {}}
                onStartConversation={() => {}}
                onSetActiveConversation={() => {}}
              />
            } 
          />
        </Routes>

        <PostJobModal
          isOpen={showPostJob}
          onClose={() => setShowPostJob(false)}
          onSubmit={handlePostJob}
        />

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