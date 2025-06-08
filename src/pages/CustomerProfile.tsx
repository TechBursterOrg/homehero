import React, { useState } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Star,
  Calendar,
  Clock,
  User,
  Heart,
  Bell,
  Settings,
  Home,
  Plus,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Shield,
  Award,
  MessageCircle,
  Phone,
  Mail,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  averagePrice: string;
  providers: number;
}

interface Provider {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  services: string[];
  location: string;
  priceRange: string;
  responseTime: string;
  isVerified: boolean;
  isTopRated: boolean;
  avatar: string;
  completedJobs: number;
}

interface Booking {
  id: string;
  provider: string;
  service: string;
  date: string;
  time: string;
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
  price: string;
}

const CustomerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const services: Service[] = [
    {
      id: '1',
      name: 'House Cleaning',
      description: 'Professional residential cleaning services',
      icon: '🏠',
      averagePrice: '$25-40/hr',
      providers: 127
    },
    {
      id: '2',
      name: 'Plumbing',
      description: 'Repairs, installations, and maintenance',
      icon: '🔧',
      averagePrice: '$50-80/hr',
      providers: 89
    },
    {
      id: '3',
      name: 'Electrical',
      description: 'Wiring, fixtures, and electrical repairs',
      icon: '⚡',
      averagePrice: '$60-90/hr',
      providers: 76
    },
    {
      id: '4',
      name: 'Garden Care',
      description: 'Landscaping and garden maintenance',
      icon: '🌱',
      averagePrice: '$20-35/hr',
      providers: 94
    },
    {
      id: '5',
      name: 'Handyman',
      description: 'General repairs and maintenance',
      icon: '🔨',
      averagePrice: '$30-50/hr',
      providers: 156
    },
    {
      id: '6',
      name: 'Painting',
      description: 'Interior and exterior painting services',
      icon: '🎨',
      averagePrice: '$35-55/hr',
      providers: 68
    }
  ];

  const providers: Provider[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      rating: 4.9,
      reviewCount: 67,
      services: ['House Cleaning', 'Deep Cleaning'],
      location: '2.3 miles away',
      priceRange: '$25-35/hr',
      responseTime: '< 30 min',
      isVerified: true,
      isTopRated: true,
      avatar: 'SJ',
      completedJobs: 134
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      rating: 4.8,
      reviewCount: 45,
      services: ['Plumbing', 'Handyman'],
      location: '1.8 miles away',
      priceRange: '$45-65/hr',
      responseTime: '< 1 hr',
      isVerified: true,
      isTopRated: true,
      avatar: 'MR',
      completedJobs: 89
    },
    {
      id: '3',
      name: 'Alex Chen',
      rating: 4.7,
      reviewCount: 32,
      services: ['Electrical', 'Smart Home'],
      location: '3.1 miles away',
      priceRange: '$55-75/hr',
      responseTime: '< 2 hrs',
      isVerified: true,
      isTopRated: false,
      avatar: 'AC',
      completedJobs: 56
    },
    {
      id: '4',
      name: 'Emma Wilson',
      rating: 4.9,
      reviewCount: 78,
      services: ['Garden Care', 'Landscaping'],
      location: '1.2 miles away',
      priceRange: '$20-30/hr',
      responseTime: '< 45 min',
      isVerified: true,
      isTopRated: true,
      avatar: 'EW',
      completedJobs: 167
    }
  ];

  const bookings: Booking[] = [
    {
      id: '1',
      provider: 'Sarah Johnson',
      service: 'House Cleaning',
      date: 'Today',
      time: '2:00 PM',
      status: 'upcoming',
      price: '$85'
    },
    {
      id: '2',
      provider: 'Mike Rodriguez',
      service: 'Plumbing Repair',
      date: 'Tomorrow',
      time: '10:30 AM',
      status: 'upcoming',
      price: '$125'
    },
    {
      id: '3',
      provider: 'Emma Wilson',
      service: 'Garden Maintenance',
      date: 'Dec 18',
      time: '9:00 AM',
      status: 'completed',
      price: '$75'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Services', count: services.length },
    { id: 'cleaning', name: 'Cleaning', count: 2 },
    { id: 'maintenance', name: 'Maintenance', count: 3 },
    { id: 'outdoor', name: 'Outdoor', count: 1 }
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                HomeHero
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setActiveTab('services')}
                className={`text-sm font-medium transition-colors ${
                  activeTab === 'services' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Find Services
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`text-sm font-medium transition-colors ${
                  activeTab === 'bookings' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Bookings
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`text-sm font-medium transition-colors ${
                  activeTab === 'favorites' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Favorites
              </button>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="hidden md:flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-600">Customer</p>
                </div>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t border-gray-200">
              <button
                onClick={() => {
                  setActiveTab('services');
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'services' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                }`}
              >
                Find Services
              </button>
              <button
                onClick={() => {
                  setActiveTab('bookings');
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'bookings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                }`}
              >
                My Bookings
              </button>
              <button
                onClick={() => {
                  setActiveTab('favorites');
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'favorites' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                }`}
              >
                Favorites
              </button>
              <hr className="my-2 border-gray-200" />
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Profile Settings
              </Link>
              <button className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'services' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
              <div className="max-w-3xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Find Trusted Home Service Professionals
                </h1>
                <p className="text-lg text-blue-100 mb-6">
                  Connect with verified local providers for all your home service needs.
                  From cleaning to repairs, we've got you covered.
                </p>
                
                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="What service do you need?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Your location"
                      className="w-full sm:w-64 pl-12 pr-4 py-3 bg-white rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    />
                  </div>
                  <button className="bg-yellow-500 hover:bg-yellow-400 text-white px-8 py-3 rounded-xl font-semibold transition-colors whitespace-nowrap">
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Service Categories */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Popular Services</h2>
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
                  <span>View all</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{service.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {service.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {service.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-green-600 font-semibold">
                            {service.averagePrice}
                          </span>
                          <span className="text-sm text-gray-500">
                            {service.providers} providers
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Rated Providers */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Top Rated Providers</h2>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {providers.map((provider) => (
                  <div
                    key={provider.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {provider.avatar}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                              <span>{provider.name}</span>
                              {provider.isVerified && (
                                <Shield className="w-4 h-4 text-blue-500" />
                              )}
                              {provider.isTopRated && (
                                <Award className="w-4 h-4 text-yellow-500" />
                              )}
                            </h3>
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="flex items-center space-x-1">
                                {renderStars(provider.rating)}
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {provider.rating}
                              </span>
                              <span className="text-sm text-gray-600">
                                ({provider.reviewCount} reviews)
                              </span>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-red-500 transition-colors">
                            <Heart className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex flex-wrap gap-2">
                            {provider.services.map((service, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                              >
                                {service}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{provider.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>Responds {provider.responseTime}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-semibold text-green-600">
                              {provider.priceRange}
                            </span>
                            <p className="text-xs text-gray-500">
                              {provider.completedJobs} jobs completed
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <MessageCircle className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <Phone className="w-5 h-5" />
                            </button>
                            <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 font-medium">
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                <p className="text-gray-600">Manage your service appointments</p>
              </div>
              <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Book Service</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">2</p>
                    <p className="text-sm text-gray-600">Upcoming</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">4.8</p>
                    <p className="text-sm text-gray-600">Avg Rating</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {booking.provider.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{booking.service}</h3>
                        <p className="text-gray-600">with {booking.provider}</p>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{booking.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{booking.price}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <MessageCircle className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Phone className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Favorite Providers</h1>
              <p className="text-gray-600">Your saved service providers for quick booking</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {providers.slice(0, 2).map((provider) => (
                <div
                  key={provider.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {provider.avatar}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                            <span>{provider.name}</span>
                            {provider.isVerified && (
                              <Shield className="w-4 h-4 text-blue-500" />
                            )}
                          </h3>
                          <div className="flex items-center space-x-2 mb-1">
                            <div className="flex items-center space-x-1">
                              {renderStars(provider.rating)}
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {provider.rating}
                            </span>
                            <span className="text-sm text-gray-600">
                              ({provider.reviewCount} reviews)
                            </span>
                          </div>
                        </div>
                        <button className="text-red-500 hover:text-red-600 transition-colors">
                          <Heart className="w-5 h-5 fill-current" />
                        </button>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex flex-wrap gap-2">
                          {provider.services.map((service, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Last booked: Dec 5, 2024</span>
                          <span className="text-green-600 font-medium">{provider.priceRange}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200 font-medium">
                          Book Again
                        </button>
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <MessageCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;