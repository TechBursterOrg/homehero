import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, X as XIcon, Loader2 } from 'lucide-react';

interface LocationData {
  address: string;
  coordinates: [number, number];
}

interface LocationSearchProps {
  onLocationSelect: (location: LocationData) => void;
  currentLocation: string;
  onCurrentLocationDetect: () => void;
  serviceType?: string;
  onFindNow?: () => void;
}

// Load Google Maps script
const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    document.head.appendChild(script);
  });
};

const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
  currentLocation,
  onCurrentLocationDetect,
  serviceType,
  onFindNow
}) => {
  const [searchQuery, setSearchQuery] = useState(currentLocation);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isLoadingScript, setIsLoadingScript] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const autocompleteServiceRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);
  const mapRef = useRef<any>(null);

  const GOOGLE_MAPS_API_KEY = 'AIzaSyCzCXLK2_d7OT0rlw-L7TObYIS1LqDh2_Q';

  // Initialize Google Maps services
  useEffect(() => {
    const initializeGoogleMaps = async () => {
      if (isGoogleLoaded || isLoadingScript) return;
      
      setIsLoadingScript(true);
      try {
        await loadGoogleMapsScript(GOOGLE_MAPS_API_KEY);
        
        // Create a dummy map for the places service
        mapRef.current = new window.google.maps.Map(document.createElement('div'));
        
        // Initialize services
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        placesServiceRef.current = new window.google.maps.places.PlacesService(mapRef.current);
        
        setIsGoogleLoaded(true);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      } finally {
        setIsLoadingScript(false);
      }
    };

    initializeGoogleMaps();
  }, [isGoogleLoaded, isLoadingScript]);

  useEffect(() => {
    setSearchQuery(currentLocation);
  }, [currentLocation]);

  // Get place predictions from Google Places API
  const getPlacePredictions = async (input: string): Promise<any[]> => {
    if (!autocompleteServiceRef.current || !input.trim()) {
      return [];
    }

    return new Promise((resolve) => {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: 'ng' }, // Restrict to Nigeria
          types: ['geocode', 'establishment']
        },
        (predictions: any[], status: string) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            resolve(predictions);
          } else {
            resolve([]);
          }
        }
      );
    });
  };

  // Get place details
  const getPlaceDetails = async (placeId: string): Promise<any> => {
    if (!placesServiceRef.current) {
      return null;
    }

    return new Promise((resolve) => {
      placesServiceRef.current.getDetails(
        {
          placeId,
          fields: ['formatted_address', 'geometry', 'name']
        },
        (place: any, status: string) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            resolve(place);
          } else {
            resolve(null);
          }
        }
      );
    });
  };

  // Handle search input changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length > 2 && isGoogleLoaded) {
        setIsSearching(true);
        try {
          const predictions = await getPlacePredictions(searchQuery);
          setSuggestions(predictions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching place predictions:', error);
          setSuggestions([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, isGoogleLoaded]);

  const handleLocationSelect = async (place: any) => {
    setIsSelecting(true);
    setSearchQuery(place.description);
    setShowSuggestions(false);

    try {
      const placeDetails = await getPlaceDetails(place.place_id);
      if (placeDetails) {
        const locationData: LocationData = {
          address: placeDetails.formatted_address,
          coordinates: [
            placeDetails.geometry.location.lat(),
            placeDetails.geometry.location.lng()
          ]
        };
        
        setSelectedLocation(placeDetails);
        onLocationSelect(locationData);
      }
    } catch (error) {
      console.error('Error getting place details:', error);
      // Fallback to using the prediction data
      const locationData: LocationData = {
        address: place.description,
        coordinates: [0, 0] // Coordinates would need geocoding service
      };
      onLocationSelect(locationData);
    } finally {
      setIsSelecting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (selectedLocation && value !== selectedLocation.formatted_address && !isSelecting) {
      setSelectedLocation(null);
    }
  };

  const handleInputFocus = () => {
    if (searchQuery.length > 2 && !selectedLocation && !isSelecting) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      if (!isSelecting) {
        setShowSuggestions(false);
      }
    }, 150);
  };

  const handleClearLocation = () => {
    setIsSelecting(true);
    setSearchQuery('');
    setSelectedLocation(null);
    setSuggestions([]);
    setShowSuggestions(false);
    setIsSearching(false);
    
    onLocationSelect({
      address: '',
      coordinates: [0, 0]
    });
    
    setTimeout(() => {
      setIsSelecting(false);
    }, 100);
  };

  const handleCurrentLocation = async () => {
    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    try {
      setIsDetectingLocation(true);
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Use Google Geocoding to get address from coordinates
      if (window.google) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
          { location: { lat: latitude, lng: longitude } },
          (results: any[], status: string) => {
            if (status === 'OK' && results[0]) {
              const address = results[0].formatted_address;
              setSearchQuery(address);
              onLocationSelect({
                address: address,
                coordinates: [latitude, longitude]
              });
              onCurrentLocationDetect();
            } else {
              // Fallback to coordinates if geocoding fails
              const address = `Near ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
              setSearchQuery(address);
              onLocationSelect({
                address: address,
                coordinates: [latitude, longitude]
              });
              onCurrentLocationDetect();
            }
          }
        );
      } else {
        // Fallback without Google Maps
        const address = `Near ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        setSearchQuery(address);
        onLocationSelect({
          address: address,
          coordinates: [latitude, longitude]
        });
        onCurrentLocationDetect();
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      alert('Unable to detect your location. Please enter your address manually.');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const getLocationIcon = (types: string[]) => {
    if (types.includes('locality') || types.includes('administrative_area_level_1')) {
      return '🏙️';
    } else if (types.includes('establishment')) {
      return '🏢';
    } else if (types.includes('route') || types.includes('street_address')) {
      return '🏠';
    } else {
      return '📍';
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        if (!isSelecting) {
          setShowSuggestions(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSelecting]);

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
        
        {isLoadingScript && (
          <div className="absolute left-12 top-3.5">
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          </div>
        )}
        
        <input
          ref={inputRef}
          type="text"
          placeholder={isLoadingScript ? "Loading maps..." : "Enter your location..."}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          disabled={isLoadingScript}
          className="w-full pl-14 sm:pl-16 pr-14 sm:pr-16 py-4 sm:py-5 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-yellow-300 focus:outline-none focus:bg-white transition-all duration-200 border border-white/20 shadow-lg text-base sm:text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {searchQuery && (
          <button
            onClick={handleClearLocation}
            className="absolute right-12 top-3.5 p-1 text-gray-400 hover:text-red-600 transition-colors"
            disabled={isSelecting}
          >
            <XIcon className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={handleCurrentLocation}
          disabled={isDetectingLocation || isLoadingScript}
          className="absolute right-3 top-3.5 p-1 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
          title="Use current location"
        >
          {isDetectingLocation ? (
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Navigation className="w-5 h-5" />
          )}
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto z-50">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              onClick={() => handleLocationSelect(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start space-x-3">
                <span className="text-lg mt-0.5 flex-shrink-0">
                  {getLocationIcon(suggestion.types)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.structured_formatting.main_text}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {suggestion.structured_formatting.secondary_text}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {isSearching && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Searching locations...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export { LocationSearch };