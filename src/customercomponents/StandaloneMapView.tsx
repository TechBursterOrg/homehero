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
  searchQuery: string;
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
  searchQuery,
}) => {
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>(providers);
  const navigate = useNavigate();

  // Use refs for stable values
  const mountedRef = useRef(true);
  const mapContainerRef = useRef<HTMLElement | null>(null);
  const mapInitializedRef = useRef(false);
  const containerIdRef = useRef(`map-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([]);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const isHandlingClickRef = useRef(false); // Add this ref to prevent unmount during click

  // Debug: Log providers data
  useEffect(() => {
    console.log('🗺️ StandaloneMapView - Providers received:', {
      totalProviders: providers.length,
      providersWithCoordinates: providers.filter(p => p.coordinates && p.coordinates.length === 2).length,
      providers: providers.map(p => ({
        name: p.name,
        coordinates: p.coordinates,
        hasCoordinates: !!(p.coordinates && p.coordinates.length === 2)
      }))
    });
  }, [providers]);

  // Filter providers based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProviders(providers);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = providers.filter(provider => {
        const services = provider.services || [];
        const serviceMatch = services.some(service => 
          service.toLowerCase().includes(query)
        );
        const nameMatch = provider.name?.toLowerCase().includes(query);
        const businessNameMatch = (provider as any).businessName?.toLowerCase().includes(query);
        const categoryMatch = (provider as any).category?.toLowerCase().includes(query);
        const specialtyMatch = (provider as any).specialty?.toLowerCase().includes(query);
        
        return serviceMatch || nameMatch || businessNameMatch || categoryMatch || specialtyMatch;
      });
      
      setFilteredProviders(filtered);
      console.log(`🔍 Filtered ${filtered.length} providers for query: "${searchQuery}"`);
    }
  }, [providers, searchQuery]);

  // Close all info windows
  const closeAllInfoWindows = useCallback(() => {
    infoWindowsRef.current.forEach(window => {
      if (window) {
        window.close();
      }
    });
    infoWindowsRef.current = [];
  }, []);

  // Handle view profile navigation
  const handleViewProfile = useCallback((provider: Provider) => {
    console.log('🔄 Navigating to provider profile:', provider._id || provider.id);
    navigate(`/customer/provider/${provider._id || provider.id}`, { 
      state: { provider } 
    });
  }, [navigate]);

  // Highlight sidebar card when provider is selected
  const highlightSidebarCard = useCallback((provider: Provider) => {
    const providerCards = document.querySelectorAll('.provider-card');
    providerCards.forEach(card => {
      card.classList.remove('border-blue-500', 'bg-blue-50', 'ring-2', 'ring-blue-200');
      card.classList.add('border-gray-200', 'bg-white');
    });

    const selectedCard = document.querySelector(`[data-provider-id="${provider.id || provider._id}"]`);
    if (selectedCard) {
      selectedCard.classList.remove('border-gray-200', 'bg-white');
      selectedCard.classList.add('border-blue-500', 'bg-blue-50', 'ring-2', 'ring-blue-200');
      
      selectedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  // Handle provider click from sidebar - FIXED VERSION
  const handleSidebarProviderClick = useCallback((provider: Provider) => {
    console.log('📍 Sidebar provider clicked:', provider.name);
    
    // Set flag to prevent component unmount during click handling
    isHandlingClickRef.current = true;
    
    onProviderSelect(provider);
    
    // Find the marker for this provider
    const markerIndex = markersRef.current.findIndex((_marker, index) => {
      const markerProvider = filteredProviders[index];
      return markerProvider && (markerProvider.id === provider.id || markerProvider._id === provider._id);
    });
    
    console.log('📍 Found marker index:', markerIndex);
    
    if (markerIndex !== -1 && markersRef.current[markerIndex]) {
      closeAllInfoWindows();
      
      if (provider.coordinates && provider.coordinates.length === 2) {
        const position: LatLngLiteral = {
          lat: provider.coordinates[0],
          lng: provider.coordinates[1]
        };
        console.log('📍 Centering map on:', position);
        
        // Center map on selected provider
        googleMapsService.setMapCenter(position, 15);
        
        // Trigger marker click by opening its info window
        const marker = markersRef.current[markerIndex];
        const infoWindow = infoWindowsRef.current[markerIndex];
        
        if (infoWindow && marker) {
          console.log('📍 Opening info window for provider:', provider.name);
          infoWindow.open(googleMapsService.getMap(), marker);
          highlightSidebarCard(provider);
        } else {
          console.warn('❌ Info window or marker not found for provider:', provider.name);
        }
      } else {
        console.warn('❌ Provider missing coordinates:', provider.name, provider.coordinates);
      }
    } else {
      console.warn('❌ No marker found for provider:', provider.name);
      console.log('🔍 Available markers:', markersRef.current.length);
      console.log('🔍 Available providers:', filteredProviders.map(p => p.name));
    }
    
    // Reset flag after a short delay
    setTimeout(() => {
      isHandlingClickRef.current = false;
    }, 100);
  }, [onProviderSelect, filteredProviders, closeAllInfoWindows, highlightSidebarCard]);

  // Create and initialize map with guaranteed DOM insertion
  const initializeMap = useCallback(async () => {
    if (!mountedRef.current || mapInitializedRef.current) {
      return;
    }

    try {
      console.log('🗺️ Starting map initialization...');
      setIsLoading(true);
      setLoadError('');

      console.log('📥 Loading Google Maps API...');
      const loaded = await googleMapsService.loadGoogleMaps();
      
      if (!mountedRef.current) return;

      if (!loaded) {
        throw new Error('Failed to load Google Maps. Please check your internet connection.');
      }

      console.log('✅ Google Maps loaded, creating map container...');

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find existing map section first to prevent duplicate creation
      let mapSection = document.getElementById(containerIdRef.current);
      
      if (!mapSection) {
        const possibleContainers = [
          document.querySelector('main'),
          document.querySelector('[class*="container"]'),
          document.querySelector('[class*="main"]'),
          document.querySelector('[class*="content"]'),
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

        mapSection = document.createElement('div');
        mapSection.id = containerIdRef.current;
        mapSection.className = 'standalone-map-section';
        
        mapSection.innerHTML = `
          <div class="space-y-6">
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
                    <p class="text-sm text-gray-600">${searchQuery ? 'Matching Providers' : 'Total Providers'}</p>
                    <p class="text-2xl font-bold text-gray-900">${filteredProviders.length}</p>
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
                    <p class="text-2xl font-bold text-gray-900">${filteredProviders.filter(p => p.isAvailableNow).length}</p>
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

            ${searchQuery ? `
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-blue-900">Showing results for: <span class="font-bold">"${searchQuery}"</span></p>
                      <p class="text-xs text-blue-700">Found ${filteredProviders.length} provider${filteredProviders.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  ${filteredProviders.length === 0 ? `
                    <button id="clear-search-${containerIdRef.current}" class="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer">
                      Clear Search
                    </button>
                  ` : ''}
                </div>
              </div>
            ` : ''}

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div class="lg:col-span-2">
                <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div class="p-4 border-b">
                    <h3 class="font-semibold text-gray-900 flex items-center space-x-2">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <span>${searchQuery ? `"${searchQuery}" Providers` : 'Provider Locations'}</span>
                    </h3>
                    <p class="text-sm text-gray-600 mt-1">
                      ${filteredProviders.length === 0 
                        ? 'No providers found matching your search criteria' 
                        : 'Click on any marker to view provider details'}
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

              <div class="space-y-4" id="${containerIdRef.current}-sidebar">
                <div class="bg-white rounded-xl shadow-sm border p-4">
                  <h3 class="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span>${searchQuery ? `Matching Providers (${filteredProviders.length})` : `Available Providers (${filteredProviders.length})`}</span>
                  </h3>
                  <div class="space-y-3" id="${containerIdRef.current}-provider-list">
                    ${filteredProviders.length === 0 ? `
                      <div class="text-center py-8">
                        <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                          </svg>
                        </div>
                        <p class="text-gray-500 text-sm mb-2">No providers found for "${searchQuery}"</p>
                        <p class="text-gray-400 text-xs">Try adjusting your search terms or location</p>
                      </div>
                    ` : filteredProviders.map(provider => `
                      <div class="provider-card p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer bg-white" data-provider-id="${provider.id || provider._id}">
                        <div class="flex items-center space-x-3">
                          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold overflow-hidden">
                            ${provider.profileImage || provider.profilePicture || provider.avatar ? 
                              `<img src="${provider.profileImage?.startsWith('http') ? provider.profileImage : (provider.profileImage?.startsWith('/') ? API_BASE_URL + provider.profileImage : provider.profileImage) || provider.profilePicture || provider.avatar}" 
                                    alt="${provider.name}" 
                                    class="w-full h-full object-cover"
                                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                              >` : 
                              ''
                            }
                            <div class="absolute inset-0 flex items-center justify-center ${provider.profileImage || provider.profilePicture || provider.avatar ? 'hidden' : 'flex'}">
                              ${provider.name.charAt(0)}
                            </div>
                          </div>
                          <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between">
                              <h4 class="font-semibold text-gray-900 truncate">${provider.name}</h4>
                              ${provider.isAvailableNow ? `
                                <div class="flex items-center space-x-1">
                                  <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                  <span class="text-xs text-green-600 font-medium">Available</span>
                                </div>
                              ` : ''}
                            </div>
                            <p class="text-sm text-gray-600 truncate">${provider.services?.slice(0, 2).join(', ') || 'Service Provider'}</p>
                            <div class="flex items-center space-x-2 mt-1">
                              <div class="flex items-center space-x-1">
                                <svg class="w-3 h-3 text-yellow-500 fill-current" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                                <span class="text-xs font-medium text-gray-700">${(provider.rating || provider.averageRating || 0).toFixed(1)}</span>
                              </div>
                              <span class="text-xs text-gray-500">•</span>
                              <span class="text-xs text-gray-500">${provider.reviewCount || 0} reviews</span>
                            </div>
                          </div>
                        </div>
                        ${provider.priceRange ? `
                          <div class="mt-2 flex items-center justify-between">
                            <span class="text-sm font-semibold text-green-600">${provider.priceRange}</span>
                            <button class="text-blue-600 hover:text-blue-700 text-xs font-medium view-profile-btn">
                              View Profile
                            </button>
                          </div>
                        ` : ''}
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;

        targetContainer.appendChild(mapSection);
        console.log('✅ Map section inserted into DOM');
      } else {
        console.log('✅ Map section already exists, reusing it');
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      const mapContainer = document.getElementById(`${containerIdRef.current}-map`);
      if (!mapContainer) {
        throw new Error('Map container not found after DOM insertion');
      }

      mapContainerRef.current = mapContainer;

      console.log('✅ Map container ready, initializing map...');

      // Only initialize map if it hasn't been initialized yet
      if (!googleMapsService.getMap()) {
        googleMapsService.initializeMap(mapContainer, {
          zoom: 10,
          center: userLocation ? 
            { lat: userLocation[0], lng: userLocation[1] } : 
            { lat: 6.5244, lng: 3.3792 }
        });
      } else {
        console.log('✅ Map already initialized, reusing existing map');
      }

      if (!mountedRef.current) return;

      mapInitializedRef.current = true;
      setIsGoogleMapsLoaded(true);
      setMapInitialized(true);
      setIsLoading(false);
      console.log('🎉 Map initialized successfully!');

      // Add event listeners to sidebar provider cards
      setTimeout(() => {
        const providerCards = document.querySelectorAll(`.provider-card`);
        console.log(`✅ Found ${providerCards.length} provider cards in sidebar`);
        
        providerCards.forEach((card, index) => {
          // Remove existing event listeners first to prevent duplicates
          card.replaceWith(card.cloneNode(true));
        });

        // Re-query after clone
        const freshProviderCards = document.querySelectorAll(`.provider-card`);
        freshProviderCards.forEach(card => {
          card.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (!target.classList.contains('view-profile-btn')) {
              const providerId = card.getAttribute('data-provider-id');
              const provider = filteredProviders.find(p => (p.id === providerId || p._id === providerId));
              if (provider) {
                console.log('📍 Provider card clicked:', provider.name);
                handleSidebarProviderClick(provider);
              }
            }
          });
        });

        const viewProfileButtons = document.querySelectorAll('.view-profile-btn');
        viewProfileButtons.forEach(button => {
          button.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = (e.target as HTMLElement).closest('.provider-card');
            if (card) {
              const providerId = card.getAttribute('data-provider-id');
              const provider = filteredProviders.find(p => (p.id === providerId || p._id === providerId));
              if (provider) {
                handleViewProfile(provider);
              }
            }
          });
        });

        const clearSearchButton = document.getElementById(`clear-search-${containerIdRef.current}`);
        if (clearSearchButton) {
          clearSearchButton.addEventListener('click', () => {
            console.log('Clear search requested');
          });
        }
      }, 100);

    } catch (error) {
      console.error('❌ Map initialization failed:', error);
      if (mountedRef.current) {
        setLoadError(error instanceof Error ? error.message : 'Failed to initialize map');
        setIsLoading(false);
      }
    }
  }, [userLocation, filteredProviders, searchRadius, searchQuery, handleSidebarProviderClick, handleViewProfile]);

  // Create markers for all providers - FIXED VERSION
  const createMarkers = useCallback(() => {
    if (!window.google?.maps || !googleMapsService.getMap()) {
      console.log('⚠️ Google Maps not ready for markers');
      return;
    }

    try {
      console.log('📍 Creating markers for', filteredProviders.length, 'filtered providers');
      console.log('🔍 Providers with coordinates:', filteredProviders.filter(p => p.coordinates && p.coordinates.length === 2).length);
      
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

      filteredProviders.forEach((provider, index) => {
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
            
            closeAllInfoWindows();
            onProviderSelect(provider);
            googleMapsService.setMapCenter(position, 15);
            infoWindow.open(googleMapsService.getMap(), marker);
            highlightSidebarCard(provider);
            
            setTimeout(() => {
              const closeButton = document.getElementById(`close-info-${provider.id}`);
              if (closeButton) {
                closeButton.addEventListener('click', () => {
                  infoWindow.close();
                });
              }
              
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

      console.log(`✅ Created ${markersCreated} markers out of ${filteredProviders.length} filtered providers`);

      // Fit bounds if we have locations
      if (hasValidLocations) {
        if (filteredProviders.length > 1) {
          googleMapsService.fitBounds(bounds);
        } else if (filteredProviders.length === 1) {
          googleMapsService.setMapCenter({
            lat: filteredProviders[0].coordinates![0],
            lng: filteredProviders[0].coordinates![1]
          }, 14);
        }
      } else if (filteredProviders.length === 0) {
        const center = userLocation ? 
          { lat: userLocation[0], lng: userLocation[1] } : 
          { lat: 6.5244, lng: 3.3792 };
        googleMapsService.setMapCenter(center, 10);
      }

    } catch (error) {
      console.error('❌ Error creating markers:', error);
    }
  }, [filteredProviders, selectedProvider, onProviderSelect, handleViewProfile, closeAllInfoWindows, highlightSidebarCard, userLocation]);

  // Update markers when filtered providers change and map is ready
  useEffect(() => {
    if (!isGoogleMapsLoaded || !mapInitialized || !window.google?.maps) {
      console.log('⚠️ Map not ready for markers:', {
        isGoogleMapsLoaded,
        mapInitialized,
        googleMaps: !!window.google?.maps
      });
      return;
    }

    if (filteredProviders.length === 0) {
      console.log('🔄 No providers to show, clearing markers');
      markersRef.current.forEach(marker => {
        if (marker) {
          marker.setMap(null);
        }
      });
      markersRef.current = [];
      closeAllInfoWindows();
      return;
    }

    console.log('🔄 Creating markers for filtered providers');
    createMarkers();
  }, [isGoogleMapsLoaded, mapInitialized, filteredProviders, createMarkers, closeAllInfoWindows]);

  // Initialize when component mounts
  useEffect(() => {
    mountedRef.current = true;
    mapInitializedRef.current = false;
    
    console.log('🚀 StandaloneMapView mounted');
    
    const initTimeout = setTimeout(() => {
      if (mountedRef.current && !mapInitializedRef.current) {
        initializeMap();
      }
    }, 500);

    return () => {
      // Don't cleanup if we're handling a click
      if (isHandlingClickRef.current) {
        console.log('🔄 Skipping cleanup during click handling');
        return;
      }
      
      console.log('🧹 StandaloneMapView unmounting...');
      mountedRef.current = false;
      clearTimeout(initTimeout);
      
      const mapSection = document.getElementById(containerIdRef.current);
      if (mapSection) {
        mapSection.remove();
      }
      
      markersRef.current.forEach(marker => {
        if (marker) {
          marker.setMap(null);
        }
      });
      markersRef.current = [];
      
      closeAllInfoWindows();
      // Don't destroy the map service to preserve state
      // googleMapsService.destroy();
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

  return (
    <div style={{ display: 'none' }}>
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