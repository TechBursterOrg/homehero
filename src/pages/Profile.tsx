import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Edit3, 
  Star, 
  Mail, 
  Phone, 
  MapPin, 
  Camera,
  Award,
  Clock,
  CheckCircle,
  Calendar,
  Settings,
  Trophy,
  Heart,
  Zap,
  Target,
  Sparkles,
  BadgeCheck,
  TrendingUp,
  Images,
  X,
  Eye,
  Save,
  Loader2,
  AlertCircle
} from 'lucide-react';

// Define types for better TypeScript support
interface GalleryImage {
  id: number;
  url: string;
  title: string;
  category: string;
  description: string;
  date: string;
}

interface Review {
  id: number;
  client: string;
  rating: number;
  date: string;
  comment: string;
  service: string;
  avatar: string;
}

interface ProfileData {
  name: string;
  title: string;
  email: string;
  phoneNumber: string;
  address: string;
  location: string;
  rating: number;
  totalReviews: number;
  joinedDate: string;
  completedJobs: number;
  responseTime: string;
  verified: boolean;
  successRate: number;
  repeatCustomers: number;
  services: string[];
  hourlyRate: number;
  experience: string;
  profileImage: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    title: '',
    email: '',
    phoneNumber: '',
    address: '',
    location: '',
    rating: 0,
    totalReviews: 0,
    joinedDate: '',
    completedJobs: 0,
    responseTime: '',
    verified: false,
    successRate: 0,
    repeatCustomers: 0,
    services: [],
    hourlyRate: 0,
    experience: '',
    profileImage: ''
  });
  const [editForm, setEditForm] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    services: [] as string[],
    hourlyRate: 0,
    experience: ''
  });

  // Fetch profile data from backend
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        throw new Error('Your session has expired. Please log in again.');
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success === false && data.message.includes('token')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        throw new Error('Authentication failed. Please log in again.');
      }
      
      if (data.success && data.data.user) {
        const user = data.data.user;
        
        // FIXED: Properly map profile image fields
        const profileImageUrl = user.profileImage || user.profilePicture || '';
        
        setProfileData({
          name: user.name || '',
          title: user.services && user.services.length > 0 
            ? `Professional ${user.services[0]}` 
            : 'Service Provider',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          address: user.address || '',
          location: user.country || '',
          rating: user.rating || 0,
          totalReviews: user.totalReviews || 0,
          joinedDate: new Date(user.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
          }) || '2024',
          completedJobs: user.completedJobs || 0,
          responseTime: user.responseTime || 'N/A',
          verified: user.isEmailVerified || false,
          successRate: user.successRate || 0,
          repeatCustomers: user.repeatCustomers || 0,
          services: user.services || [],
          hourlyRate: user.hourlyRate || 0,
          experience: user.experience || '',
          profileImage: profileImageUrl // FIXED: Use the mapped value
        });

        setEditForm({
          name: user.name || '',
          phoneNumber: user.phoneNumber || '',
          address: user.address || '',
          services: user.services || [],
          hourlyRate: user.hourlyRate || 0,
          experience: user.experience || ''
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Profile fetch error:', err);
      
      if (errorMessage.includes('session') || errorMessage.includes('Authentication') || errorMessage.includes('token')) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Save profile data to backend
  const saveProfileData = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      
      if (data.success) {
        // FIXED: Update profile data with the form data AND preserve the existing profile image
        setProfileData(prev => ({
          ...prev,
          name: editForm.name,
          phoneNumber: editForm.phoneNumber,
          address: editForm.address,
          services: editForm.services,
          hourlyRate: editForm.hourlyRate,
          experience: editForm.experience
          // Don't override profileImage here - it should be updated separately via image upload
        }));
        
        setIsEditing(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // FIXED: Upload profile image function
  const uploadProfileImage = async (file: File) => {
  try {
    setUploadingImage(true);
    setError(null); // Clear any existing errors
    
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    const formData = new FormData();
    formData.append('profileImage', file);

    const response = await fetch(`${API_BASE_URL}/api/auth/profile/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type when using FormData - browser sets it automatically
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.data.imageUrl) {
      // Update the profile image in state immediately after successful upload
      setProfileData(prev => ({
        ...prev,
        profileImage: data.data.imageUrl
      }));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('profileUpdated', {
        detail: {
          profileImage: data.data.imageUrl,
          name: profileData.name
        }
      }));
      
      console.log('Profile image updated successfully:', data.data.imageUrl);
      return data.data.imageUrl;
    } else {
      throw new Error('Image upload succeeded but no image URL returned');
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
    console.error('Profile image upload error:', err);
    setError(errorMessage);
    throw err;
  } finally {
    setUploadingImage(false);
  }
};

  // Handle camera button click
  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // FIXED: Handle file selection
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, GIF, etc.)');
      return;
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    try {
      await uploadProfileImage(file);
      // Success - the uploadProfileImage function already updates the state
    } catch (error) {
      console.error('File upload error:', error);
      // Error is already set in uploadProfileImage function
    }
    
    // Clear the file input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const fetchGalleryImages = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/gallery`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setGalleryImages(data.data);
        }
      }
    } catch (err) {
      console.error('Gallery fetch error:', err);
    }
  };

  // Fetch reviews from backend
  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/reviews`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setReviews(data.data);
        }
      }
    } catch (err) {
      console.error('Reviews fetch error:', err);
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchGalleryImages();
    fetchReviews();
  }, []);

  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

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

  const serviceOptions = [
    'House Cleaning',
    'Plumbing Repair',
    'Garden Maintenance',
    'Electrical Work',
    'Painting',
    'General Maintenance',
    'Other'
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

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'services', name: 'Services', icon: Settings },
    { id: 'gallery', name: 'Gallery', icon: Images },
    { id: 'reviews', name: 'Reviews', icon: Star }
  ];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://via.placeholder.com/400x400/e2e8f0/64748b?text=Image';
  };

  const handleServiceToggle = (service: string) => {
    setEditForm(prev => {
      const services = prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service];
      
      return { ...prev, services };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profileData.name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProfileData}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        style={{ display: 'none' }}
      />
      
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
                  Professional Profile
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base xl:text-lg mt-1">
                  Manage your profile and showcase your expertise
                </p>
              </div>
            </div>
            
            <button
              onClick={() => isEditing ? saveProfileData() : setIsEditing(!isEditing)}
              disabled={saving}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base disabled:opacity-70"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-md sm:rounded-lg flex items-center justify-center">
                    {isEditing ? <Save className="w-3 h-3 sm:w-4 sm:h-4" /> : <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />}
                  </div>
                  <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          </div>
        )}

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
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
              <div className="relative mx-auto sm:mx-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center border-2 sm:border-4 border-white shadow-xl overflow-hidden">
                  {/* FIXED: Profile image display logic */}
                  {profileData.profileImage ? (
                    <img
                      src={profileData.profileImage.startsWith('/') 
                        ? `${API_BASE_URL}${profileData.profileImage}` 
                        : profileData.profileImage
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Profile image failed to load:', profileData.profileImage);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <span className={`text-white font-bold text-lg sm:text-xl lg:text-4xl ${profileData.profileImage ? 'hidden' : ''}`}>
                    {profileData.name.split(' ').map(n => n[0]).join('') || 'U'}
                  </span>
                </div>
                {/* FIXED: Only show camera button when editing */}
                {isEditing && (
                  <button 
                    onClick={handleCameraClick}
                    disabled={uploadingImage}
                    className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-lg disabled:opacity-50"
                  >
                    {uploadingImage ? (
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600" />
                    )}
                  </button>
                )}
              </div>
              
              <div className="flex-1 w-full">
                <div className="space-y-2 sm:space-y-3 text-center sm:text-left">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 w-full text-center sm:text-left"
                    />
                  ) : (
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{profileData.name}</h2>
                  )}
                  <p className="text-sm sm:text-lg lg:text-xl text-gray-600 font-medium">{profileData.title}</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-6 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-current" />
                      <span className="font-bold text-sm sm:text-lg text-gray-900">{profileData.rating}</span>
                      <span className="text-xs sm:text-sm">({profileData.totalReviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                      <span className="text-xs sm:text-sm">Member since {profileData.joinedDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 mt-4">
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
                  {tab.id === 'gallery' && (
                    <span className="bg-purple-100 text-purple-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold">
                      {galleryImages.length}
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
                      {isEditing ? (
                        <div className="p-2 sm:p-3 bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl">
                          <input
                            type="text"
                            value={editForm.phoneNumber}
                            onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                            className="w-full bg-transparent text-gray-700 font-medium text-sm sm:text-base border border-blue-300 rounded-lg px-3 py-2"
                            placeholder="Phone number"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl">
                          <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 flex-shrink-0" />
                          <span className="text-gray-700 font-medium text-sm sm:text-base">{profileData.phoneNumber || 'Not provided'}</span>
                        </div>
                      )}
                      {isEditing ? (
                        <div className="p-2 sm:p-3 bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl">
                          <input
                            type="text"
                            value={editForm.address}
                            onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                            className="w-full bg-transparent text-gray-700 font-medium text-sm sm:text-base border border-blue-300 rounded-lg px-3 py-2"
                            placeholder="Address"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl">
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" />
                          <span className="text-gray-700 font-medium text-sm sm:text-base">{profileData.address || 'Not provided'}</span>
                        </div>
                      )}
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
                      {isEditing ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate</label>
                            <input
                              type="number"
                              value={editForm.hourlyRate}
                              onChange={(e) => setEditForm({...editForm, hourlyRate: Number(e.target.value)})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              placeholder="Hourly rate"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                            <input
                              type="text"
                              value={editForm.experience}
                              onChange={(e) => setEditForm({...editForm, experience: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              placeholder="Experience (e.g., 5 years)"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                            Professional service provider with {profileData.experience || 'several years'} of experience. 
                            Committed to delivering high-quality work and excellent customer service.
                          </p>
                          {profileData.hourlyRate > 0 && (
                            <p className="font-semibold text-blue-600">
                              Hourly rate: ${profileData.hourlyRate}/hr
                            </p>
                          )}
                          {profileData.experience && (
                            <p className="font-semibold text-green-600">
                              Experience: {profileData.experience}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Skills & Expertise */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-emerald-200">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Services Offered</h3>
                  </div>
                  {isEditing ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                      {serviceOptions.map((service) => (
                        <button
                          key={service}
                          onClick={() => handleServiceToggle(service)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            editForm.services.includes(service)
                              ? 'bg-blue-500 text-white'
                              : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          {service}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                      {profileData.services.map((service) => (
                        <div key={service} className="bg-white/70 backdrop-blur-sm px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-center">
                          <span className="text-xs sm:text-sm font-medium text-gray-700">{service}</span>
                        </div>
                      ))}
                      {profileData.services.length === 0 && (
                        <p className="text-gray-500 col-span-full text-center py-4">No services added yet</p>
                      )}
                    </div>
                  )}
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
                  {profileData.services.map((service, index) => (
                    <div key={index} className="group bg-gradient-to-br from-white to-blue-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <span className="text-xl sm:text-2xl flex-shrink-0">💼</span>
                          <div className="min-w-0">
                            <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-sm sm:text-base">
                              {service}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600">Experience: {profileData.experience || 'Several years'}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-sm sm:text-lg font-bold text-emerald-600">
                            ${profileData.hourlyRate || 25}/hr
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Popularity</span>
                          <span className="font-semibold text-gray-900">N/A</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-emerald-500 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                            style={{ width: `0%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {profileData.services.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No services added yet</p>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Add services in edit mode
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <Images className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-2xl font-bold text-gray-900">Work Gallery</h3>
                      <p className="text-gray-600 text-sm sm:text-base">Showcase of completed projects</p>
                    </div>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {['all', 'cleaning', 'handyman', 'gardening'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border transition-all duration-200 text-sm sm:text-base font-medium capitalize ${
                        selectedCategory === category
                          ? 'bg-purple-500 text-white border-purple-500'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      {category} {category !== 'all' && `(${galleryImages.filter(img => img.category === category).length})`}
                    </button>
                  ))}
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {filteredImages.map((image) => (
                    <div
                      key={image.id}
                      className="group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        setSelectedImage(image);
                        setIsGalleryModalOpen(true);
                      }}
                    >
                      <div className="aspect-square bg-gray-100">
                        <img
                          src={image.url}
                          alt={image.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={handleImageError}
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                          <h4 className="text-white font-semibold text-xs sm:text-sm mb-1 line-clamp-2">
                            {image.title}
                          </h4>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-300 capitalize">{image.category}</span>
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>
                      {/* Category Badge */}
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium text-white shadow-lg ${
                          image.category === 'cleaning' ? 'bg-blue-500' :
                          image.category === 'handyman' ? 'bg-orange-500' :
                          'bg-green-500'
                        }`}>
                          {image.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredImages.length === 0 && (
                  <div className="text-center py-12">
                    <Images className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No images found for this category</p>
                  </div>
                )}
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

        {/* Gallery Modal */}
        {isGalleryModalOpen && selectedImage && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Images className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Work Gallery</h3>
                </div>
                <button
                  onClick={() => {
                    setIsGalleryModalOpen(false);
                    setSelectedImage(null);
                  }}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>
              </div>
              <div className="p-4 sm:p-6 max-h-[calc(95vh-80px)] overflow-y-auto">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="aspect-video bg-gray-100 rounded-xl sm:rounded-2xl overflow-hidden">
                      <img
                        src={selectedImage.url}
                        alt={selectedImage.title}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {galleryImages.map((image) => (
                        <button
                          key={image.id}
                          onClick={() => setSelectedImage(image)}
                          className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                            selectedImage.id === image.id ? 'border-purple-500' : 'border-transparent hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={image.url}
                            alt={image.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/64x64/e2e8f0/64748b?text=Img';
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{selectedImage.title}</h4>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium text-white ${
                          selectedImage.category === 'cleaning' ? 'bg-blue-500' :
                          selectedImage.category === 'handyman' ? 'bg-orange-500' :
                          'bg-green-500'
                        }`}>
                          {selectedImage.category}
                        </span>
                        <span className="text-sm text-gray-600">{selectedImage.date}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{selectedImage.description}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-purple-900">Project Highlights</span>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          Completed on time and within budget
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          Used eco-friendly materials and methods
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          Customer satisfaction: 100%
                        </li>
                      </ul>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200">
                        Similar Service
                      </button>
                      <button className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;