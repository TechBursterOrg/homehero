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

// Types and Data
import { 
  ActiveTab, 
  ServiceType, 
  UserProfile, 
  Service, 
  Provider, 
  Booking, 
  JobPost,
  LocationData
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
    avatar: null
  });

  // Filter providers based on service type, location, and search radius
  useEffect(() => {
    let filtered = providers;

    // Filter by service type availability
    if (serviceType === 'immediate') {
      filtered = filtered.filter(p => p.isAvailableNow);
    }

    // Filter by search radius if user location is available
    if (userLocation) {
      filtered = filtered.filter(p => {
        const distance = calculateDistance(userLocation, p.coordinates);
        return distance <= searchRadius;
      });
    }

    // Filter by search query
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

  // Calculate distance between two coordinates (Haversine formula)
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

  // Event Handlers
  const handleServiceClick = (service: Service) => {
    setSearchQuery(service.name);
    // Trigger search with the service name
  };

  const handleProviderBook = (provider: Provider) => {
    console.log('Book provider:', provider);
    // Navigate to booking flow
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
    // Handle booking actions (reschedule, cancel, contact)
  };

  const handleJobAction = (jobId: string, action: string) => {
    console.log('Job action:', action, jobId);
    // Handle job actions (edit, view proposals, delete)
  };

  const handlePostJob = (jobData: any) => {
    console.log('New job posted:', jobData);
    // Handle job posting
  };

  const handleLocationChange = (location: LocationData) => {
    setCurrentLocationAddress(location.address);
    setUserLocation(location.coordinates);
  };

  const handleSearch = () => {
    // Trigger search with current parameters
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        profileData={profileData}
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

            {/* Service Categories */}
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

            {/* Providers Section */}
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

            {/* Quick Stats */}
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

            {/* Bookings List */}
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

            {/* Job Posts List */}
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

        {activeTab === 'profile' && (
          <ProfileSection
            profileData={profileData}
            setProfileData={setProfileData}
          />
        )}
      </main>

      {/* Post Job Modal */}
      <PostJobModal
        isOpen={showPostJob}
        onClose={() => setShowPostJob(false)}
        onSubmit={handlePostJob}
      />
    </div>
  );
};

export default Customer;