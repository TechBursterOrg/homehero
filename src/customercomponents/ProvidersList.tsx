import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Star, 
  MapPin, 
  Clock, 
  User, 
  AlertCircle,
  Heart,
  Shield,
  Award,
  PhoneCall,
  Copy,
  ExternalLink,
  RefreshCw,
  ChevronDown,
  Filter,
  Grid3X3,
  List,
  Zap,
  ArrowRight,
  Sparkles, 
  MoreVertical,
  Search,
  FileText,
  Map,
  X,
  Eye,
  Navigation
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Unified Provider interface
export interface Provider {
  _id?: string;
  id: string;
  name: string;
  email: string;
  services: string[];
  hourlyRate: number;
  averageRating?: number;
  city: string;
  state: string;
  country: string;
  profileImage?: string;
  profilePicture?: string;
  avatar?: string;
  isAvailableNow: boolean;
  experience: string;
  distance?: number;
  phoneNumber?: string;
  address?: string;
  rating?: number;
  reviewCount?: number;
  location?: string;
  priceRange?: string;
  coordinates?: [number, number];
  responseTime?: string;
  isVerified?: boolean;
  isTopRated?: boolean;
  completedJobs?: number;
}

interface ProvidersListProps {
  serviceType: 'immediate' | 'long-term';
  searchQuery: string;
  location: string;
  onBook?: (provider: Provider) => void;
  onMessage?: (provider: Provider) => void;
  onCall?: (provider: Provider) => void;
  onToggleFavorite?: (providerId: string) => void;
  authToken?: string;
  currentUser?: any;
  favorites?: string[];
  searchRadius?: number;
  userLocation?: [number, number] | null; // Add user location prop
}

interface ProviderCardItemProps {
  provider: Provider;
  serviceType: 'immediate' | 'long-term';
  onBook?: (provider: Provider) => void;
  onMessage?: (provider: Provider) => void;
  onCall?: (provider: Provider) => void;
  onToggleFavorite?: (providerId: string) => void;
  isFavorite: boolean;
  viewMode: 'grid' | 'list';
}

const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? "https://backendhomeheroes.onrender.com" 
    : "http://localhost:3001";

// Custom hook to prevent duplicate API calls
const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distanceKm = R * c;
  const distanceMiles = distanceKm * 0.621371; // Convert to miles
  return distanceMiles;
};

