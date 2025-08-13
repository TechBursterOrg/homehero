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
        className={`w-4 h-4 ${
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Professional Profile 👤
                  </h1>
                  <p className="text-gray-600 text-lg">Manage your profile and showcase your expertise</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg shadow-blue-200 flex items-center gap-3"
            >
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                <Edit3 className="w-4 h-4" />
              </div>
              <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Enhanced Profile Header Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="h-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
            <div className="absolute top-6 right-6">
              {profileData.verified && (
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">Verified Pro</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-8 -mt-20">
            <div className="flex flex-col lg:flex-row lg:items-end gap-6">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center border-4 border-white shadow-xl">
                  <span className="text-white font-bold text-4xl">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                {isEditing && (
                  <button className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-lg">
                    <Camera className="w-6 h-6 text-gray-600" />
                  </button>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-gray-900">{profileData.name}</h2>
                    <p className="text-xl text-gray-600 font-medium">{profileData.title}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="font-bold text-lg text-gray-900">{profileData.rating}</span>
                        <span>({profileData.totalReviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <span>Member since {profileData.joinedDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {badges.map((badge) => (
                      <div
                        key={badge.name}
                        className={`flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r ${badge.bgColor} border border-white/50 shadow-sm`}
                      >
                        <div className={`w-6 h-6 bg-gradient-to-r ${badge.color} rounded-xl flex items-center justify-center`}>
                          <badge.icon className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-medium text-gray-700 text-sm">{badge.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Achievement Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {achievementStats.map((stat, index) => (
            <div key={index} className="group bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-blue-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">Professional standard</p>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex px-8 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 py-6 px-6 border-b-3 font-semibold text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                  } rounded-t-2xl`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                  {tab.id === 'reviews' && (
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-bold">
                      {profileData.totalReviews}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Contact Information */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                        <Mail className="w-5 h-5 text-blue-500" />
                        <span className="text-gray-700 font-medium">{profileData.email}</span>
                      </div>
                      <div className="flex items-center gap-4 p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                        <Phone className="w-5 h-5 text-emerald-500" />
                        <span className="text-gray-700 font-medium">{profileData.phone}</span>
                      </div>
                      <div className="flex items-center gap-4 p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                        <MapPin className="w-5 h-5 text-purple-500" />
                        <span className="text-gray-700 font-medium">{profileData.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Professional Summary */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Professional Summary</h3>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                      <p className="text-gray-700 leading-relaxed">
                        Professional service provider with over 5 years of experience in home cleaning, maintenance, and repairs. 
                        Committed to delivering high-quality work and excellent customer service. Available for both one-time jobs 
                        and recurring services. Fully insured and background checked.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills & Expertise */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Skills & Expertise</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {['Deep Cleaning', 'Plumbing', 'Electrical', 'Painting', 'Gardening', 'Handyman'].map((skill) => (
                      <div key={skill} className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl text-center">
                        <span className="text-sm font-medium text-gray-700">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Services Offered</h3>
                      <p className="text-gray-600">Professional services with competitive pricing</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map((service, index) => (
                    <div key={index} className="group bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{service.icon}</span>
                          <div>
                            <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {service.name}
                            </h4>
                            <p className="text-sm text-gray-600">Experience: {service.experience}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-emerald-600">{service.price}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Popularity</span>
                          <span className="font-semibold text-gray-900">{service.popularity}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
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
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                      <Star className="w-5 h-5 text-white fill-current" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
                      <p className="text-gray-600">What clients say about my work</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-orange-50 px-6 py-3 rounded-2xl border border-yellow-200">
                    <Star className="w-6 h-6 text-yellow-500 fill-current" />
                    <span className="font-bold text-2xl text-gray-900">{profileData.rating}</span>
                    <span className="text-gray-600">({profileData.totalReviews} reviews)</span>
                  </div>
                </div>

                <div className="grid gap-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="group bg-gradient-to-br from-white to-yellow-50 p-6 rounded-2xl border border-gray-200 hover:shadow-lg hover:border-yellow-300 transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <span className="text-white font-bold text-sm">{review.avatar}</span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-bold text-gray-900 mb-1">{review.client}</h4>
                              <p className="text-sm text-blue-600 font-medium">{review.service}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 mb-1">
                                {renderStars(review.rating)}
                              </div>
                              <p className="text-sm text-gray-500">{review.date}</p>
                            </div>
                          </div>
                          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl">
                            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
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