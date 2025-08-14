import React, { useState } from 'react';
import { 
  User, 
  Edit3, 
  Star, 
  Mail, 
  Phone, 
  MapPin, 
  Camera,
  Shield,
  Award,
  Clock,
  CheckCircle,
  Calendar,
  ThumbsUp,
  Settings,
  Trophy,
  Heart,
  Zap,
  Target,
  Activity,
  ChevronRight,
  Sparkles,
  BadgeCheck,
  Globe,
  TrendingUp
} from 'lucide-react';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const profileData = {
    name: 'Alex Rodriguez',
    title: 'Professional Cleaner & Handyman',
    email: 'alex.rodriguez@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    rating: 4.9,
    totalReviews: 43,
    joinedDate: 'March 2019',
    completedJobs: 247,
    responseTime: '< 2 hours',
    verified: true,
    successRate: 98,
    repeatCustomers: 85
  };

  const services = [
    { 
      name: 'House Cleaning', 
      price: '$25-35/hr', 
      experience: '5+ years',
      icon: '🧽',
      popularity: 95,
      category: 'cleaning'
    },
    { 
      name: 'Deep Cleaning', 
      price: '$75-100/job', 
      experience: '5+ years',
      icon: '✨',
      popularity: 92,
      category: 'cleaning'
    },
    { 
      name: 'Handyman Services', 
      price: '$40-60/hr', 
      experience: '3+ years',
      icon: '🔧',
      popularity: 88,
      category: 'handyman'
    },
    { 
      name: 'Plumbing Repairs', 
      price: '$50-80/hr', 
      experience: '3+ years',
      icon: '🚿',
      popularity: 85,
      category: 'handyman'
    },
    { 
      name: 'Painting', 
      price: '$30-45/hr', 
      experience: '2+ years',
      icon: '🎨',
      popularity: 78,
      category: 'handyman'
    },
    { 
      name: 'Garden Maintenance', 
      price: '$20-30/hr', 
      experience: '4+ years',
      icon: '🌿',
      popularity: 82,
      category: 'gardening'
    }
  ];

  const reviews = [
    {
      id: 1,
      client: 'Sarah Johnson',
      rating: 5,
      date: '2 days ago',
      comment: 'Alex did an amazing job cleaning our house! Very thorough and professional. Will definitely book again.',
      service: 'Deep House Cleaning',
      avatar: 'SJ'
    },
    {
      id: 2,
      client: 'Mike Chen',
      rating: 5,
      date: '1 week ago',
      comment: 'Excellent plumbing work. Fixed our kitchen sink leak quickly and efficiently. Highly recommended!',
      service: 'Plumbing Repair',
      avatar: 'MC'
    },
    {
      id: 3,
      client: 'Emma Wilson',
      rating: 4,
      date: '2 weeks ago',
      comment: 'Great garden maintenance service. Alex is reliable and does quality work. Very satisfied!',
      service: 'Garden Maintenance',
      avatar: 'EW'
    },
    {
      id: 4,
      client: 'David Brown',
      rating: 5,
      date: '3 weeks ago',
      comment: 'Outstanding bathroom renovation help. Professional, clean, and finished on time. Perfect!',
      service: 'Handyman Services',
      avatar: 'DB'
    }
  ];

  const badges = [
    { name: 'Top Rated', icon: Star, color: 'from-yellow-400 to-orange-500', bgColor: 'from-yellow-50 to-orange-50' },
    { name: 'Verified Pro', icon: BadgeCheck, color: 'from-blue-400 to-blue-600', bgColor: 'from-blue-50 to-indigo-50' },
    { name: 'Quick Response', icon: Zap, color: 'from-emerald-400 to-green-600', bgColor: 'from-emerald-50 to-green-50' },
    { name: 'Quality Expert', icon: Trophy, color: 'from-purple-400 to-purple-600', bgColor: 'from-purple-50 to-violet-50' }
  ];

  const achievementStats = [
    { label: 'Completed Jobs', value: profileData.completedJobs, icon: CheckCircle, color: 'from-blue-500 to-blue-600' },
    { label: 'Success Rate', value: `${profileData.successRate}%`, icon: Target, color: 'from-emerald-500 to-green-600' },
    { label: 'Response Time', value: profileData.responseTime, icon: Clock, color: 'from-purple-500 to-purple-600' },
    { label: 'Repeat Clients', value: `${profileData.repeatCustomers}%`, icon: Heart, color: 'from-pink-500 to-rose-600' }
  ];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 sm:w-4 sm:h-4 ${
          i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'services', name: 'Services', icon: Settings },
    { id: 'reviews', name: 'Reviews', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        
        {/* Responsive Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0">
                <User className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Professional Profile 👤
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base xl:text-lg mt-1">
                  Manage your profile and showcase your expertise
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-md sm:rounded-lg flex items-center justify-center">
                <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Enhanced Profile Header Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6 sm:mb-8">
          <div className="h-24 sm:h-32 lg:h-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
            <div className="absolute top-3 sm:top-4 lg:top-6 right-3 sm:right-4 lg:right-6">
              {profileData.verified && (
                <div className="bg-white/20 backdrop-blur-sm px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center gap-1 sm:gap-2">
                  <BadgeCheck className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                  <span className="text-white font-medium text-xs sm:text-sm">Verified Pro</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 sm:p-6 lg:p-8 -mt-12 sm:-mt-16 lg:-mt-20">
            <div className="flex flex-col space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
                <div className="relative mx-auto sm:mx-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center border-2 sm:border-4 border-white shadow-xl">
                    <span className="text-white font-bold text-lg sm:text-xl lg:text-4xl">
                      {profileData.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-lg">
                      <Camera className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600" />
                    </button>
                  )}
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <div className="space-y-2 sm:space-y-3">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{profileData.name}</h2>
                    <p className="text-sm sm:text-lg lg:text-xl text-gray-600 font-medium">{profileData.title}</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-current" />
                        <span className="font-bold text-sm sm:text-lg text-gray-900">{profileData.rating}</span>
                        <span>({profileData.totalReviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        <span>Member since {profileData.joinedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
                {badges.map((badge) => (
                  <div
                    key={badge.name}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-r ${badge.bgColor} border border-white/50 shadow-sm`}
                  >
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-gradient-to-r ${badge.color} rounded-lg sm:rounded-xl flex items-center justify-center`}>
                      <badge.icon className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                    </div>
                    <span className="font-medium text-gray-700 text-xs sm:text-sm">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Achievement Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {achievementStats.map((stat, index) => (
            <div key={index} className="group bg-white/80 backdrop-blur-sm p-3 sm:p-4 lg:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-2 sm:mb-4 gap-2 sm:gap-0">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${stat.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <div className="text-blue-600 hidden sm:block">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Professional standard</p>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex px-3 sm:px-6 lg:px-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 sm:gap-3 py-3 sm:py-4 lg:py-6 px-3 sm:px-4 lg:px-6 border-b-2 sm:border-b-3 font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                  } rounded-t-xl sm:rounded-t-2xl`}
                >
                  <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{tab.name}</span>
                  {tab.id === 'reviews' && (
                    <span className="bg-blue-100 text-blue-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold">
                      {profileData.totalReviews}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  {/* Contact Information */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-blue-200">
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">Contact Information</h3>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                        <span className="text-gray-700 font-medium text-sm sm:text-base break-all">{profileData.email}</span>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-gray-700 font-medium text-sm sm:text-base">{profileData.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" />
                        <span className="text-gray-700 font-medium text-sm sm:text-base">{profileData.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Professional Summary */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-purple-200">
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">Professional Summary</h3>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl">
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Professional service provider with over 5 years of experience in home cleaning, maintenance, and repairs. 
                        Committed to delivering high-quality work and excellent customer service. Available for both one-time jobs 
                        and recurring services. Fully insured and background checked.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills & Expertise */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-emerald-200">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Skills & Expertise</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                    {['Deep Cleaning', 'Plumbing', 'Electrical', 'Painting', 'Gardening', 'Handyman'].map((skill) => (
                      <div key={skill} className="bg-white/70 backdrop-blur-sm px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-center">
                        <span className="text-xs sm:text-sm font-medium text-gray-700">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-2xl font-bold text-gray-900">Services Offered</h3>
                      <p className="text-gray-600 text-sm sm:text-base">Professional services with competitive pricing</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {services.map((service, index) => (
                    <div key={index} className="group bg-gradient-to-br from-white to-blue-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <span className="text-xl sm:text-2xl flex-shrink-0">{service.icon}</span>
                          <div className="min-w-0">
                            <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-sm sm:text-base">
                              {service.name}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600">Experience: {service.experience}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-sm sm:text-lg font-bold text-emerald-600">{service.price}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Popularity</span>
                          <span className="font-semibold text-gray-900">{service.popularity}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-emerald-500 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                            style={{ width: `${service.popularity}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-current" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-2xl font-bold text-gray-900">Customer Reviews</h3>
                      <p className="text-gray-600 text-sm sm:text-base">What clients say about my work</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-yellow-50 to-orange-50 px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-yellow-200">
                    <Star className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-500 fill-current" />
                    <span className="font-bold text-lg sm:text-2xl text-gray-900">{profileData.rating}</span>
                    <span className="text-gray-600 text-sm sm:text-base">({profileData.totalReviews} reviews)</span>
                  </div>
                </div>

                <div className="grid gap-4 sm:gap-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="group bg-gradient-to-br from-white to-yellow-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200 hover:shadow-lg hover:border-yellow-300 transition-all duration-300">
                      <div className="flex gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <span className="text-white font-bold text-xs sm:text-sm">{review.avatar}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 sm:mb-3 gap-2">
                            <div className="min-w-0">
                              <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">{review.client}</h4>
                              <p className="text-xs sm:text-sm text-blue-600 font-medium">{review.service}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="flex items-center gap-1 mb-1 justify-end sm:justify-start">
                                {renderStars(review.rating)}
                              </div>
                              <p className="text-xs sm:text-sm text-gray-500">{review.date}</p>
                            </div>
                          </div>
                          <div className="bg-white/70 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl">
                            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;