const ProviderCardItem: React.FC<ProviderCardItemProps> = React.memo(({
  provider,
  serviceType,
  onBook,
  onMessage,
  onCall,
  onToggleFavorite,
  isFavorite,
  viewMode
}) => {
  const [showCallOptions, setShowCallOptions] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [providerStats, setProviderStats] = useState<{
    averageRating: number;
    reviewCount: number;
    completedJobs: number;
  } | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  
  const callButtonRef = useRef<HTMLButtonElement>(null);
  const callOptionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Mock phone numbers
  const phoneNumbers: { [key: string]: string } = {
    '1': '+234 123 456 7890',
    '2': '+234 123 456 7891',
    '3': '+234 123 456 7892',
    '4': '+234 123 456 7893',
    '5': '+234 123 456 7894',
    '6': '+234 123 456 7895'
  };

  const providerPhone = phoneNumbers[provider.id] || provider.phoneNumber || '+234 000 000 0000';

  // Fetch provider stats including rating and completed jobs
  const fetchProviderStats = useCallback(async () => {
    const providerId = provider._id || provider.id;
    if (!providerId) return;

    try {
      setLoadingStats(true);
      console.log('📊 Fetching provider stats for:', providerId);
      
      // Try multiple endpoints for stats
      const endpoints = [
        `${API_BASE_URL}/api/providers/${providerId}/stats`,
        `${API_BASE_URL}/api/providers/${providerId}/rating`,
        `${API_BASE_URL}/api/providers/${providerId}`
      ];

      let statsData = null;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔄 Trying stats endpoint: ${endpoint}`);
          const response = await fetch(endpoint);
          
          if (response.ok) {
            const data = await response.json();
            console.log(`✅ Stats response from ${endpoint}:`, data);
            
            if (data.success && data.data) {
              // Extract stats from different response formats
              statsData = {
                averageRating: data.data.averageRating || data.data.rating || provider.averageRating || provider.rating || 0,
                reviewCount: data.data.reviewCount || data.data.totalReviews || provider.reviewCount || 0,
                completedJobs: data.data.completedJobs || data.data.jobsCompleted || provider.completedJobs || 0
              };
              break;
            }
          }
        } catch (endpointError) {
          console.log(`❌ Stats endpoint failed: ${endpoint}`, endpointError);
          continue;
        }
      }

      if (statsData) {
        console.log('✅ Setting provider stats:', statsData);
        setProviderStats(statsData);
      } else {
        // Fallback to provider data if no stats endpoint works
        console.log('📋 Using fallback stats from provider data');
        setProviderStats({
          averageRating: provider.averageRating || provider.rating || 0,
          reviewCount: provider.reviewCount || 0,
          completedJobs: provider.completedJobs || 0
        });
      }
    } catch (error) {
      console.error('❌ Error fetching provider stats:', error);
      // Fallback to provider data
      setProviderStats({
        averageRating: provider.averageRating || provider.rating || 0,
        reviewCount: provider.reviewCount || 0,
        completedJobs: provider.completedJobs || 0
      });
    } finally {
      setLoadingStats(false);
    }
  }, [provider]);

  useEffect(() => {
    fetchProviderStats();
  }, [fetchProviderStats]);

  // Handle card click to navigate to provider profile
  const handleCardClick = useCallback(() => {
    console.log('🔄 Card clicked, navigating to provider profile:', provider._id || provider.id);
    // Navigate to provider profile page with provider ID
    navigate(`/customer/provider/${provider._id || provider.id}`, { 
      state: { provider } 
    });
  }, [navigate, provider]);

  // Handle view profile button click
  const handleViewProfile = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when button is clicked
    console.log('🔄 View Profile clicked, navigating to provider profile:', provider._id || provider.id);
    navigate(`/customer/provider/${provider._id || provider.id}`, { 
      state: { provider } 
    });
  }, [navigate, provider]);

  const handleToggleFavorite = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavoriting || !onToggleFavorite) return;
    
    setIsFavoriting(true);
    try {
      onToggleFavorite(provider.id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsFavoriting(false);
    }
  }, [isFavoriting, onToggleFavorite, provider.id]);

  const renderStars = useCallback((rating: number) => {
    const normalizedRating = Math.min(Math.max(rating, 0), 5); // Ensure rating is between 0-5
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors ${
          i < Math.floor(normalizedRating) ? 'text-amber-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  }, []);

  const handleMessageClick = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onMessage) return;
    
    try {
      // Call the parent message handler
      onMessage(provider);
    } catch (error) {
      console.error('Error handling message click:', error);
    }
  }, [onMessage, provider]);

  const handleCallClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCallOptions(!showCallOptions);
  }, [showCallOptions]);

  const handlePhoneCall = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const cleanPhoneNumber = providerPhone.replace(/\D/g, '');
    
    if (isMobile) {
      window.location.href = `tel:${cleanPhoneNumber}`;
    } else {
      window.open(`tel:${cleanPhoneNumber}`);
    }
    setShowCallOptions(false);
  }, [providerPhone]);

  const handleCopyNumber = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(providerPhone);
      alert('Phone number copied to clipboard!');
    } catch {
      console.log('Phone number:', providerPhone);
    }
    setShowCallOptions(false);
  }, [providerPhone]);

  const getInitials = useCallback((name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }, []);

  // Format price range from hourlyRate - FIXED
  const formatPriceRange = useCallback((hourlyRate: number) => {
    if (!hourlyRate || hourlyRate === 0) return 'Contact for pricing';
    if (hourlyRate < 1000) return `₦${hourlyRate}`;
    if (hourlyRate < 1000000) return `₦${Math.round(hourlyRate/1000)}k`;
    return `₦${(hourlyRate/1000000).toFixed(1)}M`;
  }, []);

  // Calculate derived values with proper fallbacks - USING REAL STATS
  const rating = providerStats?.averageRating || provider.averageRating || provider.rating || 4.0;
  const reviewCount = providerStats?.reviewCount || provider.reviewCount || 0;
  const priceRange = provider.priceRange || formatPriceRange(provider.hourlyRate || 0);
  const completedJobs = providerStats?.completedJobs || provider.completedJobs || 0;
  const responseTime = provider.responseTime || 'Contact for availability';
  const locationText = provider.location || `${provider.city || ''}, ${provider.state || ''}`.trim() || 'Location not specified';

  // Format distance for display
  const formatDistance = useCallback((distance: number | undefined) => {
    if (!distance) return '';
    if (distance < 1) return `${(distance * 5280).toFixed(0)} ft`; // Convert to feet
    return `${distance.toFixed(1)} mi`;
  }, []);

  // Profile Avatar Component - Fixed to handle backend URLs properly
  const ProfileAvatar = useCallback(({ className }: { className: string }) => {
    // Get the profile image URL from various possible fields
    const profileImageUrl = provider.profileImage || provider.profilePicture || provider.avatar;
    
    // Convert relative URLs to full URLs for backend images
    const getFullImageUrl = (url: string | undefined) => {
      if (!url) return null;
      // If it's already a full URL (starts with http), return as-is
      if (url.startsWith('http')) return url;
      // If it's a relative URL (starts with /), prepend the API base URL
      if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
      // Otherwise return as-is
      return url;
    };
    
    const fullImageUrl = getFullImageUrl(profileImageUrl);
    
    return (
      <div 
        className={`bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold overflow-hidden relative ${className}`}
        onClick={(e) => {
          e.stopPropagation();
          handleViewProfile(e as any);
        }}
        style={{ cursor: 'pointer' }}
      >
        {fullImageUrl ? (
          <img 
            src={fullImageUrl}
            alt={provider.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log('Image failed to load:', fullImageUrl);
              // Hide the image and show initials
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const fallback = parent.querySelector('.fallback-text');
                if (fallback) {
                  (fallback as HTMLElement).style.display = 'block';
                }
              }
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', fullImageUrl);
            }}
          />
        ) : null}
        <span 
          className={`fallback-text absolute inset-0 flex items-center justify-center text-white font-bold ${fullImageUrl ? 'hidden' : 'block'}`}
          style={{ 
            fontSize: className.includes('w-20') ? '1.5rem' : className.includes('w-16') ? '1.25rem' : '1rem'
          }}
        >
          {provider.name.charAt(0)}
        </span>
      </div>
    );
  }, [provider.profileImage, provider.profilePicture, provider.avatar, provider.name, handleViewProfile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        callOptionsRef.current && 
        !callOptionsRef.current.contains(event.target as Node) &&
        callButtonRef.current && 
        !callButtonRef.current.contains(event.target as Node)
      ) {
        setShowCallOptions(false);
      }
    };

    if (showCallOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCallOptions]);

  const handleBookClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onBook && onBook(provider);
  }, [onBook, provider]);

  const handleCallOptionClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onCall && onCall(provider);
  }, [onCall, provider]);

  if (viewMode === 'list') {
    return (
      <div 
        className="group bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200/50 hover:border-blue-200/70 hover:shadow-2xl transition-all duration-500 p-4 sm:p-6 overflow-hidden relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {/* Avatar */}
          <div className="relative">
            <ProfileAvatar className="w-16 h-16 sm:w-20 sm:h-20" />
            {provider.isAvailableNow && serviceType === 'immediate' && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center animate-pulse">
                <Zap className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1">
                {/* Header */}
                <div 
                  className="flex items-center gap-2 mb-2 cursor-pointer"
                  onClick={handleViewProfile}
                >
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {provider.name}
                  </h3>
                  {provider.isVerified && (
                    <div className="w-6 h-6 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Shield className="w-3 h-3 text-blue-600" />
                    </div>
                  )}
                  {provider.isTopRated && (
                    <div className="w-6 h-6 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Award className="w-3 h-3 text-amber-600" />
                    </div>
                  )}
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {renderStars(rating)}
                  </div>
                  <span className="text-sm font-bold text-gray-900">{rating.toFixed(1)}</span>
                  {reviewCount > 0 && (
                    <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
                  )}
                </div>

                {/* Services */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {provider.services && provider.services.slice(0, 3).map((service, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm font-medium rounded-xl border border-blue-200/50"
                    >
                      {service}
                    </span>
                  ))}
                  {provider.services && provider.services.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl">
                      +{provider.services.length - 3} more
                    </span>
                  )}
                  {(!provider.services || provider.services.length === 0) && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl">
                      General Services
                    </span>
                  )}
                </div>

                {/* Location & Response Time */}
                <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{locationText}</span>
                    {provider.distance && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">
                        {formatDistance(provider.distance)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{responseTime}</span>
                  </div>
                </div>
              </div>

              {/* Favorite Button */}
              <div className="flex items-center gap-2">
                {onToggleFavorite && (
                  <button
                    onClick={handleToggleFavorite}
                    disabled={isFavoriting}
                    className={`p-2 rounded-xl transition-all duration-200 ${
                      isFavorite 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    {priceRange}
                  </p>
                  {completedJobs > 0 && (
                    <p className="text-sm text-gray-500">{completedJobs} jobs completed</p>
                  )}
                </div>
                
                {provider.isAvailableNow && serviceType === 'immediate' && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>Available Now</span>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* View Profile Button */}
                <button 
                  onClick={handleViewProfile}
                  className="p-3 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 group flex items-center gap-2"
                >
                  <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Profile</span>
                </button>
                
                {onMessage && (
                  <button 
                    onClick={handleMessageClick}
                    className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-105 group"
                  >
                    <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                )}
                
                {onCall && (
                  <div className="relative">
                    <button 
                      ref={callButtonRef}
                      onClick={handleCallClick}
                      className="p-3 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl transition-all duration-200 hover:scale-105 group"
                    >
                      <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                    
                    {showCallOptions && (
                      <div 
                        ref={callOptionsRef}
                        className="absolute right-0 bottom-full mb-2 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl p-2 z-[200] min-w-48"
                      >
                        <button
                          onClick={handleCallOptionClick}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-xl flex items-center gap-2 transition-colors"
                        >
                          <PhoneCall className="w-4 h-4 text-green-600" />
                          <span>Web Audio Call</span>
                        </button>
                        
                        <button
                          onClick={handlePhoneCall}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-xl flex items-center gap-2 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-purple-600" />
                          <span>Phone App</span>
                        </button>
                        
                        <button
                          onClick={handleCopyNumber}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-xl flex items-center gap-2 transition-colors"
                        >
                          <Copy className="w-4 h-4 text-gray-600" />
                          <span>Copy Number</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {onBook && (
                  <button
                    onClick={handleBookClick}
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl group"
                  >
                    <span className="group-hover:scale-110 inline-block transition-transform">
                      {serviceType === 'immediate' ? 'Book Now' : 'Get Quote'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hover Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 rounded-2xl transition-opacity duration-500 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}></div>
      </div>
    );
  }

  // Grid View (Card Mode)
  return (
    <div 
      className="group bg-white/90 backdrop-blur-md rounded-3xl border border-gray-200/50 hover:border-blue-200/70 hover:shadow-2xl transition-all duration-500 p-6 overflow-hidden relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={handleViewProfile}
        >
          <div className="relative">
            <ProfileAvatar className="w-16 h-16" />
            {provider.isAvailableNow && serviceType === 'immediate' && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center animate-pulse">
                <Zap className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {provider.name}
              </h3>
              {provider.isVerified && (
                <Shield className="w-4 h-4 text-blue-500" />
              )}
              {provider.isTopRated && (
                <Award className="w-4 h-4 text-amber-500" />
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {renderStars(rating)}
              </div>
              <span className="text-sm font-bold text-gray-900">{rating.toFixed(1)}</span>
              {reviewCount > 0 && (
                <span className="text-xs text-gray-500">({reviewCount})</span>
              )}
            </div>
          </div>
        </div>
        
        {onToggleFavorite && (
          <button
            onClick={handleToggleFavorite}
            disabled={isFavoriting}
            className={`p-2 rounded-xl transition-all duration-200 ${
              isFavorite 
                ? 'text-red-500 bg-red-50' 
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      {/* Services */}
      <div className="flex flex-wrap gap-2 mb-4">
        {provider.services && provider.services.slice(0, 2).map((service, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm font-medium rounded-xl border border-blue-200/50"
          >
            {service}
          </span>
        ))}
        {provider.services && provider.services.length > 2 && (
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl">
            +{provider.services.length - 2} more
          </span>
        )}
        {(!provider.services || provider.services.length === 0) && (
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl">
            General Services
          </span>
        )}
      </div>

      {/* Availability Badge */}
      {provider.isAvailableNow && serviceType === 'immediate' && (
        <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 py-2 rounded-xl text-sm font-semibold shadow-lg mb-4">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>Available Now</span>
        </div>
      )}

      {/* Location & Response Time */}
      <div className="space-y-2 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="truncate">{locationText}</span>
          {provider.distance && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">
              {formatDistance(provider.distance)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{responseTime}</span>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          <p className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            {priceRange}
          </p>
          {completedJobs > 0 && (
            <p className="text-sm text-gray-500">{completedJobs} jobs</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Profile Button for Grid View */}
          <button 
            onClick={handleViewProfile}
            className="p-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
            title="View Profile"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {onMessage && (
            <button 
              onClick={handleMessageClick}
              className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          )}
          
          {onCall && (
            <div className="relative">
              <button 
                ref={callButtonRef}
                onClick={handleCallClick}
                className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <Phone className="w-4 h-4" />
              </button>
              
              {showCallOptions && (
                <div 
                  ref={callOptionsRef}
                  className="absolute right-0 bottom-full mb-2 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl p-2 z-[200] min-w-48"
                >
                  <button
                    onClick={handleCallOptionClick}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 text-green-600" />
                    <span>Web Audio Call</span>
                  </button>
                  
                  <button
                    onClick={handlePhoneCall}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-purple-600" />
                    <span>Phone App</span>
                  </button>
                  
                  <button
                    onClick={handleCopyNumber}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                    <span>Copy Number</span>
                  </button>
                </div>
              )}
            </div>
          )}
          
          {onBook && (
            <button
              onClick={handleBookClick}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-xl text-sm"
            >
              {serviceType === 'immediate' ? 'Book' : 'Quote'}
            </button>
          )}
        </div>
      </div>

      {/* Hover Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 rounded-3xl transition-opacity duration-500 pointer-events-none ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}></div>
    </div>
  );
});


const getSampleProviders = (location: string, searchQuery: string, userLocation?: [number, number] | null): Provider[] => {
  const sampleProviders: Provider[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      services: ['House Cleaning', 'Deep Cleaning'],
      hourlyRate: 2500,
      averageRating: 4.8,
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      isAvailableNow: true,
      experience: '5 years',
      reviewCount: 127,
      completedJobs: 234,
      isVerified: true,
      isTopRated: true,
      responseTime: 'within 30 minutes',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      coordinates: [6.5244, 3.3792] // Lagos coordinates
    },
    {
      id: '2', 
      name: 'Michael Adebayo',
      email: 'michael@example.com',
      services: ['Plumbing', 'Electrical'],
      hourlyRate: 3500,
      averageRating: 4.6,
      city: 'Abuja',
      state: 'FCT',
      country: 'Nigeria',
      isAvailableNow: false,
      experience: '8 years',
      reviewCount: 89,
      completedJobs: 156,
      isVerified: true,
      isTopRated: false,
      responseTime: 'within 2 hours',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      coordinates: [9.0765, 7.3986] // Abuja coordinates
    },
    {
      id: '3',
      name: 'Fatima Ibrahim',
      email: 'fatima@example.com',
      services: ['Painting', 'Interior Design'],
      hourlyRate: 3000,
      averageRating: 4.9,
      city: 'Kano',
      state: 'Kano',
      country: 'Nigeria',
      isAvailableNow: true,
      experience: '6 years',
      reviewCount: 156,
      completedJobs: 289,
      isVerified: true,
      isTopRated: true,
      responseTime: 'within 45 minutes',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      coordinates: [12.0022, 8.5920] // Kano coordinates
    }
  ];

  // Calculate distances if user location is available
  let providersWithDistance = sampleProviders;
  if (userLocation) {
    providersWithDistance = sampleProviders.map(provider => {
      if (provider.coordinates) {
        const distance = calculateDistance(
          userLocation[0], userLocation[1],
          provider.coordinates[0], provider.coordinates[1]
        );
        return { ...provider, distance };
      }
      return provider;
    });
  }

  return providersWithDistance.filter(provider => {
    const matchesLocation = !location || 
      provider.city.toLowerCase().includes(location.toLowerCase()) ||
      provider.state.toLowerCase().includes(location.toLowerCase());
    
    const matchesService = !searchQuery ||
      provider.services.some(service => 
        service.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    return matchesLocation && matchesService;
  });
};

const ProvidersList: React.FC<ProvidersListProps> = ({
  serviceType,
  searchQuery,
  location,
  onBook,
  onMessage,
  onCall,
  onToggleFavorite,
  authToken,
  favorites = [],
  searchRadius,
  userLocation // Add user location prop
}) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'distance'>('distance'); // Default to distance
  const [showFilters, setShowFilters] = useState(false);

  // FIXED: Use ref to track previous parameters and prevent duplicate API calls
  const prevParamsRef = useRef<string>('');
  const isInitialMountRef = useRef(true);

  // Calculate distances for providers
  const calculateProviderDistances = useCallback((providers: Provider[]): Provider[] => {
    if (!userLocation) return providers;
    
    return providers.map(provider => {
      if (provider.coordinates && provider.coordinates.length === 2) {
        const distance = calculateDistance(
          userLocation[0], userLocation[1],
          provider.coordinates[0], provider.coordinates[1]
        );
        return { ...provider, distance };
      }
      return provider;
    });
  }, [userLocation]);

  // FIXED: Memoized fetchProviders function with duplicate prevention
  const fetchProviders = useCallback(async (shouldUseFallback: boolean = false) => {
    // Create a unique key for current parameters to prevent duplicate calls
    const currentParams = JSON.stringify({ 
      serviceType, 
      searchQuery, 
      location, 
      searchRadius,
      timestamp: Date.now() // Add timestamp to ensure uniqueness
    });
    
    // Skip if this is the exact same call as before
    if (currentParams === prevParamsRef.current && !shouldUseFallback) {
      console.log('🔄 Skipping duplicate API call with same parameters');
      return;
    }
    
    prevParamsRef.current = currentParams;
    
    try {
      setError(null);
      console.log('🚀 Starting provider fetch...');
      console.log('🔧 Current props:', { serviceType, searchQuery, location, authToken: !!authToken });
      
      // Build query parameters more carefully
      const params = new URLSearchParams();
      
      // Only add non-empty search parameters
      if (searchQuery?.trim()) {
        params.append('service', searchQuery.trim());
        console.log('🔍 Added service filter:', searchQuery.trim());
      }
      
      if (location?.trim()) {
        params.append('location', location.trim());
        console.log('📍 Added location filter:', location.trim());
      }
      
      // Always add these defaults
      params.append('limit', '50'); // Increased limit to get more providers
      
      if (serviceType === 'immediate') {
        params.append('availableNow', 'true');
        console.log('⚡ Added immediate availability filter');
      }
      
      const apiUrl = `${API_BASE_URL}/api/providers?${params.toString()}`;
      console.log('📡 Final API URL:', apiUrl);
      
      // Create fetch options
      const fetchOptions: RequestInit = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      };

      // Only add auth header if token exists
      if (authToken?.trim()) {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          'Authorization': `Bearer ${authToken.trim()}`
        };
        console.log('🔐 Added auth token to request');
      }

      console.log('📤 Making fetch request with options:', fetchOptions);
      
      // Add timeout to the fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch(apiUrl, {
        ...fetchOptions,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('📥 Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url
      });
      
      // Get raw response text first for debugging
      const responseText = await response.text();
      console.log('📄 Raw response text:', responseText);
      
      if (!response.ok) {
        console.error('❌ API Error Response:', responseText);
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${responseText}`);
      }
      
      // Parse JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('📦 Parsed response data:', data);
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError);
        console.error('📄 Problematic text:', responseText);
        const errorMessage = parseError instanceof Error ? parseError.message : 'Failed to parse JSON response';
        throw new Error(`JSON Parse Error: ${errorMessage}`);
      }
      
      // More robust data validation
      if (!data) {
        throw new Error('No data received from API');
      }

      if (data.success === false) {
        throw new Error(data.message || 'API returned success: false');
      }

      // Handle different possible response structures
      let providersArray = [];
      
      if (data.data?.providers) {
        providersArray = data.data.providers;
        console.log('✅ Found providers in data.data.providers');
      } else if (data.providers) {
        providersArray = data.providers;
        console.log('✅ Found providers in data.providers');
      } else if (Array.isArray(data)) {
        providersArray = data;
        console.log('✅ Data itself is providers array');
      } else if (Array.isArray(data.data)) {
        providersArray = data.data;
        console.log('✅ Found providers in data.data array');
      } else {
        console.log('❓ Unexpected response structure:', Object.keys(data));
        console.log('📊 Full data object:', data);
        // If we can't find providers in the expected structure, try to extract them
        // from any array property in the response
        for (const key in data) {
          if (Array.isArray(data[key])) {
            providersArray = data[key];
            console.log(`✅ Found providers in data.${key}`);
            break;
          }
        }
      }

      console.log('🔍 Extracted providers array length:', providersArray.length);
      
      if (!Array.isArray(providersArray)) {
        console.error('❌ Providers data is not an array:', typeof providersArray, providersArray);
        throw new Error('Invalid providers data format received');
      }

      console.log(`✅ Found ${providersArray.length} providers in API response`);
      
      // Transform providers to ensure consistent format
      const transformedProviders: Provider[] = providersArray.map((provider: any, index: number) => {
        console.log(`🔄 Transforming provider ${index + 1}:`, provider);
        
        // Ensure services is always an array
        let services: string[] = [];
        if (Array.isArray(provider.services)) {
          services = provider.services;
        } else if (typeof provider.services === 'string') {
          services = [provider.services];
        } else if (provider.service) {
          services = Array.isArray(provider.service) ? provider.service : [provider.service];
        }
        
        // Get location information from various possible fields
        const city = provider.city || provider.locationData?.city || '';
        const state = provider.state || provider.locationData?.state || '';
        const country = provider.country || provider.locationData?.country || '';
        
        // Create location string for display
        const locationParts = [city, state, country].filter(part => part && part.trim() !== '');
        const locationText = locationParts.join(', ') || 'Location not specified';
        
        const transformed: Provider = {
          ...provider,
          id: provider._id || provider.id || `provider-${index}`,
          _id: provider._id || provider.id,
          services: services,
          name: provider.name || `Provider ${index + 1}`,
          email: provider.email || `provider${index + 1}@example.com`,
          hourlyRate: provider.hourlyRate || provider.rate || 0,
          city: city,
          state: state,
          country: country,
          location: locationText, // Add the formatted location
          experience: provider.experience || '',
          isAvailableNow: provider.isAvailableNow !== undefined ? provider.isAvailableNow : true,
          // Enhanced profile image handling
          profileImage: provider.profileImage || provider.profilePicture || provider.avatar,
          profilePicture: provider.profilePicture,
          avatar: provider.avatar,
          // Calculated fields with fallbacks
          rating: provider.averageRating || provider.rating || 4.0,
          reviewCount: provider.reviewCount || 0,
          priceRange: provider.priceRange || '',
          responseTime: provider.responseTime || 'Contact for availability',
          completedJobs: provider.completedJobs || 0,
          isVerified: provider.isVerified !== undefined ? provider.isVerified : false,
          isTopRated: provider.isTopRated !== undefined ? provider.isTopRated : false,
          phoneNumber: provider.phoneNumber || provider.phone,
          // Coordinates for distance calculation
          coordinates: provider.coordinates || [6.5244, 3.3792] // Default to Lagos
        };
        
        console.log(`✅ Transformed provider:`, transformed);
        return transformed;
      });
      
      // Calculate distances for all providers
      const providersWithDistances = calculateProviderDistances(transformedProviders);
      
      console.log(`🎉 Successfully transformed ${providersWithDistances.length} providers with distances`);
      setProviders(providersWithDistances);
      
    } catch (err: unknown) {
      console.error('💥 Error in fetchProviders:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      // Only show sample data on explicit retry or if no real attempt was made
      if (shouldUseFallback) {
        console.log('🔄 Fallback: Using sample data due to API error during retry');
        const sampleProviders = getSampleProviders(location, searchQuery, userLocation);
        setProviders(sampleProviders);
      } else {
        console.log('❌ Setting empty providers array due to API error');
        setProviders([]);
      }
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  }, [serviceType, searchQuery, location, authToken, searchRadius, userLocation, calculateProviderDistances]);

  const handleRetry = useCallback(() => {
    console.log('🔄 User triggered retry');
    setIsRetrying(true);
    setLoading(true);
    setError(null);
    fetchProviders(true); // Pass true to indicate fallback should be used
  }, [fetchProviders]);

  const handleShowSampleData = useCallback(() => {
    console.log('📋 User requested sample data');
    setError(null);
    const sampleProviders = getSampleProviders(location, searchQuery, userLocation);
    setProviders(sampleProviders);
  }, [location, searchQuery, userLocation]);

  // Sort providers - Memoized to prevent unnecessary recalculations
  const sortedProviders = React.useMemo(() => {
    return [...providers].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          const ratingA = a.averageRating || a.rating || 0;
          const ratingB = b.averageRating || b.rating || 0;
          return ratingB - ratingA;
        case 'price':
          return (a.hourlyRate || 0) - (b.hourlyRate || 0);
        case 'distance':
          // Sort by distance (closest first), providers without distance go last
          if (a.distance === undefined && b.distance === undefined) return 0;
          if (a.distance === undefined) return 1;
          if (b.distance === undefined) return -1;
          return a.distance - b.distance;
        default:
          const defaultRatingA = a.averageRating || a.rating || 0;
          const defaultRatingB = b.averageRating || b.rating || 0;
          return defaultRatingB - defaultRatingA;
      }
    });
  }, [providers, sortBy]);

  // FIXED: useEffect with proper dependency handling and duplicate prevention
  useEffect(() => {
    // Skip initial mount in development due to React.StrictMode double mounting
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }
    
    console.log('🔄 useEffect triggered with:', { searchQuery, location, serviceType, authToken: !!authToken });
    setLoading(true);
    fetchProviders(false); // Pass false for initial load (no fallback)
  }, [fetchProviders]); // Only depend on the memoized function

  // Initial load effect
  useEffect(() => {
    setLoading(true);
    fetchProviders(false);
  }, []); // Empty dependency array for initial load only

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded-xl w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 bg-gray-200 rounded-xl w-24 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-xl w-20 animate-pulse"></div>
          </div>
        </div>

        {/* Loading Cards */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-6 animate-pulse">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl shrink-0"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 rounded-lg w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded-xl w-16"></div>
                    <div className="h-6 bg-gray-200 rounded-xl w-20"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-16 h-16 text-red-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Unable to load providers</h3>
        <p className="text-gray-600 mb-4 max-w-md mx-auto leading-relaxed">{error}</p>
        
        
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <User className="w-16 h-16 text-gray-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No providers found</h3>
        <p className="text-gray-600 mb-4 max-w-md mx-auto leading-relaxed">
          
        </p>
        {/* <p className="text-sm text-gray-400 mb-8 font-mono bg-gray-50 px-4 py-2 rounded-lg inline-block">
          API: {API_BASE_URL}/api/providers
        </p> */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRetry}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-300 shadow-xl flex items-center gap-3 justify-center"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/50 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Results Info */}
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900">
              {sortedProviders.length} Provider{sortedProviders.length !== 1 ? 's' : ''} Found
              {userLocation && ' • Showing closest first'}
            </h2>
            <p className="text-sm text-gray-600">
              {searchQuery && `for "${searchQuery}"`}
              {searchQuery && location && ' '}
              {location && `in ${location}`}
            </p>
            {/* <p className="text-xs text-gray-400 font-mono">
              API: {API_BASE_URL}/api/providers
            </p> */}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'price' | 'distance')}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                <option value="distance">Sort by Distance</option>
                <option value="rating">Sort by Rating</option>
                <option value="price">Sort by Price</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
                showFilters 
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRetry}
              disabled={loading}
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors disabled:opacity-50 rounded-xl hover:bg-blue-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200/50">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Availability</label>
                <select className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm">
                  <option>Any time</option>
                  <option>Available now</option>
                  <option>Within 1 hour</option>
                  <option>Today</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Rating</label>
                <select className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm">
                  <option>Any rating</option>
                  <option>4.5+ stars</option>
                  <option>4.0+ stars</option>
                  <option>3.5+ stars</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Price Range</label>
                <select className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm">
                  <option>Any price</option>
                  <option>Under ₦2,000</option>
                  <option>₦2,000 - ₦5,000</option>
                  <option>₦5,000+</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Experience</label>
                <select className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm">
                  <option>Any experience</option>
                  <option>5+ years</option>
                  <option>3+ years</option>
                  <option>1+ years</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Providers Grid/List */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {sortedProviders.map((provider) => (
          <ProviderCardItem
            key={provider._id || provider.id}
            provider={provider}
            serviceType={serviceType}
            onBook={onBook}
            onMessage={onMessage}
            onCall={onCall}
            onToggleFavorite={onToggleFavorite}
            isFavorite={favorites.includes(provider._id || provider.id)}
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* Load More Button */}
      {sortedProviders.length > 0 && (
        <div className="text-center pt-8">
          <button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-300 shadow-xl">
            Load More Providers
          </button>
        </div>
      )}
    </div>
  );
};

export default ProvidersList;