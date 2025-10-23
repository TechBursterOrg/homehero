// customercomponents/StandaloneMapView.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { googleMapsService, LatLngLiteral } from '../utils/googleMaps';
import { AlertCircle } from 'lucide-react';
import { Provider } from '../types';
import { useNavigate } from 'react-router-dom';

interface MapViewProps {
  providers: Provider[];
  userLocation: [number, number] | null;
  selectedProvider: Provider | null;
  onProviderSelect: (provider: Provider) => void;
  onBook?: (provider: Provider) => void;
  onMessage?: (provider: Provider) => void;
  onCall?: (provider: Provider) => void;
  searchRadius: number;
  onCustomerDetected?: (distance: number, eta: number) => void;
  onCustomerArrived?: () => void;
}

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? "https://backendhomeheroes.onrender.com" 
  : "http://localhost:3001";

const StandaloneMapView: React.FC<MapViewProps> = ({
  providers,
  userLocation,
  selectedProvider,
  onProviderSelect,
  searchRadius,
}) => {
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [mapInitialized, setMapInitialized] = useState(false);
  const navigate = useNavigate();

  // Use refs for stable values
  const mountedRef = useRef(true);
  const mapContainerRef = useRef<HTMLElement | null>(null);
  const mapInitializedRef = useRef(false);
  const containerIdRef = useRef(`map-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([]);
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Handle view profile navigation
  const handleViewProfile = useCallback((provider: Provider) => {
    console.log('🔄 Navigating to provider profile:', provider._id || provider.id);
    navigate(`/customer/provider/${provider._id || provider.id}`, { 
      state: { provider } 
    });
  }, [navigate]);

  // Close all info windows
  const closeAllInfoWindows = useCallback(() => {
    infoWindowsRef.current.forEach(window => {
      if (window) {
        window.close();
      }
    });
    infoWindowsRef.current = [];
  }, []);

  // Create and initialize map with guaranteed DOM insertion
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

      // Find the main container in the DOM where we should insert the map
      // Look for common container patterns
      const possibleContainers = [
        // Try to find the main content area
        document.querySelector('main'),
        document.querySelector('[class*="container"]'),
        document.querySelector('[class*="main"]'),
        document.querySelector('[class*="content"]'),
        // Fallback to body
        document.body
      ].filter(Boolean);

      let targetContainer: Element | null = null;
      
      for (const container of possibleContainers) {
        if (container) {
          targetContainer = container;
          break;
        }
      }

      if (!targetContainer) {
        throw new Error('Cannot find suitable container for map');
      }

      console.log('✅ Found target container:', targetContainer.tagName, targetContainer.className);

      // Create a completely standalone map section
      const mapSection = document.createElement('div');
      mapSection.id = containerIdRef.current;
      mapSection.className = 'standalone-map-section';
      mapSection.innerHTML = `
        <div class="space-y-6">
          <!-- Header Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white rounded-lg p-4 shadow-sm border">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Total Providers</p>
                  <p class="text-2xl font-bold text-gray-900">${providers.length}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg p-4 shadow-sm border">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Available Now</p>
                  <p class="text-2xl font-bold text-gray-900">${providers.filter(p => p.isAvailableNow).length}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg p-4 shadow-sm border">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Search Radius</p>
                  <p class="text-2xl font-bold text-gray-900">${searchRadius} miles</p>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Map Container -->
            <div class="lg:col-span-2">
              <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div class="p-4 border-b">
                  <h3 class="font-semibold text-gray-900 flex items-center space-x-2">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span>Provider Locations</span>
                  </h3>
                  <p class="text-sm text-gray-600 mt-1">
                    Click on any marker to view provider details
                  </p>
                </div>
                <div class="relative h-96">
                  <div id="${containerIdRef.current}-map" class="w-full h-full bg-gray-100" style="min-height: 384px;">
                    <div class="w-full h-full flex items-center justify-center">
                      <div class="text-center">
                        <div class="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p class="text-gray-500 text-sm">Loading map...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Provider Details Sidebar -->
            <div class="space-y-4" id="${containerIdRef.current}-sidebar">
              <div class="bg-white rounded-xl shadow-sm border p-6 text-center">
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <h3 class="font-semibold text-gray-900 mb-2">Select a Provider</h3>
                <p class="text-gray-600 text-sm">Click on any provider marker on the map to view details</p>
              </div>
            </div>
          </div>
        </div>
      `;

      // Insert the map section into the DOM
      targetContainer.appendChild(mapSection);
      console.log('✅ Map section inserted into DOM');

      // Wait for the container to be rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get the map container
      const mapContainer = document.getElementById(`${containerIdRef.current}-map`);
      if (!mapContainer) {
        throw new Error('Map container not found after DOM insertion');
      }

      mapContainerRef.current = mapContainer;

      console.log('✅ Map container ready, initializing map...');

      // Initialize the map
      googleMapsService.initializeMap(mapContainer, {
        zoom: 10,
        center: userLocation ? 
          { lat: userLocation[0], lng: userLocation[1] } : 
          { lat: 6.5244, lng: 3.3792 }
      });

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
  }, [userLocation, providers.length, searchRadius]);

  // Create markers for all providers
  const createMarkers = useCallback(() => {
    if (!window.google?.maps || !googleMapsService.getMap()) {
      console.log('⚠️ Google Maps not ready for markers');
      return;
    }

    try {
      console.log('📍 Creating markers for', providers.length, 'providers');
      
      // Clear existing markers and info windows
      markersRef.current.forEach(marker => {
        if (marker) {
          marker.setMap(null);
        }
      });
      markersRef.current = [];
      
      closeAllInfoWindows();

      const bounds = new window.google.maps.LatLngBounds();
      let hasValidLocations = false;
      let markersCreated = 0;

      providers.forEach((provider) => {
        if (provider.coordinates && provider.coordinates.length === 2) {
          const position: LatLngLiteral = {
            lat: provider.coordinates[0],
            lng: provider.coordinates[1]
          };

          console.log(`📍 Creating marker for provider: ${provider.name} at`, position);

          // Extend bounds
          bounds.extend(position);
          hasValidLocations = true;
          markersCreated++;

          // Create custom marker with profile picture
          const profileImageUrl = provider.profileImage || provider.profilePicture || provider.avatar;
          const fullImageUrl = profileImageUrl?.startsWith('http') 
            ? profileImageUrl 
            : profileImageUrl?.startsWith('/') 
              ? `${API_BASE_URL}${profileImageUrl}`
              : profileImageUrl;

          // Create marker
          const marker = new window.google.maps.Marker({
            position: position,
            map: googleMapsService.getMap(),
            title: provider.name,
            icon: {
              url: `data:image/svg+xml;base64,${btoa(`
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="${provider.isAvailableNow ? '#10B981' : '#6B7280'}" stroke="white" stroke-width="3"/>
                  <circle cx="20" cy="20" r="8" fill="white"/>
                  ${selectedProvider?.id === provider.id ? `<circle cx="20" cy="20" r="4" fill="${provider.isAvailableNow ? '#10B981' : '#6B7280'}"/>` : ''}
                </svg>
              `)}`,
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20)
            },
            animation: selectedProvider?.id === provider.id ? window.google.maps.Animation.BOUNCE : undefined
          });

          markersRef.current.push(marker);

          // Create info window with close functionality
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div class="p-4 max-w-xs bg-white rounded-lg shadow-lg">
                <div class="flex justify-between items-start mb-3">
                  <h3 class="font-bold text-gray-900 text-lg">${provider.name}</h3>
                  <button id="close-info-${provider.id}" class="text-gray-400 hover:text-gray-600 text-lg font-bold cursor-pointer" style="border: none; background: none; outline: none;">
                    ×
                  </button>
                </div>
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
                  <div class="flex-1">
                    <p class="text-sm text-gray-600">${provider.services?.slice(0, 2).join(', ') || 'Service Provider'}</p>
                    <div class="flex items-center space-x-1 mt-1">
                      <span class="text-yellow-500">★</span>
                      <span class="text-sm font-medium">${(provider.rating || provider.averageRating || 0).toFixed(1)}</span>
                      <span class="text-xs text-gray-500">(${provider.reviewCount || 0})</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-600">Price Range</p>
                    <p class="font-bold text-green-600">${provider.priceRange || 'Contact for pricing'}</p>
                  </div>
                  <button id="view-profile-${provider.id}" class="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer" style="border: none; background: none; outline: none;">
                    View Profile
                  </button>
                </div>
                ${provider.isAvailableNow ? `
                  <div class="flex items-center space-x-1 mt-2">
                    <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span class="text-sm text-green-600 font-medium">Available Now</span>
                  </div>
                ` : ''}
              </div>
            `
          });

          infoWindowsRef.current.push(infoWindow);

          // Add click listener to marker
          marker.addListener('click', () => {
            console.log('📍 Marker clicked for provider:', provider.name);
            
            // Close all other info windows
            closeAllInfoWindows();
            
            // Select the provider
            onProviderSelect(provider);
            
            // Center map on selected provider
            googleMapsService.setMapCenter(position, 15);
            
            // Open info window
            infoWindow.open(googleMapsService.getMap(), marker);
            
            // Add event listeners after the info window is opened
            setTimeout(() => {
              // Close button
              const closeButton = document.getElementById(`close-info-${provider.id}`);
              if (closeButton) {
                closeButton.addEventListener('click', () => {
                  infoWindow.close();
                });
              }
              
              // View profile button
              const viewProfileButton = document.getElementById(`view-profile-${provider.id}`);
              if (viewProfileButton) {
                viewProfileButton.addEventListener('click', () => {
                  handleViewProfile(provider);
                  infoWindow.close();
                });
              }
            }, 100);
          });
        } else {
          console.warn(`❌ Provider ${provider.name} missing coordinates:`, provider.coordinates);
        }
      });

      console.log(`✅ Created ${markersCreated} markers out of ${providers.length} providers`);

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
      console.error('❌ Error creating markers:', error);
    }
  }, [providers, selectedProvider, onProviderSelect, handleViewProfile, closeAllInfoWindows]);

  // Update markers when providers change and map is ready
  useEffect(() => {
    if (!isGoogleMapsLoaded || !mapInitialized || !window.google?.maps) {
      return;
    }

    if (providers.length === 0) {
      markersRef.current.forEach(marker => {
        if (marker) {
          marker.setMap(null);
        }
      });
      markersRef.current = [];
      closeAllInfoWindows();
      return;
    }

    createMarkers();
  }, [isGoogleMapsLoaded, mapInitialized, providers, createMarkers, closeAllInfoWindows]);

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

  // Initialize when component mounts
  useEffect(() => {
    mountedRef.current = true;
    mapInitializedRef.current = false;
    
    console.log('🚀 StandaloneMapView mounted');
    
    // Start initialization
    const initTimeout = setTimeout(() => {
      if (mountedRef.current && !mapInitializedRef.current) {
        initializeMap();
      }
    }, 500);

    return () => {
      console.log('🧹 StandaloneMapView unmounting...');
      mountedRef.current = false;
      clearTimeout(initTimeout);
      
      // Clean up - remove our dynamically created section
      const mapSection = document.getElementById(containerIdRef.current);
      if (mapSection) {
        mapSection.remove();
      }
      
      // Clean up markers and info windows
      markersRef.current.forEach(marker => {
        if (marker) {
          marker.setMap(null);
        }
      });
      markersRef.current = [];
      
      closeAllInfoWindows();
      googleMapsService.destroy();
    };
  }, [initializeMap, closeAllInfoWindows]);

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

  // This component doesn't render anything - it manages the map entirely through DOM manipulation
  return (
    <div style={{ display: 'none' }}>
      {/* This component works entirely through DOM manipulation */}
      {isLoading && (
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
      )}
      
      {loadError && (
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
      )}
    </div>
  );
};

export default StandaloneMapView;