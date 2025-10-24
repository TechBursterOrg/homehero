// customercomponents/WorkingMapView.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { googleMapsService, LatLngLiteral } from '../utils/googleMaps';
import {
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Shield,
  Award,
  Navigation,
  Users,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import { Provider } from '../types';
import { useNavigate } from 'react-router-dom';

interface MapViewProps {
  providers: Provider[];
  userLocation: [number, number] | null;
  selectedProvider: Provider | null;
  onProviderSelect: (provider: Provider) => void;
  onBook: (provider: Provider) => void;
  onMessage: (provider: Provider) => void;
  onCall: (provider: Provider) => void;
  searchRadius: number;
  onCustomerDetected?: (distance: number, eta: number) => void;
  onCustomerArrived?: () => void;
}

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? "https://backendhomeheroes.onrender.com" 
  : "http://localhost:3001";

const WorkingMapView: React.FC<MapViewProps> = ({
  providers,
  userLocation,
  selectedProvider,
  onProviderSelect,
  onBook,
  onMessage,
  onCall,
  searchRadius,
  onCustomerDetected,
  onCustomerArrived
}) => {
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [mapInitialized, setMapInitialized] = useState(false);
  const navigate = useNavigate();

  // Use refs for stable values
  const mountedRef = useRef(true);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInitializedRef = useRef(false);

  // Profile Avatar Component
  const ProfileAvatar = useCallback(({ provider, className }: { provider: Provider; className: string }) => {
    const profileImageUrl = provider.profileImage || provider.profilePicture || provider.avatar;
    
    const getFullImageUrl = (url: string | undefined) => {
      if (!url) return null;
      if (url.startsWith('http')) return url;
      if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
      return url;
    };
    
    const fullImageUrl = getFullImageUrl(profileImageUrl);
    
    return (
      <div 
        className={`bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold overflow-hidden relative ${className}`}
        style={{ cursor: 'pointer' }}
      >
        {fullImageUrl ? (
          <img 
            src={fullImageUrl}
            alt={provider.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log('Image failed to load:', fullImageUrl);
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const fallback = parent.querySelector('.fallback-text');
                if (fallback) {
                  (fallback as HTMLElement).style.display = 'block';
                }
              }
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
  }, []);

  // Handle view profile navigation
  const handleViewProfile = useCallback((provider: Provider) => {
    console.log('🔄 Navigating to provider profile:', provider._id || provider.id);
    navigate(`/customer/provider/${provider._id || provider.id}`, { 
      state: { provider } 
    });
  }, [navigate]);

  // Create and initialize map
  const initializeMap = useCallback(async () => {
    if (!mountedRef.current || mapInitializedRef.current) {
      return;
    }

    try {
      console.log('🗺️ Starting map initialization...');
      setIsLoading(true);
      setLoadError('');

      // Load Google Maps first
      console.log('📥 Loading Google Maps API...');
      const loaded = await googleMapsService.loadGoogleMaps();
      
      if (!mountedRef.current) return;

      if (!loaded) {
        throw new Error('Failed to load Google Maps. Please check your internet connection.');
      }

      console.log('✅ Google Maps loaded, creating map container...');

      // Wait for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find or create the map container area
      const mapArea = document.querySelector('[data-map-area]') as HTMLElement;
      if (!mapArea) {
        throw new Error('Map area not found in DOM');
      }

      // Clear any existing map containers
      const existingMaps = mapArea.querySelectorAll('.google-map-container');
      existingMaps.forEach(map => map.remove());

      // Create a new map container
      const mapContainer = document.createElement('div');
      mapContainer.className = 'google-map-container w-full h-full';
      mapContainer.style.minHeight = '384px';
      mapContainer.style.backgroundColor = '#f3f4f6';
      
      // Add loading indicator
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'w-full h-full flex items-center justify-center';
      loadingDiv.innerHTML = `
        <div class="text-center">
          <div class="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p class="text-gray-500 text-sm">Loading map...</p>
        </div>
      `;
      mapContainer.appendChild(loadingDiv);
      
      // Add to DOM
      mapArea.appendChild(mapContainer);
      mapContainerRef.current = mapContainer;

      console.log('✅ Map container created, initializing map...');

      // Wait a bit for the container to be rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      // Initialize the map
      googleMapsService.initializeMap(mapContainer, {
        zoom: 10,
        center: userLocation ? 
          { lat: userLocation[0], lng: userLocation[1] } : 
          { lat: 6.5244, lng: 3.3792 }
      });

      // Remove loading indicator
      loadingDiv.remove();

      if (!mountedRef.current) return;

      mapInitializedRef.current = true;
      setIsGoogleMapsLoaded(true);
      setMapInitialized(true);
      setIsLoading(false);
      console.log('🎉 Map initialized successfully!');

    } catch (error) {
      console.error('❌ Map initialization failed:', error);
      if (mountedRef.current) {
        setLoadError(error instanceof Error ? error.message : 'Failed to initialize map');
        setIsLoading(false);
      }
    }
  }, [userLocation]);

  // Initialize when component mounts
  useEffect(() => {
    mountedRef.current = true;
    mapInitializedRef.current = false;
    
    console.log('🚀 WorkingMapView mounted');
    
    // Start initialization
    const initTimeout = setTimeout(() => {
      if (mountedRef.current && !mapInitializedRef.current) {
        initializeMap();
      }
    }, 500);

    return () => {
      console.log('🧹 WorkingMapView unmounting...');
      mountedRef.current = false;
      clearTimeout(initTimeout);
      
      // Clean up
      if (mapContainerRef.current) {
        mapContainerRef.current.remove();
      }
      googleMapsService.clearMarkers();
      googleMapsService.destroy();
    };
  }, [initializeMap]);

  // Update markers when providers change and map is ready
  useEffect(() => {
    if (!isGoogleMapsLoaded || !mapInitialized || !window.google?.maps) {
      return;
    }

    if (providers.length === 0) {
      googleMapsService.clearMarkers();
      return;
    }

    try {
      console.log('📍 Creating markers for', providers.length, 'providers');
      
      googleMapsService.clearMarkers();

      const bounds = new window.google.maps.LatLngBounds();
      let hasValidLocations = false;

      providers.forEach((provider, index) => {
        if (provider.coordinates && provider.coordinates.length === 2) {
          const position: LatLngLiteral = {
            lat: provider.coordinates[0],
            lng: provider.coordinates[1]
          };

          // Extend bounds
          bounds.extend(position);
          hasValidLocations = true;

          // Create marker
          const marker = googleMapsService.addProviderMarker(
            provider,
            selectedProvider?.id === provider.id,
            onProviderSelect
          );

          // Add info window with profile picture
          if (marker) {
            const profileImageUrl = provider.profileImage || provider.profilePicture || provider.avatar;
            const fullImageUrl = profileImageUrl?.startsWith('http') 
              ? profileImageUrl 
              : profileImageUrl?.startsWith('/') 
                ? `${API_BASE_URL}${profileImageUrl}`
                : profileImageUrl;

            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div class="p-4 max-w-xs">
                  <div class="flex items-center space-x-3 mb-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold overflow-hidden">
                      ${fullImageUrl ? 
                        `<img src="${fullImageUrl}" 
                              alt="${provider.name}" 
                              class="w-full h-full object-cover"
                              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                        >` : 
                        ''
                      }
                      <div class="absolute inset-0 flex items-center justify-center ${fullImageUrl ? 'hidden' : 'flex'}">
                        ${provider.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <h3 class="font-bold text-gray-900">${provider.name}</h3>
                      <p class="text-sm text-gray-600">${provider.services?.slice(0, 2).join(', ') || 'Service Provider'}</p>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-1">
                      <span class="text-yellow-500">★</span>
                      <span class="text-sm font-medium">${(provider.rating || provider.averageRating || 0).toFixed(1)}</span>
                    </div>
                    <button onclick="window.dispatchEvent(new CustomEvent('providerViewProfile', { detail: '${provider.id}' }))" 
                            class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View Profile
                    </button>
                  </div>
                </div>
              `
            });

            marker.addListener('click', () => {
              onProviderSelect(provider);
              googleMapsService.setMapCenter(position, 15);
              infoWindow.open(marker.getMap(), marker);
            });
          }
        }
      });

      // Fit bounds if we have locations
      if (hasValidLocations) {
        if (providers.length > 1) {
          googleMapsService.fitBounds(bounds);
        } else if (providers.length === 1) {
          googleMapsService.setMapCenter({
            lat: providers[0].coordinates![0],
            lng: providers[0].coordinates![1]
          }, 14);
        }
      }

    } catch (error) {
      console.error('Error creating markers:', error);
    }
  }, [isGoogleMapsLoaded, mapInitialized, providers, selectedProvider, onProviderSelect]);

  // Handle profile navigation from info windows
  useEffect(() => {
    const handleProfileNavigation = (event: CustomEvent) => {
      const providerId = event.detail;
      const provider = providers.find(p => p.id === providerId || p._id === providerId);
      if (provider) {
        handleViewProfile(provider);
      }
    };

    window.addEventListener('providerViewProfile', handleProfileNavigation as EventListener);
    
    return () => {
      window.removeEventListener('providerViewProfile', handleProfileNavigation as EventListener);
    };
  }, [providers, handleViewProfile]);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleBook = (provider: Provider) => {
    if (!provider?.id) return;
    onBook(provider);
  };

  const handleRetry = () => {
    console.log('🔄 Retrying map initialization...');
    setLoadError('');
    setIsLoading(true);
    setMapInitialized(false);
    setIsGoogleMapsLoaded(false);
    mapInitializedRef.current = false;
    googleMapsService.reset();
    
    setTimeout(() => {
      if (mountedRef.current) {
        initializeMap();
      }
    }, 500);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-96 bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Google Maps...</p>
          <p className="text-gray-500 text-sm mt-2">Initializing map service</p>
          <button 
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div className="h-96 bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Loading Error</h3>
          <p className="text-gray-600 mb-4">{loadError}</p>
          <div className="flex flex-col space-y-2">
            <button 
              onClick={handleRetry}
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="w-full px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Providers</p>
              <p className="text-2xl font-bold text-gray-900">{providers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Available Now</p>
              <p className="text-2xl font-bold text-gray-900">
                {providers.filter(p => p.isAvailableNow).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Search Radius</p>
              <p className="text-2xl font-bold text-gray-900">{searchRadius} miles</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container Area - This is where the map will be injected */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span>Provider Locations</span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Click on any marker to view provider details
              </p>
            </div>
            <div className="relative h-96">
              {/* This div will be replaced by the actual map container */}
              <div 
                data-map-area
                className="w-full h-full"
                style={{ minHeight: '384px' }}
              >
                {/* Map will be injected here by initializeMap */}
                {!mapInitialized && (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-gray-500 text-sm">Preparing map...</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Map Controls */}
              {mapInitialized && userLocation && (
                <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
                  <button
                    onClick={() => {
                      googleMapsService.setMapCenter(
                        { lat: userLocation[0], lng: userLocation[1] },
                        15
                      );
                    }}
                    className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    title="Center on my location"
                  >
                    <Navigation className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              )}

              {/* Map Legend */}
              {mapInitialized && (
                <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700">Selected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="text-gray-700">Unavailable</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Provider Details Sidebar */}
        <div className="space-y-4">
          {selectedProvider ? (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">Selected Provider</h3>
              </div>
              
              <div className="p-4">
                <div className="flex items-start space-x-3 mb-4">
                  <ProfileAvatar provider={selectedProvider} className="w-16 h-16" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg flex items-center space-x-2">
                          <span>{selectedProvider.name}</span>
                          {selectedProvider.isVerified && (
                            <Shield className="w-4 h-4 text-blue-500" />
                          )}
                        </h4>
                        <div className="flex items-center space-x-1 mt-1">
                          {renderStars(selectedProvider.rating || selectedProvider.averageRating || 0)}
                          <span className="text-sm text-gray-600">
                            {(selectedProvider.rating || selectedProvider.averageRating || 0).toFixed(1)} ({(selectedProvider.reviewCount || 0)})
                          </span>
                        </div>
                      </div>
                      {selectedProvider.isTopRated && (
                        <Award className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                    
                    {selectedProvider.isAvailableNow && (
                      <div className="flex items-center space-x-1 mt-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-green-600 font-medium">Available Now</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="font-medium text-gray-900 mb-2">Services</h5>
                  <div className="flex flex-wrap gap-2">
                    {(selectedProvider.services || []).slice(0, 4).map((service, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
                      >
                        {service}
                      </span>
                    ))}
                    {(selectedProvider.services || []).length > 4 && (
                      <span className="px-3 py-1 bg-gray-50 text-gray-600 text-sm rounded-full">
                        +{(selectedProvider.services || []).length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{selectedProvider.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price Range</p>
                    <p className="font-bold text-green-600">{selectedProvider.priceRange}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => handleBook(selectedProvider)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Book Now</span>
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => onMessage(selectedProvider)}
                      className="flex items-center justify-center space-x-2 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">Message</span>
                    </button>
                    <button 
                      onClick={() => onCall(selectedProvider)}
                      className="flex items-center justify-center space-x-2 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">Call</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleViewProfile(selectedProvider)}
                    className="w-full flex items-center justify-center space-x-2 py-2 border border-blue-200 text-blue-700 rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">View Profile</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Select a Provider</h3>
              <p className="text-gray-600 text-sm">
                {mapInitialized 
                  ? "Click on any provider marker on the map to view details and book services"
                  : "Map is loading... Please wait"
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkingMapView;