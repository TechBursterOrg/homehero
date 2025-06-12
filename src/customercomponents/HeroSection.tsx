import React, { useState } from 'react';
import {
  Search,
  Zap,
  FileText,
  AlertCircle,
  Map,
  List,
  Sliders
} from 'lucide-react';
import { ServiceType, LocationData } from '../types';
import LocationSearch from './LocationSearch';

interface HeroSectionProps {
  serviceType: ServiceType;
  setServiceType: (type: ServiceType) => void;
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

  const handleCurrentLocationDetect = () => {
    // This will be called when user's location is detected
    console.log('Current location detected');
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      
      <div className="relative max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
          Find Trusted Home Service Professionals
        </h1>
        <p className="text-lg text-blue-100 mb-6 leading-relaxed">
          Connect with verified local providers for all your home service needs.
          From immediate repairs to long-term contracts.
        </p>
        
        {/* Service Type Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex bg-white/20 backdrop-blur-sm rounded-lg p-1 border border-white/20">
            <button
              onClick={() => setServiceType('immediate')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                serviceType === 'immediate'
                  ? 'bg-white text-blue-600 shadow-sm transform scale-105'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Immediate Service</span>
            </button>
            <button
              onClick={() => setServiceType('long-term')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                serviceType === 'long-term'
                  ? 'bg-white text-blue-600 shadow-sm transform scale-105'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Long-term Contract</span>
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-white/20 backdrop-blur-sm rounded-lg p-1 border border-white/20">
            <button
              onClick={() => onViewModeChange('list')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <List className="w-4 h-4" />
              <span>List</span>
            </button>
            <button
              onClick={() => onViewModeChange('map')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'map'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Map</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={serviceType === 'immediate' ? "Need immediate help with...?" : "Describe your long-term project..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/95 backdrop-blur-sm rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-300 focus:outline-none focus:bg-white transition-all duration-200 border border-gray-200"
              />
            </div>
            
            <div className="lg:w-80">
              <LocationSearch
                onLocationSelect={onLocationChange}
                currentLocation={currentLocation}
                onCurrentLocationDetect={handleCurrentLocationDetect}
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/20 flex items-center space-x-2"
              >
                <Sliders className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
              
              {serviceType === 'immediate' ? (
                <button
                  onClick={onSearch}
                  className="bg-yellow-500 hover:bg-yellow-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 whitespace-nowrap"
                >
                  Find Now
                </button>
              ) : (
                <button
                  onClick={onPostJob}
                  className="bg-yellow-500 hover:bg-yellow-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 whitespace-nowrap"
                >
                  Post Job
                </button>
              )}
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 animate-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Search Radius
                  </label>
                  <select
                    value={searchRadius}
                    onChange={(e) => onSearchRadiusChange(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white border border-white/30 focus:ring-2 focus:ring-white/50 focus:outline-none"
                  >
                    <option value={5} className="text-gray-900">5 miles</option>
                    <option value={10} className="text-gray-900">10 miles</option>
                    <option value={25} className="text-gray-900">25 miles</option>
                    <option value={50} className="text-gray-900">50 miles</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Price Range
                  </label>
                  <select className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white border border-white/30 focus:ring-2 focus:ring-white/50 focus:outline-none">
                    <option value="" className="text-gray-900">Any price</option>
                    <option value="low" className="text-gray-900">$20-40/hr</option>
                    <option value="medium" className="text-gray-900">$40-60/hr</option>
                    <option value="high" className="text-gray-900">$60+/hr</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Availability
                  </label>
                  <select className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white border border-white/30 focus:ring-2 focus:ring-white/50 focus:outline-none">
                    <option value="" className="text-gray-900">Any time</option>
                    <option value="now" className="text-gray-900">Available now</option>
                    <option value="today" className="text-gray-900">Today</option>
                    <option value="week" className="text-gray-900">This week</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {serviceType === 'immediate' && (
          <div className="mt-4 flex items-center space-x-2 text-sm text-blue-100">
            <AlertCircle className="w-4 h-4" />
            <span>Showing providers available now within {searchRadius} miles</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;