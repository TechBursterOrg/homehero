import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Heart, Star, MapPin, X, Filter } from 'lucide-react';
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

      const response = await fetch(`${API_BASE_URL}/api/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Favorites response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Favorites data received:', data);
        
        if (data.success && data.data && data.data.favorites) {
          // Transform the data to match Provider interface
          const providers = data.data.favorites.map((fav: any) => {
            const providerData = fav.providerId || fav;
            return {
              id: providerData._id || providerData.id,
              _id: providerData._id,
              name: providerData.name || 'Unknown Provider',
              email: providerData.email || '',
              services: Array.isArray(providerData.services) ? providerData.services : 
                       providerData.service ? [providerData.service] : [],
              hourlyRate: providerData.hourlyRate || providerData.rate || 0,
              averageRating: providerData.averageRating || providerData.rating || 0,
              city: providerData.city || '',
              state: providerData.state || '',
              country: providerData.country || '',
              profileImage: providerData.profileImage || providerData.profilePicture || providerData.avatar,
              profilePicture: providerData.profilePicture,
              avatar: providerData.avatar,
              isAvailableNow: providerData.isAvailableNow || false,
              experience: providerData.experience || '',
              phoneNumber: providerData.phoneNumber || providerData.phone || '',
              address: providerData.address || '',
              reviewCount: providerData.reviewCount || 0,
              completedJobs: providerData.completedJobs || 0,
              isVerified: providerData.isVerified || false,
              isTopRated: providerData.isTopRated || false,
              responseTime: providerData.responseTime || 'Contact for availability',
              rating: providerData.rating || providerData.averageRating || 0,
              priceRange: providerData.priceRange || '',
              location: providerData.location || `${providerData.city || ''}, ${providerData.state || ''}`.trim()
            };
          });
          
          setFavoriteProviders(providers);
          setFilteredProviders(providers);
        } else {
          console.error('Invalid favorites data structure:', data);
        }
      } else {
        console.error('Failed to fetch favorites:', response.status);
        // Fallback: Check localStorage for favorites
        const localFavorites = getLocalFavorites();
        if (localFavorites.length > 0) {
          setFavoriteProviders(localFavorites);
          setFilteredProviders(localFavorites);
        }
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
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

  // Fallback: Get favorites from localStorage
  const getLocalFavorites = (): Provider[] => {
    try {
      const favoritesStr = localStorage.getItem('favoriteProviders');
      if (favoritesStr) {
        return JSON.parse(favoritesStr);
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
        provider.location?.toLowerCase().includes(searchTerm.toLowerCase())
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
    try {
      const token = authToken || localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        alert('Please log in to update favorites');
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/providers/${providerId}/favorite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Update local state
        setFavoriteProviders(prev => prev.filter(p => p.id !== providerId));
        alert('Removed from favorites');
        
        // Call parent callback if needed
        onToggleFavorite(providerId);
        
        // Update localStorage
        const updatedFavorites = favoriteProviders.filter(p => p.id !== providerId);
        localStorage.setItem('favoriteProviders', JSON.stringify(updatedFavorites));
      } else {
        alert('Failed to remove from favorites');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const getUniqueServices = () => {
    const allServices = favoriteProviders.flatMap(provider => provider.services);
    return ['all', ...Array.from(new Set(allServices))].slice(0, 10);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative">
          <Heart className="w-16 h-16 text-pink-400 animate-pulse" />
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
                  <Heart className="w-6 h-6 text-white" fill="#ffffff" />
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
                <button className="group bg-white/80 backdrop-blur-sm border border-white/50 text-gray-700 px-6 py-3 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center space-x-2 font-semibold">
                  <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>View on Map</span>
                </button>
                
                <button className="group bg-gradient-to-r from-rose-500 via-pink-600 to-red-600 text-white px-8 py-3 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 font-semibold shadow-lg">
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
                className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProviderCard
  provider={provider}
  serviceType="immediate"
  onBook={onBook}
  onToggleFavorite={(id) => {
    handleRemoveFavorite(id);
    onToggleFavorite(id);
  }}
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
              <Heart className="w-16 h-16 text-gray-400" />
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