import React, { useState } from 'react';
import {
  Camera,
  Edit3,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Eye,
  EyeOff,
  LogOut,
  Settings,
  Bell,
  Lock,
  Smartphone,
  Globe,
  CreditCard,
  Star,
  Calendar,
  Activity,
  Award,
  CheckCircle,
  Trash2,
  Download,
  Upload
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  avatar?: string;
  joinDate?: string;
  totalBookings?: number;
  preferredServices?: string[];
  notificationSettings?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

// Extended interface for the local edit state
interface ExtendedUserProfile extends UserProfile {
  joinDate: string;
  totalBookings: number;
  preferredServices: string[];
  notificationSettings: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface ProfileSectionProps {
  profileData: UserProfile;
  setProfileData: (data: UserProfile) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  profileData,
  setProfileData
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'billing'>('profile');
  
  // Initialize editData with default values for required fields
  const [editData, setEditData] = useState<ExtendedUserProfile>({
    ...profileData,
    joinDate: profileData.joinDate || 'March 2023',
    totalBookings: profileData.totalBookings || 24,
    preferredServices: profileData.preferredServices || ['House Cleaning', 'Plumbing', 'Electrical'],
    notificationSettings: profileData.notificationSettings || {
      email: true,
      sms: false,
      push: true
    }
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditData(prev => ({
          ...prev,
          avatar: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = () => {
    // Convert back to UserProfile format when saving
    const updatedProfile: UserProfile = {
      name: editData.name,
      email: editData.email,
      phone: editData.phone,
      address: editData.address,
      bio: editData.bio,
      avatar: editData.avatar,
      joinDate: editData.joinDate,
      totalBookings: editData.totalBookings,
      preferredServices: editData.preferredServices,
      notificationSettings: editData.notificationSettings
    };
    setProfileData(updatedProfile);
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    // Reset editData with current profile data and defaults
    setEditData({
      ...profileData,
      joinDate: profileData.joinDate || 'March 2023',
      totalBookings: profileData.totalBookings || 24,
      preferredServices: profileData.preferredServices || ['House Cleaning', 'Plumbing', 'Electrical'],
      notificationSettings: profileData.notificationSettings || {
        email: true,
        sms: false,
        push: true
      }
    });
    setIsEditingProfile(false);
  };

  const handlePasswordChange = () => {
    console.log('Changing password...');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowChangePassword(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-700 rounded-3xl flex items-center justify-center shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Profile & Settings ⚙️
                  </h1>
                  <p className="text-gray-600 text-lg">Manage your account, security, and preferences</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="bg-white/80 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg shadow-sm border border-gray-200 flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg shadow-purple-200 flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <span>Import Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div className="text-blue-600">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Member Since</p>
              <p className="text-3xl font-bold text-gray-900">{editData.joinDate}</p>
              <div className="text-sm text-blue-600 font-semibold">
                Trusted customer
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div className="text-green-600">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{editData.totalBookings}</p>
              <div className="text-sm text-green-600 font-semibold">
                Services completed
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Star className="w-7 h-7 text-white fill-current" />
              </div>
              <div className="text-purple-600">
                <Shield className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Trust Score</p>
              <p className="text-3xl font-bold text-gray-900">98%</p>
              <div className="text-sm text-purple-600 font-semibold">
                Excellent rating
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Settings className="w-7 h-7 text-white" />
              </div>
              <div className="text-orange-600">
                <Bell className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Preferences</p>
              <p className="text-3xl font-bold text-gray-900">{editData.preferredServices.length}</p>
              <div className="text-sm text-orange-600 font-semibold">
                Services tracked
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Profile Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 p-8 text-center sticky top-8">
              <div className="relative inline-block mb-6">
                {editData.avatar ? (
                  <img
                    src={editData.avatar}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover ring-4 ring-purple-200 mx-auto shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto ring-4 ring-purple-200 shadow-lg">
                    {editData.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                
                {isEditingProfile && (
                  <label
                    htmlFor="avatar-upload"
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-200 shadow-lg"
                  >
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {editData.name}
              </h3>
              <p className="text-purple-600 font-semibold mb-4">Premium Customer</p>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-green-600 mb-6 bg-green-50 rounded-2xl py-3 px-4">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">Verified Account</span>
              </div>

              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-center justify-center space-x-3 p-3 bg-gray-50 rounded-2xl">
                  <Mail className="w-5 h-5 text-purple-500" />
                  <span className="font-medium">{editData.email}</span>
                </div>
                <div className="flex items-center justify-center space-x-3 p-3 bg-gray-50 rounded-2xl">
                  <Phone className="w-5 h-5 text-purple-500" />
                  <span className="font-medium">{editData.phone}</span>
                </div>
                <div className="flex items-center justify-center space-x-3 p-3 bg-gray-50 rounded-2xl">
                  <MapPin className="w-5 h-5 text-purple-500" />
                  {/* <span className="font-medium">Lagos, Nigeria</span> */}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Enhanced Tab Navigation */}
              <div className="border-b border-gray-200 bg-white/50">
                <nav className="flex space-x-8 px-8 pt-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 pb-4 border-b-2 font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
                        <p className="text-gray-600 mt-1">Manage your account details and preferences</p>
                      </div>
                      <button
                        onClick={() => {
                          if (isEditingProfile) {
                            handleCancelEdit();
                          } else {
                            setIsEditingProfile(true);
                          }
                        }}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 ${
                          isEditingProfile
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                        }`}
                      >
                        {isEditingProfile ? (
                          <>
                            <X className="w-5 h-5" />
                            <span>Cancel</span>
                          </>
                        ) : (
                          <>
                            <Edit3 className="w-5 h-5" />
                            <span>Edit Profile</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Full Name
                          </label>
                          {isEditingProfile ? (
                            <input
                              type="text"
                              value={editData.name}
                              onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 transition-all duration-200"
                            />
                          ) : (
                            <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-2xl font-medium">{profileData.name}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Email Address
                          </label>
                          {isEditingProfile ? (
                            <input
                              type="email"
                              value={editData.email}
                              onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 transition-all duration-200"
                            />
                          ) : (
                            <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-2xl font-medium">{profileData.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Phone Number
                          </label>
                          {isEditingProfile ? (
                            <input
                              type="tel"
                              value={editData.phone}
                              onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 transition-all duration-200"
                            />
                          ) : (
                            <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-2xl font-medium">{profileData.phone}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Address
                          </label>
                          {isEditingProfile ? (
                            <input
                              type="text"
                              value={editData.address}
                              onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 transition-all duration-200"
                            />
                          ) : (
                            <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-2xl font-medium">{profileData.address}</p>
                          )}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Bio
                        </label>
                        {isEditingProfile ? (
                          <textarea
                            value={editData.bio}
                            onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 transition-all duration-200"
                            placeholder="Tell us a bit about yourself..."
                          />
                        ) : (
                          <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-2xl font-medium min-h-[100px]">{profileData.bio || 'No bio added yet.'}</p>
                        )}
                      </div>
                    </div>

                    {isEditingProfile && (
                      <div className="flex items-center space-x-4 pt-8 border-t border-gray-200">
                        <button
                          onClick={handleProfileSave}
                          className="flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200 hover:scale-105"
                        >
                          <Save className="w-5 h-5" />
                          <span>Save Changes</span>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-8 py-4 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
                        >
                          Discard Changes
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Security Settings</h3>
                      <p className="text-gray-600">Protect your account with these security features</p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-3xl border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                              <Lock className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">Password</h4>
                              <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setShowChangePassword(true)}
                            className="bg-white text-purple-600 px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 border border-purple-200"
                          >
                            Change Password
                          </button>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-3xl border border-green-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                              <Smartphone className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">Two-Factor Authentication</h4>
                              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                            </div>
                          </div>
                          <button className="bg-white text-green-600 px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 border border-green-200">
                            Enable 2FA
                          </button>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-3xl border border-orange-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                              <Globe className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">Login Sessions</h4>
                              <p className="text-sm text-gray-600">Manage your active login sessions</p>
                            </div>
                          </div>
                          <button className="bg-white text-orange-600 px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 border border-orange-200">
                            View Sessions
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Notification Preferences</h3>
                      <p className="text-gray-600">Choose how you want to receive updates</p>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-blue-50 p-6 rounded-3xl border border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <Mail className="w-6 h-6 text-blue-600" />
                            <h4 className="font-bold text-gray-900">Email Notifications</h4>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <p className="text-sm text-gray-600">Receive booking confirmations and updates via email</p>
                      </div>

                      <div className="bg-green-50 p-6 rounded-3xl border border-green-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <Smartphone className="w-6 h-6 text-green-600" />
                            <h4 className="font-bold text-gray-900">SMS Notifications</h4>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                          </label>
                        </div>
                        <p className="text-sm text-gray-600">Get text messages for urgent updates</p>
                      </div>

                      <div className="bg-purple-50 p-6 rounded-3xl border border-purple-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <Bell className="w-6 h-6 text-purple-600" />
                            <h4 className="font-bold text-gray-900">Push Notifications</h4>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                        <p className="text-sm text-gray-600">Receive instant notifications on your device</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Billing Tab */}
                {activeTab === 'billing' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Billing & Payments</h3>
                      <p className="text-gray-600">Manage your payment methods and billing history</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-3xl border border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                              <CreditCard className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">Payment Methods</h4>
                              <p className="text-sm text-gray-600">2 cards on file</p>
                            </div>
                          </div>
                          <button className="text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-2xl font-medium transition-colors">
                            Manage
                          </button>
                        </div>
                        <div className="space-y-3">
                          <div className="bg-white p-4 rounded-2xl border border-blue-100">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">•••• •••• •••• 4532</span>
                              <span className="text-sm text-gray-600">Visa</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-3xl border border-green-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                              <Activity className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">Spending This Month</h4>
                              <p className="text-sm text-gray-600">3 services booked</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">₦45,600</div>
                        <p className="text-sm text-green-600 font-medium">12% less than last month</p>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h4 className="font-bold text-gray-900">Recent Transactions</h4>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {[
                          { service: 'House Cleaning', provider: 'Alex Thompson', amount: '₦15,000', date: 'Oct 15, 2024', status: 'Completed' },
                          { service: 'Plumbing Repair', provider: 'Mike Chen', amount: '₦12,500', date: 'Oct 12, 2024', status: 'Completed' },
                          { service: 'Garden Maintenance', provider: 'Emma Wilson', amount: '₦18,100', date: 'Oct 8, 2024', status: 'Completed' }
                        ].map((transaction, index) => (
                          <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-semibold text-gray-900">{transaction.service}</h5>
                                <p className="text-sm text-gray-600">{transaction.provider} • {transaction.date}</p>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-gray-900">{transaction.amount}</div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {transaction.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Actions Section */}
                {activeTab === 'profile' && (
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Account Actions</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <button className="group flex items-center space-x-4 w-full text-left p-6 border-2 border-gray-200 rounded-3xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <LogOut className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 group-hover:text-purple-700">Sign Out</h4>
                          <p className="text-sm text-gray-600">Sign out of your account on this device</p>
                        </div>
                      </button>

                      <button className="group flex items-center space-x-4 w-full text-left p-6 border-2 border-red-200 rounded-3xl hover:border-red-300 hover:bg-red-50 transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Trash2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-red-600">Delete Account</h4>
                          <p className="text-sm text-red-500">Permanently delete your account and all data</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Change Password Modal */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
                </div>
                <button
                  onClick={() => setShowChangePassword(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-2xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 transition-all duration-200"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 transition-all duration-200"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 transition-all duration-200"
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">Password Requirements:</p>
                      <ul className="text-xs space-y-1">
                        <li>• At least 8 characters long</li>
                        <li>• Include uppercase and lowercase letters</li>
                        <li>• At least one number and special character</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handlePasswordChange}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  Update Password
                </button>
                <button
                  onClick={() => setShowChangePassword(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;