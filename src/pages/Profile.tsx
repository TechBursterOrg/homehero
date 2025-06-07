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
  ThumbsUp
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
    verified: true
  };

  const services = [
    { name: 'House Cleaning', price: '$25-35/hr', experience: '5+ years' },
    { name: 'Deep Cleaning', price: '$75-100/job', experience: '5+ years' },
    { name: 'Handyman Services', price: '$40-60/hr', experience: '3+ years' },
    { name: 'Plumbing Repairs', price: '$50-80/hr', experience: '3+ years' },
    { name: 'Painting', price: '$30-45/hr', experience: '2+ years' },
    { name: 'Garden Maintenance', price: '$20-30/hr', experience: '4+ years' }
  ];

  const reviews = [
    {
      id: 1,
      client: 'Sarah Johnson',
      rating: 5,
      date: '2 days ago',
      comment: 'Alex did an amazing job cleaning our house! Very thorough and professional. Will definitely book again.',
      service: 'Deep House Cleaning'
    },
    {
      id: 2,
      client: 'Mike Chen',
      rating: 5,
      date: '1 week ago',
      comment: 'Excellent plumbing work. Fixed our kitchen sink leak quickly and efficiently. Highly recommended!',
      service: 'Plumbing Repair'
    },
    {
      id: 3,
      client: 'Emma Wilson',
      rating: 4,
      date: '2 weeks ago',
      comment: 'Great garden maintenance service. Alex is reliable and does quality work. Very satisfied!',
      service: 'Garden Maintenance'
    },
    {
      id: 4,
      client: 'David Brown',
      rating: 5,
      date: '3 weeks ago',
      comment: 'Outstanding bathroom renovation help. Professional, clean, and finished on time. Perfect!',
      service: 'Handyman Services'
    }
  ];

  const badges = [
    { name: 'Top Rated', icon: Star, color: 'yellow' },
    { name: 'Verified', icon: Shield, color: 'blue' },
    { name: 'Fast Response', icon: Clock, color: 'green' },
    { name: 'Quality Pro', icon: Award, color: 'purple' }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600">Manage your professional profile and settings</p>
          </div>
        </div>
        
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2"
        >
          <Edit3 className="w-4 h-4" />
          <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-green-500"></div>
        <div className="p-6 -mt-16">
          <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <User className="w-12 h-12 text-white" />
              </div>
              {isEditing && (
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
                  <p className="text-gray-600 mb-2">{profileData.title}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{profileData.rating}</span>
                      <span>({profileData.totalReviews} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {profileData.joinedDate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                  {badges.map((badge) => (
                    <div
                      key={badge.name}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-${badge.color}-100 text-${badge.color}-800`}
                    >
                      <badge.icon className="w-3 h-3" />
                      <span>{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{profileData.completedJobs}</p>
          <p className="text-sm text-gray-600">Completed Jobs</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <ThumbsUp className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">98%</p>
          <p className="text-sm text-gray-600">Satisfaction Rate</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{profileData.responseTime}</p>
          <p className="text-sm text-gray-600">Response Time</p>
        </div>
      </div>

      {/* Profile Content Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['overview', 'services', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">{profileData.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">{profileData.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">{profileData.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Summary</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Professional service provider with over 5 years of experience in home cleaning, maintenance, and repairs. 
                    Committed to delivering high-quality work and excellent customer service. Available for both one-time jobs 
                    and recurring services. Fully insured and background checked.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Services Offered</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{service.name}</h4>
                      <span className="text-sm font-medium text-green-600">{service.price}</span>
                    </div>
                    <p className="text-sm text-gray-600">Experience: {service.experience}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-medium text-gray-900">{profileData.rating}</span>
                  <span className="text-gray-600">({profileData.totalReviews} reviews)</span>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{review.client}</h4>
                        <p className="text-sm text-gray-600">{review.service}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;