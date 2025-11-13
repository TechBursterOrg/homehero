import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Search,
  Zap,
  FileText,
  AlertCircle,
  Map,
  List,
  MapPin,
  Star,
  Clock,
  ChevronDown,
  Filter,
  Sparkles,
  X,
  Navigation
} from 'lucide-react';
import { LocationSearch } from './LocationSearch';

// Google Maps types
declare global {
  interface Window {
    google: any;
  }
}

interface LocationData {
  address: string;
  coordinates: [number, number];
}

const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? "https://backendhomeheroes.onrender.com" 
    : "http://localhost:3001";

// Comprehensive service list for auto-complete
const SERVICE_LIST = [
  'houseCleaning',
  'plumbing',
  'electrical',
  'gardenCare',
  'handyman',
  'painting',
  'acRepair',
  'generatorRepair',
  'carpentry',
  'tiling',
  'masonry',
  'welding',
  'pestControl',
  'autoMechanic',
  'panelBeater',
  'autoElectrician',
  'vulcanizer',
  'carWash',
  'hairStylist',
  'makeupArtist',
  'nailTechnician',
  'massageTherapist',
  'tailor',
  'nanny',
  'cook',
  'laundry',
  'gardener',
  'securityGuard',
  'cctvInstaller',
  'solarTechnician',
  'inverterTechnician',
  'itSupport',
  'interiorDesigner',
  'tvRepair',
  'barber',
  'photographer',
  'eventPlanner',
];

