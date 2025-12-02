import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Heart, Star, MapPin, X, Filter, Loader2 } from 'lucide-react';
import ProviderCard from '../customercomponents/ProviderCard'; // Adjust path as needed

interface Provider {
  id: string;
  _id?: string;
  name: string;
  email: string;
  services: string[];
  hourlyRate: number;
  averageRating: number;
  city: string;
  state: string;
  country: string;
  profileImage: string;
  isAvailableNow: boolean;
  experience: string;
  phoneNumber: string;
  address: string;
  reviewCount: number;
  completedJobs: number;
  isVerified: boolean;
  isTopRated: boolean;
  responseTime: string;
  rating: number;
  profilePicture?: string;
  avatar?: string;
  priceRange?: string;
  location?: string;
}

interface FavoritesPageProps {
  onToggleFavorite: (providerId: string) => void;
  onBook: (provider: any) => void;
  onMessage: (provider: any) => void;
  onCall: (provider: any) => void;
  authToken?: string;
  currentUser?: any;
}

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? "https://backendhomeheroes.onrender.com" 
  : "http://localhost:3001";

const FavoritesPage: React.FC<FavoritesPageProps> = ({ 
  onToggleFavorite,
  onBook,
  onMessage,
  onCall,
  authToken,
  currentUser
}) => {
  const [favoriteProviders, setFavoriteProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'recent'>('recent');
  const [removingProviderId, setRemovingProviderId] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    filterAndSortProviders();
  }, [favoriteProviders, searchTerm, serviceFilter, sortBy]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = authToken || localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        console.log('No auth token found');
        setLoading(false);
        return;
      }

      console.log('📡 Fetching favorites from:', `${API_BASE_URL}/api/favorites`);
      
      const response = await fetch(`${API_BASE_URL}/api/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Favorites response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📦 Raw favorites data received:', data);
        
        let providerIds: string[] = [];
        
        // Extract provider IDs from the response
        if (data.success && data.data) {
          if (Array.isArray(data.data.favorites)) {
            console.log('📋 Extracting provider IDs from favorites array');
            providerIds = data.data.favorites
              .map((fav: any) => fav.providerId)
              .filter((id: string) => id && id.trim() !== '');
          } else if (Array.isArray(data.data)) {
            console.log('📋 Extracting provider IDs from data array');
            providerIds = data.data
              .map((item: any) => item.providerId)
              .filter((id: string) => id && id.trim() !== '');
          } else if (Array.isArray(data.favorites)) {
            console.log('📋 Extracting provider IDs from root favorites array');
            providerIds = data.favorites
              .map((fav: any) => fav.providerId)
              .filter((id: string) => id && id.trim() !== '');
          }
        } else if (data.success && Array.isArray(data.providers)) {
          console.log('📋 Extracting provider IDs from providers array');
          providerIds = data.providers
            .map((provider: any) => provider._id || provider.id)
            .filter((id: string) => id && id.trim() !== '');
        }
        
        console.log('🎯 Extracted provider IDs:', providerIds);
        
        if (providerIds.length === 0) {
          console.log('⚠️ No provider IDs found in the response');
          setFavoriteProviders([]);
          setFilteredProviders([]);
          return;
        }
        
        // Fetch provider details for each ID
        const providers = await fetchProviderDetails(providerIds, token);
        console.log('✅ Fetched provider details:', providers);
        
        setFavoriteProviders(providers);
        setFilteredProviders(providers);
        
      } else {
        console.error('❌ Failed to fetch favorites:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        // Fallback: Check localStorage for favorites
        const localFavorites = getLocalFavorites();
        if (localFavorites.length > 0) {
          console.log('🔄 Using local favorites from localStorage');
          setFavoriteProviders(localFavorites);
          setFilteredProviders(localFavorites);
        }
      }
    } catch (error) {
      console.error('💥 Error fetching favorites:', error);
      // Fallback: Check localStorage for favorites
      const localFavorites = getLocalFavorites();
      if (localFavorites.length > 0) {
        setFavoriteProviders(localFavorites);
        setFilteredProviders(localFavorites);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch provider details for each ID
  const fetchProviderDetails = async (providerIds: string[], token: string): Promise<Provider[]> => {
    const providers: Provider[] = [];
    
    // Try to fetch all providers at once first
    try {
      console.log('🔄 Trying to fetch all providers at once...');
      const response = await fetch(`${API_BASE_URL}/api/providers?ids=${providerIds.join(',')}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Bulk providers response:', data);
        
        if (data.success && Array.isArray(data.data)) {
          console.log('✅ Got providers array from bulk endpoint');
          return data.data.map((provider: any, index: number) => 
            transformProviderData(provider, index)
          );
        } else if (data.success && data.data && Array.isArray(data.data.providers)) {
          console.log('✅ Got providers array from data.data.providers');
          return data.data.providers.map((provider: any, index: number) => 
            transformProviderData(provider, index)
          );
        }
      }
    } catch (error) {
      console.log('📋 Bulk fetch failed, trying individual fetches');
    }
    
    // If bulk fetch fails, fetch each provider individually
    for (let i = 0; i < providerIds.length; i++) {
      const providerId = providerIds[i];
      try {
        console.log(`🔄 Fetching provider ${i + 1}/${providerIds.length}: ${providerId}`);
        
        const response = await fetch(`${API_BASE_URL}/api/providers/${providerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Provider ${providerId} data:`, data);
          
          if (data.success && data.data) {
            const provider = transformProviderData(data.data, i);
            providers.push(provider);
          } else {
            console.warn(`⚠️ Provider ${providerId} has no data in response`);
          }
        } else {
          console.error(`❌ Failed to fetch provider ${providerId}:`, response.status);
        }
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`💥 Error fetching provider ${providerId}:`, error);
      }
    }
    
    return providers;
  };

  // Transform provider data to match Provider interface
  const transformProviderData = (providerData: any, index: number): Provider => {
    console.log(`🔄 Transforming provider data ${index + 1}:`, providerData);
    
    if (!providerData) {
      console.log('⚠️ No provider data provided, creating fallback');
      return createFallbackProvider(index);
    }
    
    // Extract ID
    const id = providerData._id || providerData.id || `fallback-${Date.now()}-${index}`;
    
    // Extract name
    let name = providerData.name || providerData.fullName || providerData.username || '';
    if (!name || name.trim() === '') {
      const idSuffix = id.slice(-4);
      name = `Provider ${idSuffix}`;
    }
    
    console.log(`   Provider ID: ${id}, Name: ${name}`);
    
    // Extract services
    let services: string[] = [];
    if (Array.isArray(providerData.services) && providerData.services.length > 0) {
      services = providerData.services.filter((s: any) => s && s.trim() !== '');
    } else if (typeof providerData.services === 'string' && providerData.services.trim() !== '') {
      services = [providerData.services];
    } else if (providerData.service) {
      if (Array.isArray(providerData.service)) {
        services = providerData.service.filter((s: any) => s && s.trim() !== '');
      } else if (typeof providerData.service === 'string' && providerData.service.trim() !== '') {
        services = [providerData.service];
      }
    } else if (providerData.category) {
      if (Array.isArray(providerData.category)) {
        services = providerData.category.filter((c: any) => c && c.trim() !== '');
      } else if (typeof providerData.category === 'string' && providerData.category.trim() !== '') {
        services = [providerData.category];
      }
    }
    
    // If no services found, add a default
    if (services.length === 0) {
      services = ['General Service'];
    }
    
    // Extract location information
    const city = providerData.city || providerData.location?.city || '';
    const state = providerData.state || providerData.location?.state || '';
    const country = providerData.country || providerData.location?.country || '';
    
    const locationParts = [city, state, country].filter(part => part && part.trim() !== '');
    const locationText = locationParts.join(', ') || 'Location not specified';
    
    // Extract profile image
    const profileImage = providerData.profileImage || 
                        providerData.profilePicture || 
                        providerData.avatar || 
                        providerData.image || 
                        '';
    
    // Extract rating
    const rating = providerData.rating || 
                  providerData.averageRating || 
                  providerData.avgRating || 
                  0;
    
    const reviewCount = providerData.reviewCount || 
                       providerData.totalReviews || 
                       0;
    
    // Extract hourly rate
    const hourlyRate = providerData.hourlyRate || 
                      providerData.rate || 
                      providerData.price || 
                      0;
    
    // Create price range
    const priceRange = providerData.priceRange || 
                      (hourlyRate > 0 ? `₦${hourlyRate}/hr` : 'Contact for pricing');
    
    return {
      id: id,
      _id: providerData._id || providerData.id,
      name: name,
      email: providerData.email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      services: services,
      hourlyRate: hourlyRate,
      averageRating: rating,
      city: city,
      state: state,
      country: country,
      profileImage: profileImage,
      profilePicture: providerData.profilePicture,
      avatar: providerData.avatar,
      isAvailableNow: providerData.isAvailableNow !== undefined ? providerData.isAvailableNow : true,
      experience: providerData.experience || '',
      phoneNumber: providerData.phoneNumber || providerData.phone || '',
      address: providerData.address || '',
      reviewCount: reviewCount,
      completedJobs: providerData.completedJobs || 0,
      isVerified: providerData.isVerified || false,
      isTopRated: providerData.isTopRated || false,
      responseTime: providerData.responseTime || 'Contact for availability',
      rating: rating,
      priceRange: priceRange,
      location: locationText
    };
  };

  // Create a fallback provider when data is missing
  const createFallbackProvider = (index: number): Provider => {
    const fallbackId = `fallback-${Date.now()}-${index}`;
    return {
      id: fallbackId,
      _id: fallbackId,
      name: `Provider ${index + 1}`,
      email: `provider${index + 1}@example.com`,
      services: ['General Service'],
      hourlyRate: 0,
      averageRating: 0,
      city: '',
      state: '',
      country: '',
      profileImage: '',
      isAvailableNow: false,
      experience: '',
      phoneNumber: '',
      address: '',
      reviewCount: 0,
      completedJobs: 0,
      isVerified: false,
      isTopRated: false,
      responseTime: 'Contact for availability',
      rating: 0,
      priceRange: 'Contact for pricing',
      location: 'Location not specified'
    };
  };

  // Fallback: Get favorites from localStorage
  const getLocalFavorites = (): Provider[] => {
    try {
      const favoritesStr = localStorage.getItem('favoriteProviders');
      if (favoritesStr) {
        const parsed = JSON.parse(favoritesStr);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error('Error reading local favorites:', error);
    }
    return [];
  };

  const filterAndSortProviders = () => {
    let filtered = [...favoriteProviders];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(provider => 
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.services.some(service => 
          service.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        (provider.location && provider.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by service type
    if (serviceFilter !== 'all') {
      filtered = filtered.filter(provider => 
        provider.services.some(service => 
          service.toLowerCase().includes(serviceFilter.toLowerCase())
        )
      );
    }
    
    // Sort providers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'price':
          return (a.hourlyRate || 0) - (b.hourlyRate || 0);
        case 'recent':
          // Assuming you have a favoriteDate field
          return 0; // Adjust based on your data
        default:
          return 0;
      }
    });
    
    setFilteredProviders(filtered);
  };

  const handleRemoveFavorite = async (providerId: string) => {
    if (removingProviderId === providerId) return;
    
    try {
      setRemovingProviderId(providerId);
      const token = authToken || localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        alert('Please log in to update favorites');
        return;
      }
      
      console.log('🗑️ Removing favorite:', providerId);
      
      // First, optimistically update the UI
      const updatedFavorites = favoriteProviders.filter(p => p.id !== providerId);
      setFavoriteProviders(updatedFavorites);
      
      // Try to remove from backend
      const response = await fetch(`${API_BASE_URL}/api/providers/${providerId}/favorite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Remove favorite response:', data);
        
        if (data.success) {
          console.log('✅ Successfully removed from favorites');
          
          // Call parent callback if needed
          if (onToggleFavorite) {
            onToggleFavorite(providerId);
          }
          
          // Update localStorage
          localStorage.setItem('favoriteProviders', JSON.stringify(updatedFavorites));
        } else {
          console.error('❌ Backend returned success: false', data);
          
          // Revert optimistic update
          fetchFavorites();
          
          alert(`Failed to remove from favorites: ${data.message || 'Unknown error'}`);
        }
      } else {
        // Revert optimistic update
        fetchFavorites();
        
        let errorMessage = 'Failed to remove from favorites';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Not JSON
        }
        
        alert(`Failed to remove from favorites: ${errorMessage}`);
      }
    } catch (error) {
      console.error('💥 Error removing favorite:', error);
      
      // Revert optimistic update
      fetchFavorites();
      
      alert('Error removing from favorites. Please try again.');
    } finally {
      setRemovingProviderId(null);
    }
  };

  const getUniqueServices = () => {
    const allServices = favoriteProviders.flatMap(provider => provider.services || []);
    const uniqueServices = ['all', ...Array.from(new Set(allServices.filter(service => service && service.trim() !== '')))];
    return uniqueServices.slice(0, 10);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative">
          <Heart className="w-16 h-16 text-pink-400 animate-pulse" fill="none" stroke="currentColor" />
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full blur-xl opacity-30"></div>
        </div>
        <h3 className="text-xl font-semibold text-gray-700">Loading your favorites...</h3>
        <p className="text-gray-500">Fetching your saved providers</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 rounded-3xl p-8">
        <div className="relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Heart className="w-6 h-6 text-white" fill="#ffffff" stroke="none" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-rose-800 to-pink-800 bg-clip-text text-transparent">
                    Favorite Providers
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {favoriteProviders.length} saved {favoriteProviders.length === 1 ? 'provider' : 'providers'}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 text-lg font-medium max-w-md">
                Your saved service providers for easy access and quick booking
              </p>
            </div>
            
            {favoriteProviders.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-3">
                {/* <button className="group bg-white/80 backdrop-blur-sm border border-white/50 text-gray-700 px-6 py-3 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center space-x-2 font-semibold">
                  <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>View on Map</span>
                </button> */}
                
                <button 
                  onClick={() => setSortBy('rating')}
                  className={`group bg-gradient-to-r from-rose-500 via-pink-600 to-red-600 text-white px-8 py-3 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 font-semibold shadow-lg ${
                    sortBy === 'rating' ? 'ring-2 ring-white ring-opacity-50' : ''
                  }`}
                >
                  <Star className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  <span>Sort by Rating</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      {favoriteProviders.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search your favorites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="all">All Services</option>
                  {getUniqueServices()
                    .filter(service => service !== 'all')
                    .map(service => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))
                  }
                </select>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="recent">Recently Added</option>
                <option value="rating">Highest Rated</option>
                <option value="price">Price: Low to High</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Providers Grid */}
      {filteredProviders.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchTerm ? `Search Results (${filteredProviders.length})` : 'Your Favorites'}
            </h2>
            <p className="text-gray-600">
              Showing {filteredProviders.length} of {favoriteProviders.length} providers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider, index) => (
              <div
                key={provider.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-300 relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Loading overlay when removing */}
                {removingProviderId === provider.id && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl z-10 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                      <p className="text-gray-600 font-medium">Removing from favorites...</p>
                    </div>
                  </div>
                )}
                
                <ProviderCard
                  provider={provider}
                  serviceType="immediate"
                  onBook={onBook}
                  onToggleFavorite={handleRemoveFavorite}
                  onMessage={onMessage}
                  onCall={onCall}
                  isFavorite={true}
                  authToken={authToken}
                  currentUser={currentUser}
                />
              </div>
            ))}
          </div>
        </div>
      ) : favoriteProviders.length === 0 ? (
        <div className="text-center py-16">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Heart className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No favorites yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
            Save providers you like to easily find them later. Look for the heart icon on any provider card.
          </p>
          
          <div className="space-y-4">
            <button 
              className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-8 py-4 rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center mx-auto space-x-3 text-lg font-semibold"
              onClick={() => window.location.href = '/search'}
            >
              <ArrowRight className="w-5 h-5" />
              <span>Browse Services</span>
            </button>
            
            <p className="text-sm text-gray-500">
              Tip: Click the ❤️ on any provider to add them to your favorites
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-32 h-32 bg-gradient-to-br from-rose-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-16 h-16 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No matching favorites</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            No favorites match your search criteria. Try adjusting your filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setServiceFilter('all');
              setSortBy('recent');
            }}
            className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;