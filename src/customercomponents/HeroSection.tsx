import React, { useState } from 'react';
import {
  Search,
  Zap,
  FileText,
  AlertCircle,
  Map,
  List,
  Sliders,
  MapPin,
  Star,
  Clock,
  DollarSign,
  ChevronDown,
  Filter,
  Sparkles
} from 'lucide-react';

interface LocationData {
  address: string;
  coordinates: [number, number];
}

interface HeroSectionProps {
  serviceType: 'immediate' | 'long-term';
  setServiceType: (type: 'immediate' | 'long-term') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onPostJob: () => void;
  onLocationChange: (location: LocationData) => void;
  currentLocation: string;
  onSearch: () => void;
  viewMode: 'list' | 'map';
  onViewModeChange: (mode: 'list' | 'map') => void;
  searchRadius: number;
  onSearchRadiusChange: (radius: number) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  serviceType,
  setServiceType,
  searchQuery,
  setSearchQuery,
  onPostJob,
  onLocationChange,
  currentLocation,
  onSearch,
  viewMode,
  onViewModeChange,
  searchRadius,
  onSearchRadiusChange
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState('');
  const [availability, setAvailability] = useState('');

  const handleCurrentLocationDetect = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationChange({
          address: 'Current Location',
          coordinates: [position.coords.latitude, position.coords.longitude]
        });
      },
      (error) => {
        console.error('Location detection failed:', error);
      }
    );
  };

  const serviceCategories = [
    { id: 'cleaning', name: 'House Cleaning', icon: '🧽' },
    { id: 'handyman', name: 'Handyman', icon: '🔧' },
    { id: 'gardening', name: 'Gardening', icon: '🌿' },
    { id: 'plumbing', name: 'Plumbing', icon: '🚿' },
    { id: 'electrical', name: 'Electrical', icon: '⚡' },
    { id: 'painting', name: 'Painting', icon: '🎨' }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto  sm:px-6 lg:px-8  sm:py-8">
        {/* Modern Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>
          <div className="absolute -top-8 -right-8 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-12 -left-12 w-32 h-32 sm:w-40 sm:h-40 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-yellow-400/20 rounded-full blur-xl"></div>
          
          <div className="relative">
            {/* Header */}
            <div className="text-center mb-8 sm:mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl sm:rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300" />
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Find Trusted Professionals
                </h1>
              </div>
              <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Connect with verified local service providers for all your home needs.
                From immediate repairs to long-term projects.
              </p>
            </div>

            {/* Service Type Toggle */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div className="flex bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1 border border-white/20 shadow-lg">
                <button
                  onClick={() => setServiceType('immediate')}
                  className={`flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${
                    serviceType === 'immediate'
                      ? 'bg-white text-blue-600 shadow-lg transform scale-105'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center ${
                    serviceType === 'immediate' ? 'bg-blue-600 text-white' : 'bg-white/20'
                  }`}>
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <span>Need Help Now</span>
                </button>
                <button
                  onClick={() => setServiceType('long-term')}
                  className={`flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${
                    serviceType === 'long-term'
                      ? 'bg-white text-blue-600 shadow-lg transform scale-105'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center ${
                    serviceType === 'long-term' ? 'bg-blue-600 text-white' : 'bg-white/20'
                  }`}>
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <span>Plan Project</span>
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1 border border-white/20 shadow-lg">
                <button
                  onClick={() => onViewModeChange('list')}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm font-medium transition-all duration-300 ${
                    viewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">List</span>
                </button>
                <button
                  onClick={() => onViewModeChange('map')}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm font-medium transition-all duration-300 ${
                    viewMode === 'map'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <Map className="w-4 h-4" />
                  <span className="hidden sm:inline">Map</span>
                </button>
              </div>
            </div>

            {/* Main Search Bar */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
                <div className="flex-1 relative">
                  <div className="absolute left-4 sm:left-6 top-4 sm:top-5 w-5 h-5 sm:w-6 sm:h-6 text-gray-400 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder={serviceType === 'immediate' ? "What do you need help with right now?" : "Describe your project..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 sm:pl-16 pr-4 sm:pr-6 py-4 sm:py-5 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-yellow-300 focus:outline-none focus:bg-white transition-all duration-200 border border-white/20 shadow-lg text-base sm:text-lg font-medium"
                  />
                </div>
                
                <div className="lg:w-80">
                  <div className="relative">
                    <div className="absolute left-4 sm:left-6 top-4 sm:top-5 w-5 h-5 sm:w-6 sm:h-6 text-gray-400 bg-gray-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter your location"
                      value={currentLocation}
                      onChange={(e) => onLocationChange({ address: e.target.value, coordinates: [0, 0] })}
                      className="w-full pl-14 sm:pl-16 pr-12 sm:pr-14 py-4 sm:py-5 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-yellow-300 focus:outline-none focus:bg-white transition-all duration-200 border border-white/20 shadow-lg text-base sm:text-lg font-medium"
                    />
                    <button
                      onClick={handleCurrentLocationDetect}
                      className="absolute right-2 sm:right-3 top-2 sm:top-3 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl transition-colors flex items-center justify-center shadow-lg"
                    >
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex space-x-2 sm:space-x-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`bg-white/20 backdrop-blur-sm text-white px-4 sm:px-6 py-4 sm:py-5 rounded-xl sm:rounded-2xl hover:bg-white/30 transition-all duration-200 border border-white/20 flex items-center space-x-2 shadow-lg font-medium ${showFilters ? 'bg-white/30' : ''}`}
                  >
                    <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Filters</span>
                  </button>
                  
                  {serviceType === 'immediate' ? (
                    <button
                      onClick={onSearch}
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold transition-all duration-200 hover:shadow-xl hover:scale-105 whitespace-nowrap text-base sm:text-lg shadow-lg"
                    >
                      Find Now
                    </button>
                  ) : (
                    <button
                      onClick={onPostJob}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold transition-all duration-200 hover:shadow-xl hover:scale-105 whitespace-nowrap text-base sm:text-lg shadow-lg"
                    >
                      Post Project
                    </button>
                  )}
                </div>
              </div>

              {/* Enhanced Filters Panel */}
              {showFilters && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 animate-in slide-in-from-top-2 duration-200 shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
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
                          <option value="low" className="text-gray-900">$20-40/hr</option>
                          <option value="medium" className="text-gray-900">$40-60/hr</option>
                          <option value="high" className="text-gray-900">$60+/hr</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-white/70 pointer-events-none" />
                      </div>
                    </div>
                    
                    <div>
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