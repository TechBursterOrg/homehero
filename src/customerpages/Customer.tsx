import React, { useState, useEffect } from 'react';
import {
  Filter,
  ArrowRight,
  Calendar,
  CheckCircle,
  Plus,
  Sparkles
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                <p className="text-gray-600">Manage your service appointments</p>
              </div>
              <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Book Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">2</p>
                    <p className="text-sm text-gray-600">Upcoming</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">4.8</p>
                    <p className="text-sm text-gray-600">Avg Rating</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onReschedule={(id) => handleBookingAction(id, 'reschedule')}
                  onCancel={(id) => handleBookingAction(id, 'cancel')}
                  onContact={(id, method) => handleBookingAction(id, `contact-${method}`)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Job Posts</h1>
                <p className="text-gray-600">Manage your long-term service contracts</p>
              </div>
              <button
                onClick={() => setShowPostJob(true)}
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Post New Job</span>
              </button>
            </div>

            <div className="space-y-6">
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