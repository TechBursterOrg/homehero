import React, { useState, useEffect } from 'react';
import {
  Filter,
  ArrowRight,
  Calendar,
  CheckCircle,
  Plus,
  Sparkles,Star, DollarSign, MoreVertical
} from 'lucide-react';

// Components
import Header from '../customercomponents/Header';
import HeroSection from '../customercomponents/HeroSection';
import ServiceCard from '../customercomponents/ServiceCard';
import ProviderCard from '../customercomponents/ProviderCard';
import BookingCard from '../customercomponents/BookingCard';
import JobPostCard from '../customercomponents/JobPostCard';
import ProfileSection from '../customercomponents/ProfileSection';
import PostJobModal from '../customercomponents/PostJobModal';
import MapView from '../customercomponents/MapView';
import Messages from '../customercomponents/Message';
import { Message } from '../types';

// Types and Data
import { 
  ActiveTab, 
  ServiceType, 
  UserProfile,
  Service, 
  Provider, 
  LocationData,
  ChatState,
  Conversation
} from '../types';
import { services, providers, bookings, jobPosts } from '../data/mockData';

const Customer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('services');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [serviceType, setServiceType] = useState<ServiceType>('immediate');
  const [showPostJob, setShowPostJob] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['1', '4']);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchRadius, setSearchRadius] = useState(10);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [currentLocationAddress, setCurrentLocationAddress] = useState('San Francisco, CA');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>(providers);
  
  const [profileData, setProfileData] = useState<UserProfile>({
  name: 'John Doe',
  email: 'john.doe@email.com',
  phone: '+1 (555) 123-4567',
  address: '123 Main St, City, State 12345',
  bio: 'Homeowner looking for reliable service providers for regular maintenance and repairs.',
  avatar: null // Must be null to match the imported type
});
  // Filter providers based on service type, location, and search radius
  useEffect(() => {
    let filtered = providers;

    if (serviceType === 'immediate') {
      filtered = filtered.filter(p => p.isAvailableNow);
    }

    if (userLocation) {
      filtered = filtered.filter(p => {
        const distance = calculateDistance(userLocation, p.coordinates);
        return distance <= searchRadius;
      });
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.services.some(service => 
          service.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setFilteredProviders(filtered);
  }, [serviceType, userLocation, searchRadius, searchQuery]);

  const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const favoriteProviders = providers.filter(p => favorites.includes(p.id));

  const handleServiceClick = (service: Service) => {
    setSearchQuery(service.name);
  };

  const handleProviderBook = (provider: Provider) => {
    console.log('Book provider:', provider);
  };

  const handleToggleFavorite = (providerId: string) => {
    setFavorites(prev => 
      prev.includes(providerId)
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  const handleBookingAction = (bookingId: string, action: string) => {
    console.log('Booking action:', action, bookingId);
  };

  const handleJobAction = (jobId: string, action: string) => {
    console.log('Job action:', action, jobId);
  };

  const handlePostJob = (jobData: any) => {
    console.log('New job posted:', jobData);
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
  };

  const handleProviderSelect = (provider: Provider) => {
    setSelectedProvider(provider);
  };

  const [chatState, setChatState] = useState<ChatState>({
    conversations: [
      {
        id: 'conv-1',
        providerId: '1',
        providerName: 'Alex Johnson',
        providerAvatar: 'AJ',
        providerService: 'Plumbing',
        lastMessage: {
          id: '101',
          senderId: '1',
          receiverId: 'user',
          content: 'Hi there! When would you like me to come by for the plumbing work?',
          timestamp: new Date(Date.now() - 3600000),
          type: 'text',
          status: 'delivered'
        },
        unreadCount: 1,
        isOnline: true
      },
      {
        id: 'conv-2',
        providerId: '2',
        providerName: 'Sarah Johnson',
        providerAvatar: 'SJ',
        providerService: 'House Cleaning',
        lastMessage: {
          id: '201',
          senderId: 'user',
          receiverId: '2',
          content: 'What time works best for you this week?',
          timestamp: new Date(Date.now() - 7200000),
          type: 'text',
          status: 'read'
        },
        unreadCount: 0,
        isOnline: false,
        lastSeen: new Date(Date.now() - 1800000)
      }
    ],
    activeConversation: null,
    messages: {
      'conv-1': [
        {
          id: '101',
          senderId: '1',
          receiverId: 'user',
          content: 'Hi there! When would you like me to come by for the plumbing work?',
          timestamp: new Date(Date.now() - 3600000),
          type: 'text',
          status: 'delivered'
        },
        {
          id: '102',
          senderId: 'user',
          receiverId: '1',
          content: 'How about tomorrow at 2pm?',
          timestamp: new Date(Date.now() - 1800000),
          type: 'text',
          status: 'read'
        },
        {
          id: '103',
          senderId: '1',
          receiverId: 'user',
          content: 'Perfect! I can be there at 2pm tomorrow. Should I bring any specific tools for the job?',
          timestamp: new Date(Date.now() - 1200000),
          type: 'text',
          status: 'delivered'
        }
      ],
      'conv-2': [
        {
          id: '201',
          senderId: '2',
          receiverId: 'user',
          content: 'Hello! I saw your request for house cleaning services. I have availability this week.',
          timestamp: new Date(Date.now() - 10800000),
          type: 'text',
          status: 'read'
        },
        {
          id: '202',
          senderId: 'user',
          receiverId: '2',
          content: 'Great! What are your rates for a 3-bedroom house?',
          timestamp: new Date(Date.now() - 9000000),
          type: 'text',
          status: 'read'
        },
        {
          id: '203',
          senderId: '2',
          receiverId: 'user',
          content: 'For a 3-bedroom house, my rate is $120 for a deep clean or $80 for regular cleaning. Which would you prefer?',
          timestamp: new Date(Date.now() - 8400000),
          type: 'text',
          status: 'read'
        },
        {
          id: '204',
          senderId: 'user',
          receiverId: '2',
          content: 'What time works best for you this week?',
          timestamp: new Date(Date.now() - 7200000),
          type: 'text',
          status: 'read'
        }
      ]
    }
  });

  const handleSendMessage = (conversationId: string, content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      receiverId: conversationId,
      content,
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    };

    setChatState(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [conversationId]: [...(prev.messages[conversationId] || []), newMessage]
      },
      conversations: prev.conversations.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: newMessage,
            unreadCount: 0
          };
        }
        return conv;
      })
    }));
  };

  const handleProviderCall = (provider: Provider) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const phoneNumbers: { [key: string]: string } = {
      '1': '+1 (555) 123-4567',
      '2': '+1 (555) 234-5678',
      '3': '+1 (555) 345-6789',
      '4': '+1 (555) 456-7890',
      '5': '+1 (555) 567-8901',
      '6': '+1 (555) 678-9012'
    };
    
    const phoneNumber = phoneNumbers[provider.id] || '+1 (555) 000-0000';
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
    
    console.log(`Call initiated to provider: ${provider.name} (${provider.id}) - ${phoneNumber}`);
  };

  const handleProviderMessage = (provider: Provider) => {
    const existingConversation = chatState.conversations.find(
      conv => conv.providerId === provider.id
    );

    if (existingConversation) {
      setActiveTab('messages');
      setChatState(prev => ({
        ...prev,
        activeConversation: existingConversation.id,
        conversations: prev.conversations.map(conv => {
          if (conv.id === existingConversation.id) {
            return { ...conv, unreadCount: 0 };
          }
          return conv;
        })
      }));
    } else {
      const newConversationId = `conv-${Date.now()}`;
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        senderId: 'system',
        receiverId: 'user',
        content: `You can now chat with ${provider.name}. Start the conversation!`,
        timestamp: new Date(),
        type: 'text',
        status: 'delivered'
      };

      const newConversation: Conversation = {
        id: newConversationId,
        providerId: provider.id,
        providerName: provider.name,
        providerAvatar: provider.avatar || '',
        providerService: provider.services[0] || 'General Service',
        lastMessage: welcomeMessage,
        unreadCount: 0,
        isOnline: provider.isAvailableNow || Math.random() > 0.5,
        lastSeen: provider.isAvailableNow ? undefined : new Date(Date.now() - Math.random() * 3600000)
      };

      setChatState(prev => ({
        ...prev,
        conversations: [...prev.conversations, newConversation],
        activeConversation: newConversationId,
        messages: {
          ...prev.messages,
          [newConversationId]: [welcomeMessage]
        }
      }));

      setActiveTab('messages');
    }
  };

  const handleStartConversation = (providerId: string) => {
    console.log('Starting conversation with provider:', providerId);
    
    if (chatState.conversations.length > 0) {
      setChatState(prev => ({
        ...prev,
        activeConversation: prev.conversations[0].id
      }));
    }
  };

  const handleSetActiveConversation = (conversationId: string) => {
    setChatState(prev => ({
      ...prev,
      activeConversation: conversationId,
      conversations: prev.conversations.map(conv => {
        if (conv.id === conversationId) {
          return { ...conv, unreadCount: 0 };
        }
        return conv;
      })
    }));
  };

   const handleProfileDataChange = (data: UserProfile) => {
  setProfileData(data);
};

  const unreadMessagesCount = chatState.conversations.reduce(
    (total, conv) => total + conv.unreadCount,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        profileData={profileData}
        unreadMessagesCount={unreadMessagesCount}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'services' && (
          <div className="space-y-8">
            <HeroSection
              serviceType={serviceType}
              setServiceType={setServiceType}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onPostJob={() => setShowPostJob(true)}
              onLocationChange={handleLocationChange}
              currentLocation={currentLocationAddress}
              onSearch={handleSearch}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              searchRadius={searchRadius}
              onSearchRadiusChange={setSearchRadius}
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

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {serviceType === 'immediate' ? 'Available Providers' : 'Top Rated Providers'}
                  <span className="text-lg font-normal text-gray-600 ml-2">
                    ({filteredProviders.length} found)
                  </span>
                </h2>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>

              {viewMode === 'map' ? (
                <MapView
                  providers={filteredProviders}
                  userLocation={userLocation}
                  selectedProvider={selectedProvider}
                  onProviderSelect={handleProviderSelect}
                  onBook={handleProviderBook}
                  searchRadius={searchRadius}
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredProviders.map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      serviceType={serviceType}
                      onBook={handleProviderBook}
                      onToggleFavorite={handleToggleFavorite}
                      onMessage={handleProviderMessage}
                      onCall={handleProviderCall}
                      isFavorite={favorites.includes(provider.id)}
                    />
                  ))}
                </div>
              )}

              {filteredProviders.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No providers found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or expanding your search radius
                  </p>
                  <button
                    onClick={() => setSearchRadius(searchRadius + 10)}
                    className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200"
                  >
                    Expand Search to {searchRadius + 10} miles
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
  <div className="space-y-8">
    {/* Enhanced Header Section with Background */}
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              My Bookings
            </h1>
          </div>
          <p className="text-gray-700 text-lg font-medium max-w-md">
            Manage your service appointments and track your booking history
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="group bg-white/80 backdrop-blur-sm border border-white/50 text-gray-700 px-6 py-3 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center space-x-2 font-semibold">
            <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <span>View Calendar</span>
          </button>
          
          <button className="group bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white px-8 py-3 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 font-semibold shadow-lg">
            <Plus className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span>Book New Service</span>
          </button>
        </div>
      </div>
    </div>

    {/* Enhanced Stats Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Upcoming Bookings */}
      <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full transform translate-x-8 -translate-y-8"></div>
        
        <div className="relative flex items-start justify-between mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">2</p>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="relative">
          <h3 className="text-sm font-bold text-gray-900 mb-1">Upcoming</h3>
          <p className="text-xs text-gray-600">Next: Tomorrow at 2:00 PM</p>
          <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Completed Bookings */}
      <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-green-400/10 rounded-full transform translate-x-8 -translate-y-8"></div>
        
        <div className="relative flex items-start justify-between mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
            <CheckCircle className="w-7 h-7 text-white" />
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">12</p>
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          </div>
        </div>
        
        <div className="relative">
          <h3 className="text-sm font-bold text-gray-900 mb-1">Completed</h3>
          <p className="text-xs text-gray-600">100% success rate</p>
          <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Average Rating */}
      <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full transform translate-x-8 -translate-y-8"></div>
        
        <div className="relative flex items-start justify-between mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div className="text-right flex items-center gap-1">
            <p className="text-3xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300">4.8</p>
            <Star className="w-4 h-4 text-amber-500 fill-current" />
          </div>
        </div>
        
        <div className="relative">
          <h3 className="text-sm font-bold text-gray-900 mb-1">Avg Rating</h3>
          <p className="text-xs text-gray-600">From 12 reviews</p>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`w-3 h-3 ${star <= 4 ? 'text-amber-400 fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Total Spent */}
      <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full transform translate-x-8 -translate-y-8"></div>
        
        <div className="relative flex items-start justify-between mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
            <DollarSign className="w-7 h-7 text-white" />
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">$2.4k</p>
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          </div>
        </div>
        
        <div className="relative">
          <h3 className="text-sm font-bold text-gray-900 mb-1">Total Spent</h3>
          <p className="text-xs text-gray-600">This year</p>
          <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-4/5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>

    {/* Enhanced Bookings List */}
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
          <p className="text-gray-600 mt-1">Your latest service appointments</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-200 rounded-2xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
              <option>All Bookings</option>
              <option>Upcoming</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bookings Cards with Enhanced Animation */}
      <div className="space-y-4">
        {bookings.map((booking, index) => (
          <div
            key={booking.id}
            className="animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <BookingCard
              booking={booking}
              onReschedule={(id) => handleBookingAction(id, 'reschedule')}
              onCancel={(id) => handleBookingAction(id, 'cancel')}
              onContact={(id, method) => handleBookingAction(id, `contact-${method}`)}
            />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center pt-8">
        <button className="group bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-50 hover:to-purple-50 text-gray-700 hover:text-blue-700 px-8 py-3 rounded-2xl border border-gray-200 hover:border-blue-200 transition-all duration-300 flex items-center space-x-3 font-semibold hover:shadow-lg">
          <span>Load More Bookings</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  </div>
)}

        {activeTab === 'jobs' && (
  <div className="space-y-6 md:space-y-8">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Job Posts</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your long-term service contracts</p>
      </div>
      <button
        onClick={() => setShowPostJob(true)}
        className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 w-full sm:w-auto text-sm sm:text-base"
      >
        <Plus className="w-4 h-4" />
        <span className="whitespace-nowrap">Post New Job</span>
      </button>
    </div>

    <div className="space-y-4 sm:space-y-6">
      {jobPosts.map((jobPost) => (
        <JobPostCard
          key={jobPost.id}
          jobPost={jobPost}
          onEdit={(id) => handleJobAction(id, 'edit')}
          onViewProposals={(id) => handleJobAction(id, 'view-proposals')}
          onDelete={(id) => handleJobAction(id, 'delete')}
        />
      ))}
    </div>
  </div>
)}

        {activeTab === 'favorites' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Favorite Providers</h1>
              <p className="text-gray-600">Your saved service providers</p>
            </div>

            {favoriteProviders.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {favoriteProviders.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    serviceType={serviceType}
                    onBook={handleProviderBook}
                    onToggleFavorite={handleToggleFavorite}
                    onMessage={handleProviderMessage}
                    onCall={handleProviderCall}
                    isFavorite={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
                <p className="text-gray-600 mb-4">
                  Save providers you like to easily find them later
                </p>
                <button
                  onClick={() => setActiveTab('services')}
                  className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Browse Services
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <Messages 
            chatState={chatState}
            onSendMessage={handleSendMessage}
            onStartConversation={handleStartConversation}
            onSetActiveConversation={handleSetActiveConversation}
          />
        )}

        {/* {activeTab === 'profile' && (
          <ProfileSection
            profileData={profileData}
            setProfileData={handleProfileDataChange}
          />
        )} */}
      </main>
      <PostJobModal
        isOpen={showPostJob}
        onClose={() => setShowPostJob(false)}
        onSubmit={handlePostJob}
      />
    </div>
  );
};

export default Customer;