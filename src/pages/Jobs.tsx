import React, { useState , useEffect} from 'react';

import { 
  Search, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Eye, 
  Star,
  Briefcase,
  AlertCircle,
  X,
  User,
  Phone,
  Mail,
  CheckCircle,
  Zap,
  Navigation,
  SlidersHorizontal,
  TrendingUp,
  Shield
} from 'lucide-react';

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  timeframe: string;
  budget: string;
  urgency: string;
  rating: number;
  reviews: number;
  category: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  requirements: string[];
  additionalInfo: string;
  isImmediate: boolean;
  distanceFromProvider: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface CategoryInfo {
  icon: string;
  color: string;
  name: string;
}

interface Categories {
  [key: string]: CategoryInfo;
  cleaning: CategoryInfo;
  handyman: CategoryInfo;
  gardening: CategoryInfo;
  petcare: CategoryInfo;
  childcare: CategoryInfo;
}

// API Response interfaces
interface ServiceRequest {
  _id: string;
  serviceType: string;
  description: string;
  location: string;
  createdAt: string;
  timeframe?: string;
  budget?: string;
  urgency?: string;
  category?: string;
  contactInfo?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data: {
    requests: ServiceRequest[];
  };
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const Jobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [maxDistance, setMaxDistance] = useState(50);
  const [showImmediateOnly, setShowImmediateOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatFilter, setSelectedStatFilter] = useState<string | null>(null);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    proposedRate: '',
    availability: '',
    experience: ''
  });
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  // Fix: Properly type the jobs state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    
    console.log('Token exists:', !!token);
    console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
    
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }
    
    const response = await fetch('http://localhost:3001/api/service-requests', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (response.status === 403) {
      throw new Error('Access forbidden. Your session may have expired. Please log in again.');
    }
    
    if (response.status === 401) {
      throw new Error('Unauthorized. Please check your login credentials.');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText || 'Failed to fetch jobs'}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      // Transform API data to match your job structure
      const transformedJobs: Job[] = data.data.requests.map((request: ServiceRequest) => ({
        id: parseInt(request._id, 36),
        title: request.serviceType,
        description: request.description,
        location: request.location,
        date: new Date(request.createdAt).toISOString().split('T')[0],
        timeframe: request.timeframe || 'Flexible',
        budget: request.budget || 'Negotiable',
        urgency: request.urgency || 'Standard',
        rating: 4.5,
        reviews: 0,
        category: request.category || 'general',
        customerName: request.contactInfo?.name || 'Unknown Customer',
        customerPhone: request.contactInfo?.phone || 'Not provided',
        customerEmail: request.contactInfo?.email || 'Not provided',
        requirements: [],
        additionalInfo: request.description,
        isImmediate: request.urgency === 'urgent' || request.serviceType.toLowerCase().includes('immediate'),
        distanceFromProvider: Math.floor(Math.random() * 25) + 1,
        coordinates: request.coordinates || { lat: 0, lng: 0 }
      }));
      
      setJobs(transformedJobs);
    } else {
      throw new Error(data.message || 'API returned unsuccessful response');
    }
  } catch (err: unknown) {
    let errorMessage = 'An unknown error occurred';
    
    if (err instanceof Error) {
      errorMessage = err.message;
    } else if (typeof err === 'string') {
      errorMessage = err;
    }
    
    console.error('Error fetching jobs:', err);
    setError(errorMessage);
    
    if (errorMessage.includes('forbidden') || errorMessage.includes('unauthorized') || errorMessage.includes('No authentication token')) {
      // Optional: redirect to login page
      // window.location.href = '/login';
    }
  } finally {
    setLoading(false);
  }
};

    fetchJobs();
  }, []); // Empty dependency array to run only once on mount

  const availableJobs = jobs;

  const filteredJobs = availableJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || job.category === selectedFilter;
    const matchesDistance = job.distanceFromProvider <= maxDistance;
    const matchesImmediate = !showImmediateOnly || job.isImmediate;
    
    // Add stat filter logic
    let matchesStatFilter = true;
    if (selectedStatFilter) {
      switch (selectedStatFilter) {
        case 'urgent':
          matchesStatFilter = job.isImmediate;
          break;
        case 'nearby':
          matchesStatFilter = job.distanceFromProvider <= 5;
          break;
        case 'all':
        default:
          matchesStatFilter = true;
          break;
      }
    }
    
    return matchesSearch && matchesFilter && matchesDistance && matchesImmediate && matchesStatFilter;
  });

  const immediateJobs = filteredJobs.filter(job => job.isImmediate);
  const regularJobs = filteredJobs.filter(job => !job.isImmediate);

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
  };

  const handleApplyNow = (job: Job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
    setApplicationSubmitted(false);
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Application submitted:', {
      jobId: selectedJob?.id,
      ...applicationData
    });
    
    setApplicationSubmitted(true);
    setTimeout(() => {
      setShowApplicationModal(false);
      setSelectedJob(null);
      setApplicationData({
        coverLetter: '',
        proposedRate: '',
        availability: '',
        experience: ''
      });
    }, 2000);
  };

  const closeModals = () => {
    setSelectedJob(null);
    setShowApplicationModal(false);
    setApplicationSubmitted(false);
  };

  const handleStatCardClick = (statType: string) => {
    if (selectedStatFilter === statType) {
      // If clicking the same stat, clear the filter
      setSelectedStatFilter(null);
    } else {
      // Set the new stat filter
      setSelectedStatFilter(statType);
    }
  };

  const getCategoryInfo = (category: string): CategoryInfo => {
    const categories: Categories = {
      cleaning: { icon: '🧽', color: 'bg-blue-50 text-blue-700 border-blue-200', name: 'Cleaning' },
      handyman: { icon: '🔧', color: 'bg-orange-50 text-orange-700 border-orange-200', name: 'Handyman' },
      gardening: { icon: '🌿', color: 'bg-green-50 text-green-700 border-green-200', name: 'Gardening' },
      petcare: { icon: '🐾', color: 'bg-purple-50 text-purple-700 border-purple-200', name: 'Pet Care' },
      childcare: { icon: '👶', color: 'bg-pink-50 text-pink-700 border-pink-200', name: 'Child Care' }
    };
    return categories[category as keyof Categories] || { icon: '💼', color: 'bg-gray-50 text-gray-700 border-gray-200', name: 'Other' };
  };

  const getCustomerInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const JobCard = ({ job }: { job: Job }) => {
    const categoryInfo = getCategoryInfo(job.category);
    
    return (
      <div className={`group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 ${job.isImmediate ? 'ring-2 ring-red-100 bg-gradient-to-br from-white to-red-50' : ''}`}>
        {job.isImmediate && (
          <div className="absolute -top-2 -right-2">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 sm:px-3 py-1 rounded-full font-semibold flex items-center gap-1 animate-pulse shadow-lg">
              <Zap className="w-3 h-3" />
              URGENT
            </div>
          </div>
        )}

        {/* Mobile-first layout */}
        <div className="space-y-4">
          {/* Header section with avatar and category */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Customer Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xs sm:text-sm">
                    {getCustomerInitials(job.customerName)}
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-5 sm:h-5 bg-green-400 rounded-full border-2 border-white"></div>
              </div>

              {/* Category and rating - mobile optimized */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl text-xs font-medium border ${categoryInfo.color} w-fit`}>
                    <span className="text-xs sm:text-sm">{categoryInfo.icon}</span>
                    <span className="hidden sm:inline">{categoryInfo.name}</span>
                  </span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                    <span className="text-xs sm:text-sm font-medium text-gray-900">{job.rating}</span>
                    <span className="text-xs text-gray-500">({job.reviews})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* View details button - only on mobile */}
            <button 
              onClick={() => handleViewDetails(job)}
              className="sm:hidden p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 flex-shrink-0"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Job title and description */}
          <div className="space-y-2">
            <h3 className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {job.title}
            </h3>
            
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
              {job.description}
            </p>
          </div>

          {/* Key details - optimized for mobile */}
          <div className="space-y-3">
            {/* Budget and distance - always visible */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">Budget</p>
                  <p className="font-bold text-green-600 text-xs sm:text-sm truncate">{job.budget}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Navigation className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">Distance</p>
                  <p className="font-medium text-gray-900 text-xs sm:text-sm">{job.distanceFromProvider}mi</p>
                </div>
              </div>
            </div>

            {/* Date and time - smaller on mobile */}
            <div className="flex items-center gap-2 text-xs text-gray-500 border-t border-gray-100 pt-3">
              <Calendar className="w-3 h-3 text-gray-400" />
              <span className="font-medium">{job.customerName}</span>
              <span>•</span>
              <span>{job.date}</span>
              <span>•</span>
              <span className="truncate">{job.timeframe}</span>
            </div>
          </div>

          {/* Action buttons - full width on mobile */}
          <div className="flex items-center gap-2 pt-2">
            {/* View details - desktop only */}
            <button 
              onClick={() => handleViewDetails(job)}
              className="hidden sm:flex p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            
            {/* Apply button - responsive */}
            <button 
              onClick={() => handleApplyNow(job)}
              className={`${
                job.isImmediate 
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-200' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-200'
              } text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 hover:scale-105 hover:shadow-xl flex-1 sm:flex-none`}
            >
              {job.isImmediate ? 'Apply Now' : 'Apply'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Jobs...</h3>
          <p className="text-gray-600">Finding the best opportunities for you</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Jobs</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Modern Header - mobile optimized */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Find Your Next Job
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-lg">Discover opportunities that match your skills</p>
                </div>
              </div>
            </div>
            
            {/* Search and Filter Bar - mobile optimized */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl sm:rounded-2xl hover:bg-white transition-all duration-200 text-sm sm:text-base"
              >
                <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Expandable Filters - mobile responsive */}
          {showFilters && (
            <div className="mt-4 sm:mt-6 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 space-y-4 shadow-lg">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select 
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm sm:text-base"
                  >
                    <option value="all">All Categories</option>
                    <option value="cleaning">🧽 Cleaning</option>
                    <option value="handyman">🔧 Handyman</option>
                    <option value="gardening">🌿 Gardening</option>
                    <option value="petcare">🐾 Pet Care</option>
                    <option value="childcare">👶 Child Care</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Distance: {maxDistance} miles
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-3 cursor-pointer bg-gradient-to-r from-red-50 to-orange-50 p-3 rounded-xl border border-red-100">
                    <input
                      type="checkbox"
                      checked={showImmediateOnly}
                      onChange={(e) => setShowImmediateOnly(e.target.checked)}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 bg-white border-2 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                    />
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-red-700">Immediate services only</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modern Stats Cards - responsive grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button 
            onClick={() => handleStatCardClick('all')}
            className={`bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 border shadow-sm hover:shadow-lg transition-all duration-200 text-left cursor-pointer hover:scale-105 ${
              selectedStatFilter === 'all' || selectedStatFilter === null 
                ? 'border-blue-300 bg-blue-50/80 ring-2 ring-blue-200' 
                : 'border-gray-100 hover:border-blue-200'
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-2xl flex items-center justify-center">
                <Briefcase className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{availableJobs.length}</p>
                <p className="text-xs sm:text-sm text-gray-600">Available Jobs</p>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => handleStatCardClick('urgent')}
            className={`bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 border shadow-sm hover:shadow-lg transition-all duration-200 text-left cursor-pointer hover:scale-105 ${
              selectedStatFilter === 'urgent' 
                ? 'border-red-300 bg-red-50/80 ring-2 ring-red-200' 
                : 'border-gray-100 hover:border-red-200'
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg sm:rounded-2xl flex items-center justify-center">
                <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{availableJobs.filter(job => job.isImmediate).length}</p>
                <p className="text-xs sm:text-sm text-gray-600">Urgent Jobs</p>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => handleStatCardClick('nearby')}
            className={`bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 border shadow-sm hover:shadow-lg transition-all duration-200 text-left cursor-pointer hover:scale-105 ${
              selectedStatFilter === 'nearby' 
                ? 'border-green-300 bg-green-50/80 ring-2 ring-green-200' 
                : 'border-gray-100 hover:border-green-200'
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg sm:rounded-2xl flex items-center justify-center">
                <Navigation className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {availableJobs.filter(job => job.distanceFromProvider <= 5).length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Within 5mi</p>
              </div>
            </div>
          </button>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">12</p>
                <p className="text-xs sm:text-sm text-gray-600">Applied Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Urgent Jobs Section */}
        {immediateJobs.length > 0 && !showImmediateOnly && !selectedStatFilter && (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Urgent Jobs</h2>
                <p className="text-gray-600 text-sm sm:text-base">These customers need immediate help</p>
              </div>
              <span className="bg-gradient-to-r from-red-100 to-orange-100 text-red-700 text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full font-semibold border border-red-200">
                {immediateJobs.length} urgent
              </span>
            </div>
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              {immediateJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {/* Regular Jobs Section */}
        {regularJobs.length > 0 && !showImmediateOnly && !selectedStatFilter && (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Available Jobs</h2>
                <p className="text-gray-600 text-sm sm:text-base">Browse all available opportunities</p>
              </div>
            </div>
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              {regularJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {/* Show filtered jobs when stat filter is active */}
        {selectedStatFilter && (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center ${
                selectedStatFilter === 'urgent' 
                  ? 'bg-gradient-to-br from-red-500 to-orange-500' 
                  : selectedStatFilter === 'nearby'
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                  : 'bg-gradient-to-br from-blue-500 to-purple-500'
              }`}>
                {selectedStatFilter === 'urgent' ? (
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : selectedStatFilter === 'nearby' ? (
                  <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : (
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {selectedStatFilter === 'urgent' && 'Urgent Jobs Only'}
                  {selectedStatFilter === 'nearby' && 'Jobs Within 5 Miles'}
                  {selectedStatFilter === 'all' && 'All Available Jobs'}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  {selectedStatFilter === 'urgent' && 'Customers who need immediate assistance'}
                  {selectedStatFilter === 'nearby' && 'Jobs close to your location'}
                  {selectedStatFilter === 'all' && 'Browse all available opportunities'}
                </p>
              </div>
              <button 
                onClick={() => setSelectedStatFilter(null)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                title="Clear filter"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {/* Show all jobs when immediate filter is on */}
        {showImmediateOnly && !selectedStatFilter && (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Urgent Jobs Only</h2>
                <p className="text-gray-600 text-sm sm:text-base">Customers who need immediate assistance</p>
              </div>
            </div>
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {filteredJobs.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Search className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No jobs found</h3>
            <p className="text-gray-600 text-sm sm:text-lg max-w-md mx-auto px-4">Try adjusting your search criteria, distance range, or category filters to find more opportunities.</p>
          </div>
        )}

        {/* Job Details Modal - mobile responsive */}
        {selectedJob && !showApplicationModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white rounded-t-2xl sm:rounded-t-3xl border-b border-gray-100 p-4 sm:p-6 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-white font-bold text-sm sm:text-lg">
                        {getCustomerInitials(selectedJob.customerName)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{selectedJob.title}</h2>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                        {selectedJob.isImmediate && (
                          <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 sm:px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            URGENT
                          </span>
                        )}
                        <span className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl text-xs font-medium border ${getCategoryInfo(selectedJob.category).color}`}>
                          {getCategoryInfo(selectedJob.category).icon} {getCategoryInfo(selectedJob.category).name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={closeModals}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
                {/* Job Overview */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-100">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Job Description</h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-lg">{selectedJob.description}</p>
                </div>

                {/* Key Details Grid - mobile responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 sm:mb-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-xl sm:rounded-2xl flex items-center justify-center">
                        <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Budget Range</p>
                        <p className="text-lg sm:text-xl font-bold text-green-600">{selectedJob.budget}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 sm:mb-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-xl sm:rounded-2xl flex items-center justify-center">
                        <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Distance</p>
                        <p className="text-lg sm:text-xl font-bold text-blue-600">{selectedJob.distanceFromProvider} miles</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 sm:mb-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-50 rounded-xl sm:rounded-2xl flex items-center justify-center">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Customer Rating</p>
                        <p className="text-lg sm:text-xl font-bold text-amber-500">{selectedJob.rating} ⭐</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule & Location - mobile responsive */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      Schedule Details
                    </h4>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm sm:text-base">Date:</span>
                        <span className="font-semibold text-sm sm:text-base">{selectedJob.date}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm sm:text-base">Time:</span>
                        <span className="font-semibold text-sm sm:text-base">{selectedJob.timeframe}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                      Location
                    </h4>
                    <p className="text-gray-700 text-sm sm:text-base">{selectedJob.location}</p>
                  </div>
                </div>

                {/* Customer Information - mobile responsive */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Name</p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{selectedJob.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                        <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{selectedJob.customerPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                        <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Email</p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base break-all">{selectedJob.customerEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirements - mobile responsive */}
                {selectedJob.requirements.length > 0 && (
                  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                      Requirements
                    </h4>
                    <div className="grid grid-cols-1 gap-2 sm:gap-3">
                      {selectedJob.requirements.map((req, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg sm:rounded-xl border border-green-100">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-green-800 text-xs sm:text-sm">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-amber-100">
                  <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                    Additional Information
                  </h4>
                  <p className="text-amber-800 leading-relaxed text-sm sm:text-base">{selectedJob.additionalInfo}</p>
                </div>

                {/* Action Button - mobile responsive */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 sm:pt-6 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-current" />
                      <span className="font-bold text-gray-900 text-sm sm:text-base">{selectedJob.rating}</span>
                      <span className="text-gray-500 text-sm">({selectedJob.reviews} reviews)</span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      Customer since 2023
                    </div>
                  </div>
                  <button 
                    onClick={() => handleApplyNow(selectedJob)}
                    className={`${
                      selectedJob.isImmediate 
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-200' 
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-200'
                    } text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg transition-all duration-200 hover:scale-105 hover:shadow-xl w-full sm:w-auto`}
                  >
                    {selectedJob.isImmediate ? 'Apply Now - Urgent!' : 'Apply for This Job'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Application Modal - mobile responsive */}
        {showApplicationModal && selectedJob && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-4 sm:p-8">
                {!applicationSubmitted ? (
                  <>
                    <div className="text-center mb-6 sm:mb-8">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Apply for Job</h2>
                      {selectedJob.isImmediate && (
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-orange-100 text-red-700 px-3 sm:px-4 py-1 sm:py-2 rounded-full font-semibold border border-red-200">
                          <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                          Urgent Response Needed
                        </div>
                      )}
                    </div>

                    <div className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl ${selectedJob.isImmediate ? 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'}`}>
                      <h3 className={`font-bold text-base sm:text-lg mb-2 ${selectedJob.isImmediate ? 'text-red-900' : 'text-blue-900'}`}>{selectedJob.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                        <span className={selectedJob.isImmediate ? 'text-red-700' : 'text-blue-700'}>{selectedJob.location}</span>
                        <span className="font-semibold text-green-600">{selectedJob.budget}</span>
                        <span className={selectedJob.isImmediate ? 'text-red-700' : 'text-blue-700'}>{selectedJob.distanceFromProvider} miles away</span>
                      </div>
                      {selectedJob.isImmediate && (
                        <p className="text-red-800 text-xs sm:text-sm mt-2 sm:mt-3 font-semibold">⚡ This customer needs immediate assistance! Quick response increases your chances.</p>
                      )}
                    </div>

                    <form onSubmit={handleApplicationSubmit} className="space-y-4 sm:space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">
                          Your Rate & Availability *
                        </label>
                        <input
                          type="text"
                          required
                          value={applicationData.proposedRate}
                          onChange={(e) => setApplicationData({...applicationData, proposedRate: e.target.value})}
                          className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-sm sm:text-base"
                          placeholder={selectedJob.isImmediate ? "I can be there within [X] minutes/hours for $[rate]" : "My rate: $[amount] - Available: [when]"}
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-0 sm:justify-between pt-4 sm:pt-6 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={closeModals}
                          className="w-full sm:w-auto px-6 sm:px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all duration-200 font-semibold text-sm sm:text-base"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className={`w-full sm:w-auto ${
                            selectedJob.isImmediate 
                              ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-200' 
                              : 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-200'
                          } text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all duration-200 hover:scale-105 hover:shadow-xl text-sm sm:text-base`}
                        >
                          {selectedJob.isImmediate ? '⚡ Submit Urgent Application' : 'Submit Application'}
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Application Submitted!</h2>
                    <div className="max-w-md mx-auto px-4">
                      <p className="text-gray-600 text-sm sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                        {selectedJob.isImmediate 
                          ? "Your urgent application has been sent! The customer will contact you immediately if interested. Keep your phone nearby!"
                          : "Your application has been sent to the customer. They'll review it and contact you if you're a good fit."
                        }
                      </p>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-blue-100">
                        <p className="text-xs sm:text-sm text-blue-700 font-medium">Pro tip: Check your phone and email regularly for responses!</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;