// Function to format service names for display
const formatServiceName = (service: string) => {
  return service
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

interface HeroSectionProps {
  serviceType: 'immediate' | 'long-term';
  setServiceType: (type: 'immediate' | 'long-term') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onLocationChange: (location: LocationData) => void;
  currentLocation: string;
  onSearch: (query: string, location: string, serviceType: 'immediate' | 'long-term') => void;
  viewMode: 'list' | 'map';
  onViewModeChange: (mode: 'list' | 'map') => void;
  searchRadius: number;
  onSearchRadiusChange: (radius: number) => void;
  onPostJob?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  serviceType,
  setServiceType,
  searchQuery,
  setSearchQuery,
  onLocationChange,
  currentLocation,
  onSearch,
  viewMode,
  onViewModeChange,
  searchRadius,
  onSearchRadiusChange,
  onPostJob
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState('');
  const [availability, setAvailability] = useState('');
  const [locationDetected, setLocationDetected] = useState(false);
  const [serviceSuggestions, setServiceSuggestions] = useState<string[]>([]);
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [currentLocationAddress, setCurrentLocationAddress] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Use refs for values that change frequently but shouldn't trigger re-renders
  const searchQueryRef = useRef(searchQuery);
  const currentLocationRef = useRef(currentLocation);
  const serviceTypeRef = useRef(serviceType);

  // Update refs when props change
  useEffect(() => {
    searchQueryRef.current = searchQuery;
  }, [searchQuery]);

  useEffect(() => {
    currentLocationRef.current = currentLocation;
  }, [currentLocation]);

  useEffect(() => {
    serviceTypeRef.current = serviceType;
  }, [serviceType]);

  // Get service suggestions based on search query
  const getServiceSuggestions = (query: string): string[] => {
    if (!query.trim()) return [];
    
    const lowercaseQuery = query.toLowerCase();
    
    // Filter services that match the query
    const matchedServices = SERVICE_LIST.filter(service => 
      service.toLowerCase().includes(lowercaseQuery) ||
      formatServiceName(service).toLowerCase().includes(lowercaseQuery)
    );
    
    // Return formatted service names
    return matchedServices.map(service => formatServiceName(service));
  };

  // Fetch service suggestions when search query changes
  useEffect(() => {
    const fetchServiceSuggestions = async () => {
      if (searchQuery.length > 0) {
        try {
          // First try to get suggestions from local service list
          const localSuggestions = getServiceSuggestions(searchQuery);
          
          // If we have local suggestions, use them
          if (localSuggestions.length > 0) {
            setServiceSuggestions(localSuggestions);
            setShowServiceSuggestions(true);
            return;
          }
          
          // Fallback to API if no local matches
          const response = await fetch(`${API_BASE_URL}/api/services?q=${encodeURIComponent(searchQuery)}`);
          if (response.ok) {
            const data = await response.json();
            const apiSuggestions = data.data?.services || [];
            setServiceSuggestions(apiSuggestions);
            setShowServiceSuggestions(true);
          } else {
            setServiceSuggestions([]);
            setShowServiceSuggestions(false);
          }
        } catch (error) {
          console.error('Error fetching service suggestions:', error);
          // Fallback to local suggestions on error
          const fallbackSuggestions = getServiceSuggestions(searchQuery);
          setServiceSuggestions(fallbackSuggestions);
          setShowServiceSuggestions(fallbackSuggestions.length > 0);
        }
      } else {
        setServiceSuggestions([]);
        setShowServiceSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchServiceSuggestions, 150);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // FIXED: Stable search handler with no dependencies - ONLY triggers scroll and search
  const handleSearch = useCallback(() => {
    setShowServiceSuggestions(false);
    
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Call the onSearch callback with current ref values
    onSearch(searchQueryRef.current, currentLocationRef.current, serviceTypeRef.current);
    
    // Scroll to providers section ONLY when Find Now is clicked
    setTimeout(() => {
      const providersSection = document.getElementById('providers-section');
      if (providersSection) {
        providersSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  }, [onSearch]);

  // FIXED: Handle search input key press (Enter key) - only triggers on Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // FIXED: Handle input change without triggering search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.length > 0) {
      setShowServiceSuggestions(true);
    } else {
      setShowServiceSuggestions(false);
    }
  };

  // Handle service suggestion click - UPDATED: No longer triggers search or scroll
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSearchQuery(suggestion);
    setShowServiceSuggestions(false);
    // Only update the search query, don't trigger search or scroll
  }, [setSearchQuery]);

  // Handle location change - UPDATED: No longer triggers search or scroll
  const handleLocationChange = useCallback((location: LocationData) => {
    onLocationChange(location);
    // Only update the location, don't trigger search or scroll
  }, [onLocationChange]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowServiceSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // FIXED: Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-green-50 to-green-100">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 sm:py-8">
        {/* Modern Hero Section */}
        <div className="bg-gradient-to-br from-green-600 via-green-600 to-green-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl">
          
          {/* Enhanced background decorations */}
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>
          <div className="absolute -top-8 -right-8 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-12 -left-12 w-32 h-32 sm:w-40 sm:h-40 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-yellow-400/20 rounded-full blur-xl"></div>
          
          <div className="relative">
            {/* Enhanced Header with icon */}
            <div className="text-center mb-8 sm:mb-12">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl sm:rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300" />
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Find Trusted Professionals
                </h1>
              </div>
              <p className="text-base sm:text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Connect with verified local service providers for all your home needs.
                From immediate repairs to long-term projects.
              </p>
            </div>

            {/* Service Type Toggle with View Mode Toggle */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div className="flex bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1 border border-white/20 shadow-lg w-full sm:w-auto">
                <button
                  onClick={() => setServiceType('immediate')}
                  className={`flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 flex-1 sm:flex-initial ${
                    serviceType === 'immediate'
                      ? 'bg-white text-green-600 shadow-lg transform scale-105'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center ${
                    serviceType === 'immediate' ? 'bg-green-600 text-white' : 'bg-white/20'
                  }`}>
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <span>Need Help Now</span>
                </button>
                <button
                  onClick={() => setServiceType('long-term')}
                  className={`flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 flex-1 sm:flex-initial ${
                    serviceType === 'long-term'
                      ? 'bg-white text-green-600 shadow-lg transform scale-105'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center ${
                    serviceType === 'long-term' ? 'bg-green-600 text-white' : 'bg-white/20'
                  }`}>
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <span>Plan Project</span>
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1 border border-white/20 shadow-lg w-full sm:w-auto">
                <button
                  onClick={() => onViewModeChange('list')}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm font-medium transition-all duration-300 flex-1 sm:flex-initial ${
                    viewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span>List</span>
                </button>
                <button
                  onClick={() => onViewModeChange('map')}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm font-medium transition-all duration-300 flex-1 sm:flex-initial ${
                    viewMode === 'map'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <Map className="w-4 h-4" />
                  <span>Map</span>
                </button>
              </div>
            </div>

            {/* Main Search Bar */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
                <div className="flex-1 relative" ref={searchContainerRef}>
                  <div className="absolute left-4 sm:left-6 top-4 sm:top-5 w-5 h-5 sm:w-6 sm:h-6 text-gray-400 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={serviceType === 'immediate' ? "What do you need help with right now?" : "Describe your project..."}
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onFocus={() => searchQuery.length > 0 && setShowServiceSuggestions(true)}
                    className="w-full pl-14 sm:pl-16 pr-4 sm:pr-6 py-4 sm:py-5 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-yellow-300 focus:outline-none focus:bg-white transition-all duration-200 border border-white/20 shadow-lg text-base sm:text-lg font-medium"
                  />
                  
                  {/* Service Suggestions */}
                  {showServiceSuggestions && serviceSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto z-40">
                      {serviceSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
                        >
                          <Search className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-900">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Show message when no suggestions found */}
                  {showServiceSuggestions && serviceSuggestions.length === 0 && searchQuery.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-40 p-4">
                      <div className="text-sm text-gray-500 text-center">
                        No services found for "{searchQuery}"
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="w-full lg:w-80">
                  <LocationSearch
                    onLocationSelect={handleLocationChange}
                    currentLocation={currentLocation}
                    onCurrentLocationDetect={() => setLocationDetected(true)}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 sm:space-x-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`bg-white/20 backdrop-blur-sm text-white px-4 sm:px-6 py-4 sm:py-5 rounded-xl sm:rounded-2xl hover:bg-white/30 transition-all duration-200 border border-white/20 flex items-center justify-center space-x-2 shadow-lg font-medium ${showFilters ? 'bg-white/30' : ''}`}
                  >
                    <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Filters</span>
                  </button>
                  
                  {serviceType === 'immediate' ? (
                    <button
                      onClick={handleSearch}
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold transition-all duration-200 hover:shadow-xl hover:scale-105 whitespace-nowrap text-base sm:text-lg shadow-lg"
                    >
                      Find Now
                    </button>
                  ) : (
                    onPostJob && (
                      <button
                        onClick={onPostJob}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold transition-all duration-200 hover:shadow-xl hover:scale-105 whitespace-nowrap text-base sm:text-lg shadow-lg"
                      >
                        Post Project
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Enhanced Filters Panel */}
              {showFilters && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 animate-in slide-in-from-top-2 duration-200 shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-bold text-white/90 mb-3">
                        Search Radius
                      </label>
                      <div className="relative">
                        <select
                          value={searchRadius}
                          onChange={(e) => onSearchRadiusChange(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white border border-white/30 focus:ring-2 focus:ring-white/50 focus:outline-none appearance-none font-medium"
                        >
                          <option value={5} className="text-gray-900">5 miles</option>
                          <option value={10} className="text-gray-900">10 miles</option>
                          <option value={25} className="text-gray-900">25 miles</option>
                          <option value={50} className="text-gray-900">50 miles</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-white/70 pointer-events-none" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-white/90 mb-3">
                        Price Range
                      </label>
                      <div className="relative">
                        <select 
                          value={priceRange}
                          onChange={(e) => setPriceRange(e.target.value)}
                          className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white border border-white/30 focus:ring-2 focus:ring-white/50 focus:outline-none appearance-none font-medium"
                        >
                          <option value="" className="text-gray-900">Any budget</option>
                          <option value="low" className="text-gray-900">₦5000</option>
                          <option value="medium" className="text-gray-900">₦10000</option>
                          <option value="high" className="text-gray-900">₦15000</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-white/70 pointer-events-none" />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 lg:col-span-1">
                      <label className="block text-sm font-bold text-white/90 mb-3">
                        When do you need it?
                      </label>
                      <div className="relative">
                        <select 
                          value={availability}
                          onChange={(e) => setAvailability(e.target.value)}
                          className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white border border-white/30 focus:ring-2 focus:ring-white/50 focus:outline-none appearance-none font-medium"
                        >
                          <option value="" className="text-gray-900">Any time</option>
                          <option value="now" className="text-gray-900">Right now</option>
                          <option value="today" className="text-gray-900">Today</option>
                          <option value="week" className="text-gray-900">This week</option>
                          <option value="flexible" className="text-gray-900">I'm flexible</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-white/70 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Status Indicator */}
            {serviceType === 'immediate' && (
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3 text-sm sm:text-base text-blue-100">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Showing available providers within {searchRadius} miles</span>
                </div>
                
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <div className="flex items-center space-x-2 text-white/90">
                    <Star className="w-4 h-4 text-yellow-300 fill-current" />
                    <span className="text-sm font-medium">4.9+ Rating</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/90">
                    <Clock className="w-4 h-4 text-green-300" />
                    <span className="text-sm font-medium">Fast Response</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;