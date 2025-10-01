import React, { useState, useEffect } from 'react';
import {
  User,
  Camera,
  MapPin,
  Phone,
  Mail,
  Edit3,
  Save,
  X,
  Shield,
  Bell,
  CreditCard,
  Star,
  Calendar,
  Award,
  Settings,
  ChevronRight
} from 'lucide-react';

// UserProfile type
interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  avatar?: string;
  role?: string;
  city?: string;
  state?: string;
  country?: string;
}

interface ProfilePageProps {
  profileData?: UserProfile;
  onProfileUpdate?: (data: UserProfile) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  profileData: initialProfileData,
  onProfileUpdate = () => {}
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    avatar: '',
    role: 'customer',
    city: '',
    state: '',
    country: ''
  });
  const [editedProfile, setEditedProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    avatar: '',
    role: 'customer',
    city: '',
    state: '',
    country: ''
  });
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'activity'>('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    bookingReminders: true,
    marketingEmails: false,
    providerMessages: true,
    searchRadius: '10',
    contactMethod: 'message'
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginAlerts: true
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);

  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? "https://backendhomeheroes.onrender.com" 
    : "http://localhost:3001";

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          console.error('No authentication token found');
          setLoading(false);
          return;
        }

        // Try multiple endpoints to get profile data
        const endpoints = [
          `${API_BASE_URL}/api/auth/profile`,
          `${API_BASE_URL}/api/user/profile`,
          `${API_BASE_URL}/api/users/profile`
        ];

        let profileResponse = null;

        for (const endpoint of endpoints) {
          try {
            // Try POST first
            let response = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });

            if (!response.ok) {
              // Try GET if POST fails
              response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
            }

            if (response.ok) {
              profileResponse = await response.json();
              break;
            }
          } catch (error) {
            console.log(`Failed to fetch from ${endpoint}:`, error);
            continue;
          }
        }

        if (profileResponse && profileResponse.success) {
          const userData = profileResponse.data.user || profileResponse.data;
          console.log('Fetched user data:', userData);
          
          // Construct avatar URL - try multiple possible fields
          let avatarUrl = '';
          if (userData.profileImage) {
            avatarUrl = userData.profileImage.startsWith('http') 
              ? userData.profileImage 
              : `${API_BASE_URL}${userData.profileImage}`;
          } else if (userData.avatar) {
            avatarUrl = userData.avatar.startsWith('http')
              ? userData.avatar
              : `${API_BASE_URL}${userData.avatar}`;
          } else if (userData.profilePicture) {
            avatarUrl = userData.profilePicture.startsWith('http')
              ? userData.profilePicture
              : `${API_BASE_URL}${userData.profilePicture}`;
          }

          const profile = {
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || userData.phoneNumber || '',
            address: userData.address || '',
            bio: userData.bio || '',
            avatar: avatarUrl,
            role: userData.role || userData.userType || 'customer',
            city: userData.city || '',
            state: userData.state || '',
            country: userData.country || ''
          };
          
          setProfileData(profile);
          setEditedProfile(profile);
        } else {
          console.error('Failed to fetch profile data from all endpoints');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Use initial data if provided, otherwise fetch from API
    if (initialProfileData) {
      setProfileData(initialProfileData);
      setEditedProfile(initialProfileData);
      setLoading(false);
    } else {
      fetchProfileData();
    }
  }, [API_BASE_URL, initialProfileData]);

  // Fetch preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/auth/preferences`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setPreferences(data.data.preferences);
          }
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
      }
    };

    fetchPreferences();
  }, [API_BASE_URL]);

  // Fetch activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setActivitiesLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/auth/activity?limit=5`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setActivities(data.data.activities);
          }
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setActivitiesLoading(false);
      }
    };

    fetchActivities();
  }, [API_BASE_URL]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      // Prepare the data for update
      const updateData = {
        name: editedProfile.name,
        phone: editedProfile.phone,
        address: editedProfile.address,
        bio: editedProfile.bio,
        city: editedProfile.city,
        state: editedProfile.state,
        country: editedProfile.country
      };

      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update profile data with the response
          const updatedUserData = data.data.user;
          const updatedProfile = {
            ...editedProfile,
            avatar: updatedUserData.avatar || editedProfile.avatar
          };
          
          setProfileData(updatedProfile);
          setEditedProfile(updatedProfile);
          onProfileUpdate(updatedProfile);
          setIsEditing(false);
          
          alert('Profile updated successfully!');
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to update profile:', errorData);
        alert(errorData.message || 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setSaving(true);
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          console.error('No authentication token found');
          return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert('Please select a valid image file (JPEG, PNG, etc.)');
          return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          alert('Image size must be less than 5MB');
          return;
        }

        const formData = new FormData();
        formData.append('profileImage', file);

        const response = await fetch(`${API_BASE_URL}/api/auth/profile/image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Construct the full avatar URL
            let newAvatar = '';
            if (data.data.imageUrl) {
              newAvatar = data.data.imageUrl.startsWith('http')
                ? data.data.imageUrl
                : `${API_BASE_URL}${data.data.imageUrl}`;
            } else if (data.data.profileImage) {
              newAvatar = data.data.profileImage.startsWith('http')
                ? data.data.profileImage
                : `${API_BASE_URL}${data.data.profileImage}`;
            }
            
            setEditedProfile(prev => ({ ...prev, avatar: newAvatar }));
            setProfileData(prev => ({ ...prev, avatar: newAvatar }));
            onProfileUpdate({ ...profileData, avatar: newAvatar });
            
            alert('Profile picture updated successfully!');
          }
        } else {
          const errorData = await response.json();
          console.error('Failed to upload profile image:', errorData);
          alert(errorData.message || 'Failed to upload profile image. Please try again.');
        }
      } catch (error) {
        console.error('Error uploading profile image:', error);
        alert('Error uploading profile image. Please try again.');
      } finally {
        setSaving(false);
        // Clear the file input
        event.target.value = '';
      }
    }
  };

  // Security functions
  const handleChangePassword = async () => {
    const currentPassword = prompt('Enter your current password:');
    if (!currentPassword) return;

    const newPassword = prompt('Enter your new password:');
    if (!newPassword) return;

    const confirmPassword = prompt('Confirm your new password:');
    if (!confirmPassword) return;

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Password changed successfully');
      } else {
        alert(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password. Please try again.');
    }
  };

  const handleToggleTwoFactor = async () => {
    try {
      const token = localStorage.getItem('authToken');
      // This would integrate with your 2FA service
      setSecuritySettings(prev => ({
        ...prev,
        twoFactorEnabled: !prev.twoFactorEnabled
      }));
      alert('Two-factor authentication ' + (securitySettings.twoFactorEnabled ? 'disabled' : 'enabled'));
    } catch (error) {
      console.error('Error toggling 2FA:', error);
    }
  };

  const handleToggleLoginAlerts = async () => {
    try {
      setSecuritySettings(prev => ({
        ...prev,
        loginAlerts: !prev.loginAlerts
      }));
      // Save to backend
      const token = localStorage.getItem('authToken');
      // You would make an API call here to save the preference
    } catch (error) {
      console.error('Error toggling login alerts:', error);
    }
  };

  // Preferences functions
  const handlePreferenceChange = async (key: string, value: any) => {
    try {
      const updatedPreferences = { ...preferences, [key]: value };
      setPreferences(updatedPreferences);
      
      // Save to backend
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/auth/preferences`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ preferences: updatedPreferences })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('Preferences saved successfully');
        }
      } else {
        console.error('Failed to save preferences');
        // Revert on error
        setPreferences(preferences);
      }
    } catch (error) {
      console.error('Error saving preference:', error);
      // Revert on error
      setPreferences(preferences);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'activity', label: 'Activity', icon: Calendar }
  ] as const;

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
              <div className="space-y-3 flex-1">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderProfileTab = () => (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
            {/* Avatar Section */}
            <div className="relative mx-auto sm:mx-0 flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      console.error('Failed to load profile image:', profileData.avatar);
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <User className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-blue-600 text-white p-1.5 sm:p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={saving}
                  />
                </label>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="space-y-2 sm:space-y-3">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  {profileData.name || 'User'}
                </h1>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                  <span className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1.5 sm:mr-2"></span>
                    Verified {profileData.role}
                  </span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-1 text-xs sm:text-sm text-gray-600">(4.8)</span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm sm:text-base text-gray-600 mt-2 sm:mt-3 line-clamp-2 sm:line-clamp-none">
                {profileData.bio || 'No bio provided'}
              </p>
            </div>
          </div>

          {/* Edit Button - Mobile */}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto sm:self-start flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          )}

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors text-sm sm:text-base"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 transition-colors text-sm sm:text-base"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Contact Information</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={saving}
                />
              ) : (
                <p className="text-sm sm:text-base text-gray-900 break-words">{profileData.email || 'No email provided'}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedProfile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={saving}
                />
              ) : (
                <p className="text-sm sm:text-base text-gray-900">{profileData.phone || 'No phone number provided'}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                Address
              </label>
              {isEditing ? (
                <textarea
                  value={editedProfile.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={saving}
                />
              ) : (
                <p className="text-sm sm:text-base text-gray-900">{profileData.address || 'No address provided'}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={editedProfile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={3}
                  placeholder="Tell us about yourself..."
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={saving}
                />
              ) : (
                <p className="text-sm sm:text-base text-gray-900">{profileData.bio || 'No bio provided'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Location Details */}
        {isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                City
              </label>
              <input
                type="text"
                value={editedProfile.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={saving}
                placeholder="Enter city"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                State
              </label>
              <input
                type="text"
                value={editedProfile.state || ''}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={saving}
                placeholder="Enter state"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Country
              </label>
              <input
                type="text"
                value={editedProfile.country || ''}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={saving}
                placeholder="Enter country"
              />
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">24</p>
          <p className="text-xs sm:text-sm text-gray-600">Bookings Made</p>
        </div>
        
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">4.8</p>
          <p className="text-xs sm:text-sm text-gray-600">Average Rating</p>
        </div>
        
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">8</p>
          <p className="text-xs sm:text-sm text-gray-600">Favorite Providers</p>
        </div>
        
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-600" />
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">$2,450</p>
          <p className="text-xs sm:text-sm text-gray-600">Total Spent</p>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Account Security</h2>
        
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 text-sm sm:text-base">Password</h3>
              <p className="text-xs sm:text-sm text-gray-600">Last changed 3 months ago</p>
            </div>
            <button 
              onClick={handleChangePassword}
              className="w-full sm:w-auto text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base py-2 sm:py-0"
            >
              Change Password
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 text-sm sm:text-base">Two-Factor Authentication</h3>
              <p className="text-xs sm:text-sm text-gray-600">Add an extra layer of security</p>
            </div>
            <ToggleSwitch
              enabled={securitySettings.twoFactorEnabled}
              onChange={handleToggleTwoFactor}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 text-sm sm:text-base">Login Alerts</h3>
              <p className="text-xs sm:text-sm text-gray-600">Get notified of new logins</p>
            </div>
            <ToggleSwitch
              enabled={securitySettings.loginAlerts}
              onChange={handleToggleLoginAlerts}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Notification Preferences</h2>
        
        <div className="space-y-3 sm:space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email notifications', desc: 'Receive updates via email' },
            { key: 'smsNotifications', label: 'SMS notifications', desc: 'Get important alerts via SMS' },
            { key: 'bookingReminders', label: 'Booking reminders', desc: 'Reminders for upcoming bookings' },
            { key: 'marketingEmails', label: 'Marketing emails', desc: 'Promotional offers and news' },
            { key: 'providerMessages', label: 'Provider messages', desc: 'New messages from providers' }
          ].map((pref) => (
            <div key={pref.key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-sm sm:text-base">{pref.label}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{pref.desc}</p>
              </div>
              <ToggleSwitch
                enabled={preferences[pref.key as keyof typeof preferences] as boolean}
                onChange={(enabled) => handlePreferenceChange(pref.key, enabled)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Service Preferences</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Search Radius
            </label>
            <select 
              value={preferences.searchRadius}
              onChange={(e) => handlePreferenceChange('searchRadius', e.target.value)}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="5">5 miles</option>
              <option value="10">10 miles</option>
              <option value="25">25 miles</option>
              <option value="50">50 miles</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Contact Method
            </label>
            <select 
              value={preferences.contactMethod}
              onChange={(e) => handlePreferenceChange('contactMethod', e.target.value)}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="message">Message first</option>
              <option value="phone">Phone call</option>
              <option value="email">Email</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivityTab = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Recent Activity</h2>
        
        {activitiesLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center justify-between gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start sm:items-center justify-between gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 sm:mt-0 ${
                    activity.status === 'completed' ? 'bg-green-500' :
                    activity.status === 'confirmed' ? 'bg-blue-500' : 
                    activity.status === 'delivered' ? 'bg-blue-500' : 'bg-gray-400'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{activity.action}</p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {activity.type === 'booking' && `with ${activity.provider}`}
                      {activity.type === 'service_request' && `with ${activity.provider}`}
                      {activity.type === 'message' && `with ${activity.provider}`}
                    </p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 flex-shrink-0">{activity.displayDate}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Calendar className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-500 text-sm">No recent activity found</p>
            <p className="text-gray-400 text-xs mt-1">Your bookings, messages, and requests will appear here</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            {/* Desktop Tab Navigation */}
            <nav className="hidden sm:flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Tab Navigation */}
            <nav className="sm:hidden px-4 py-2" aria-label="Tabs">
              <select 
                value={activeTab} 
                onChange={(e) => setActiveTab(e.target.value as typeof activeTab)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>
                ))}
              </select>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'security' && renderSecurityTab()}
        {activeTab === 'preferences' && renderPreferencesTab()}
        {activeTab === 'activity' && renderActivityTab()}
      </div>
    </div>
  );
};

// Toggle Switch Component
interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange }) => {
  return (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
      onClick={() => onChange(!enabled)}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

export default ProfilePage;