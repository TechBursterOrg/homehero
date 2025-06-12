import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  Navigation,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface LocationSearchProps {
  onLocationSelect: (location: { address: string; coordinates: [number, number] }) => void;
  currentLocation: string;
  onCurrentLocationDetect: () => void;
}

interface LocationSuggestion {
  id: string;
  address: string;
  coordinates: [number, number];
  type: 'address' | 'city' | 'landmark';
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
  currentLocation,
  onCurrentLocationDetect
}) => {
  const [searchQuery, setSearchQuery] = useState(currentLocation);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Mock location suggestions - in a real app, you'd use a geocoding service
  const mockSuggestions: LocationSuggestion[] = [
    {
      id: '1',
      address: 'San Francisco, CA, USA',
      coordinates: [37.7749, -122.4194],
      type: 'city'
    },
    {
      id: '2',
      address: 'Los Angeles, CA, USA',
      coordinates: [34.0522, -118.2437],
      type: 'city'
    },
    {
      id: '3',
      address: 'New York, NY, USA',
      coordinates: [40.7128, -74.0060],
      type: 'city'
    },
    {
      id: '4',
      address: 'Chicago, IL, USA',
      coordinates: [41.8781, -87.6298],
      type: 'city'
    },
    {
      id: '5',
      address: 'Seattle, WA, USA',
      coordinates: [47.6062, -122.3321],
      type: 'city'
    }
  ];

  useEffect(() => {
    if (searchQuery.length > 2) {
      setIsSearching(true);
      // Simulate API call delay
      const timer = setTimeout(() => {
        const filtered = mockSuggestions.filter(suggestion =>
          suggestion.address.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSuggestions(filtered);
        setIsSearching(false);
        setShowSuggestions(true);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    setSearchQuery(suggestion.address);
    setShowSuggestions(false);
    onLocationSelect({
      address: suggestion.address,
      coordinates: suggestion.coordinates
    });
  };

  const handleCurrentLocation = async () => {
    setIsDetectingLocation(true);
    
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
          });
        });

        const { latitude, longitude } = position.coords;
        
        // In a real app, you'd reverse geocode these coordinates to get an address
        const mockAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        
        setSearchQuery(mockAddress);
        onLocationSelect({
          address: mockAddress,
          coordinates: [latitude, longitude]
        });
        
        onCurrentLocationDetect();
      } catch (error) {
        console.error('Error getting location:', error);
        alert('Unable to detect your location. Please enter your address manually.');
      }
    } else {
      alert('Geolocation is not supported by your browser.');
    }
    
    setIsDetectingLocation(false);
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'city':
        return '🏙️';
      case 'landmark':
        return '🏛️';
      default:
        return '📍';
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Enter your location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          className="w-full pl-12 pr-12 py-3 bg-white/95 backdrop-blur-sm rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-300 focus:outline-none focus:bg-white transition-all duration-200 border border-gray-200"
        />
        
        <button
          onClick={handleCurrentLocation}
          disabled={isDetectingLocation}
          className="absolute right-3 top-3 p-1 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
          title="Use current location"
        >
          {isDetectingLocation ? (
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Navigation className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Loading indicator */}
      {isSearching && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span>Searching locations...</span>
          </div>
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && !isSearching && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto z-50">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleLocationSelect(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getLocationIcon(suggestion.type)}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {suggestion.address}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {suggestion.type}
                  </p>
                </div>
                <MapPin className="w-4 h-4 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {showSuggestions && suggestions.length === 0 && !isSearching && searchQuery.length > 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <AlertCircle className="w-4 h-4" />
            <span>No locations found. Try a different search term.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;