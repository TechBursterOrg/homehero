import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  CreditCard, 
  User, 
  Moon, 
  Sun,
  Globe,
  Smartphone,
  Mail,
  Lock,
  Key,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  Check,
  Plus,
  Edit3,
  Trash2,
  ChevronRight,
  Sparkles,
  Zap,
  Star,
  Activity,
  LucideIcon,
  LucideProps
} from 'lucide-react';

// Define types for our data structures
type NotificationSettings = {
  email: boolean;
  push: boolean;
  sms: boolean;
  newJobs: boolean;
  messages: boolean;
  payments: boolean;
};

type SettingSection = {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description: string;
};

type NotificationMethod = {
  key: keyof NotificationSettings;
  label: string;
  icon: LucideIcon;
  color: string;
};

type NotificationType = {
  key: keyof NotificationSettings;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
};

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    newJobs: true,
    messages: true,
    payments: true
  });

  const settingSections: SettingSection[] = [
    { 
      id: 'general', 
      label: 'General', 
      icon: SettingsIcon,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50',
      description: 'App preferences & display'
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: Bell,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-50 to-pink-50',
      description: 'Alerts & communications'
    },
    { 
      id: 'security', 
      label: 'Security', 
      icon: Shield,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'from-emerald-50 to-green-50',
      description: 'Password & authentication'
    },
    { 
      id: 'payment', 
      label: 'Payment', 
      icon: CreditCard,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'from-yellow-50 to-orange-50',
      description: 'Billing & payouts'
    },
    { 
      id: 'account', 
      label: 'Account', 
      icon: User,
      color: 'from-rose-500 to-pink-600',
      bgColor: 'from-rose-50 to-pink-50',
      description: 'Personal information'
    }
  ];

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getCurrentSection = (): SettingSection | undefined => {
    return settingSections.find(section => section.id === activeSection);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg">
                  <SettingsIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Settings
                  </h1>
                  <p className="text-gray-600 text-lg">Manage your account preferences and settings</p>
                </div>
              </div>
            </div>
            
            <button className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg shadow-emerald-200 flex items-center gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                <Save className="w-4 h-4" />
              </div>
              <span>Save All Changes</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Enhanced Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Settings Menu</h3>
                <p className="text-sm text-gray-600">Choose what to configure</p>
              </div>
              <nav className="space-y-3">
                {settingSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`group w-full p-4 rounded-2xl transition-all duration-200 text-left ${
                      activeSection === section.id
                        ? `bg-gradient-to-r ${section.bgColor} border border-white/50 shadow-sm scale-105`
                        : 'bg-white/50 hover:bg-white/80 hover:scale-102 border border-transparent hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-2xl flex items-center justify-center shadow-lg ${activeSection === section.id ? 'scale-110' : 'group-hover:scale-105'} transition-transform`}>
                        <section.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {section.label}
                        </h4>
                        <p className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                          {section.description}
                        </p>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-gray-400 transition-all ${activeSection === section.id ? 'rotate-90 text-blue-600' : 'group-hover:text-gray-600'}`} />
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Enhanced Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* Section Header */}
              <div className={`h-32 bg-gradient-to-r ${getCurrentSection()?.color || 'from-blue-500 to-indigo-600'} relative`}>
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                <div className="absolute bottom-6 left-8 flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    {React.createElement(getCurrentSection()?.icon || SettingsIcon, { className: "w-8 h-8 text-white" })}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{getCurrentSection()?.label}</h2>
                    <p className="text-white/80">{getCurrentSection()?.description}</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {activeSection === 'general' && (
                  <div className="space-y-8">
                    
                    {/* Theme Toggle */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 bg-gradient-to-br ${darkMode ? 'from-indigo-600 to-purple-700' : 'from-yellow-400 to-orange-500'} rounded-2xl flex items-center justify-center shadow-lg transition-all`}>
                            {darkMode ? <Moon className="w-7 h-7 text-white" /> : <Sun className="w-7 h-7 text-white" />}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">Appearance</h3>
                            <p className="text-gray-600">Switch between light and dark themes</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setDarkMode(!darkMode)}
                          className={`relative w-16 h-8 rounded-full transition-all duration-300 shadow-inner ${
                            darkMode ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-gradient-to-r from-gray-300 to-gray-400'
                          }`}
                        >
                          <div
                            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${
                              darkMode ? 'transform translate-x-8' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Language & Region */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center">
                            <Globe className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">Language</h3>
                        </div>
                        <select className="w-full p-3 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium">
                          <option>🇺🇸 English (US)</option>
                          <option>🇪🇸 Spanish</option>
                          <option>🇫🇷 French</option>
                          <option>🇩🇪 German</option>
                        </select>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                            <Activity className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">Time Zone</h3>
                        </div>
                        <select className="w-full p-3 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium">
                          <option>🕐 Pacific Time (PT)</option>
                          <option>🕑 Mountain Time (MT)</option>
                          <option>🕒 Central Time (CT)</option>
                          <option>🕓 Eastern Time (ET)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'notifications' && (
                  <div className="space-y-8">
                    
                    {/* Delivery Methods */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Delivery Methods</h3>
                          <p className="text-gray-600">How you want to receive notifications</p>
                        </div>
                      </div>
                      <div className="grid gap-4">
                        {([
                          { key: 'email', label: 'Email Notifications', icon: Mail, color: 'from-blue-500 to-indigo-600' },
                          { key: 'push', label: 'Push Notifications', icon: Smartphone, color: 'from-emerald-500 to-green-600' },
                          { key: 'sms', label: 'SMS Notifications', icon: Smartphone, color: 'from-orange-500 to-red-600' }
                        ] as NotificationMethod[]).map((method) => (
                          <div key={method.key} className="group bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/50 hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                  <method.icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900">{method.label}</h4>
                                  <p className="text-sm text-gray-500">Receive updates via {method.label.toLowerCase()}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleNotificationChange(method.key)}
                                className={`relative w-14 h-7 rounded-full transition-all duration-300 shadow-lg ${
                                  notifications[method.key] 
                                    ? `bg-gradient-to-r ${method.color}` 
                                    : 'bg-gradient-to-r from-gray-300 to-gray-400'
                                }`}
                              >
                                <div
                                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 flex items-center justify-center ${
                                    notifications[method.key] ? 'transform translate-x-7' : ''
                                  }`}
                                >
                                  {notifications[method.key] && <Check className="w-3 h-3 text-green-600" />}
                                </div>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notification Types */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                          <Bell className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Notification Types</h3>
                          <p className="text-gray-600">What you want to be notified about</p>
                        </div>
                      </div>
                      <div className="grid gap-4">
                        {([
                          { 
                            key: 'newJobs', 
                            label: 'New Job Opportunities', 
                            description: 'Get notified when new jobs match your skills',
                            icon: Star,
                            color: 'from-yellow-500 to-orange-600'
                          },
                          { 
                            key: 'messages', 
                            label: 'New Messages', 
                            description: 'Receive alerts for new client messages',
                            icon: Mail,
                            color: 'from-green-500 to-emerald-600'
                          },
                          { 
                            key: 'payments', 
                            label: 'Payment Updates', 
                            description: 'Get notified about payment confirmations and issues',
                            icon: CreditCard,
                            color: 'from-purple-500 to-pink-600'
                          }
                        ] as NotificationType[]).map((type) => (
                          <div key={type.key} className="group bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/50 hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 bg-gradient-to-br ${type.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                  <type.icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900">{type.label}</h4>
                                  <p className="text-sm text-gray-500">{type.description}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleNotificationChange(type.key)}
                                className={`relative w-14 h-7 rounded-full transition-all duration-300 shadow-lg ${
                                  notifications[type.key] 
                                    ? `bg-gradient-to-r ${type.color}` 
                                    : 'bg-gradient-to-r from-gray-300 to-gray-400'
                                }`}
                              >
                                <div
                                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 flex items-center justify-center ${
                                    notifications[type.key] ? 'transform translate-x-7' : ''
                                  }`}
                                >
                                  {notifications[type.key] && <Check className="w-3 h-3 text-green-600" />}
                                </div>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'security' && (
                  <div className="space-y-8">
                    
                    {/* Security Status */}
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-200">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Shield className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            Account Security
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          </h3>
                          <p className="text-emerald-700">Your account is secured with two-factor authentication</p>
                        </div>
                      </div>
                    </div>

                    {/* Password Change */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                          <Lock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
                          <p className="text-gray-600">Update your account password</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              className="w-full p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium pr-12"
                              placeholder="Enter current password"
                            />
                            <button
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                            <input
                              type="password"
                              className="w-full p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                              placeholder="Enter new password"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                            <input
                              type="password"
                              className="w-full p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>

                        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2 font-semibold">
                          <Lock className="w-4 h-4" />
                          <span>Update Password</span>
                        </button>
                      </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                          <Key className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Two-Factor Authentication</h3>
                          <p className="text-gray-600">Add an extra layer of security</p>
                        </div>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <Smartphone className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                SMS Authentication
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              </h4>
                              <p className="text-sm text-gray-600">Enabled for +1 (555) 123-4567</p>
                            </div>
                          </div>
                          <button className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 font-medium">
                            Manage
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'payment' && (
                  <div className="space-y-8">
                    
                    {/* Payment Methods */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">Payment Methods</h3>
                            <p className="text-gray-600">Manage your payment options</p>
                          </div>
                        </div>
                        <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2 font-medium">
                          <Plus className="w-4 h-4" />
                          <span>Add Method</span>
                        </button>
                      </div>
                      
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-xs">BANK</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">Bank Account</h4>
                              <p className="text-sm text-gray-600">****1234 - Primary Account</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                              <Edit3 className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition-colors">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payout Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center">
                            <Activity className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">Payout Schedule</h3>
                        </div>
                        <select className="w-full p-3 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium">
                          <option>📅 Weekly (Fridays)</option>
                          <option>📆 Bi-weekly</option>
                          <option>🗓️ Monthly</option>
                        </select>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">Currency</h3>
                        </div>
                        <select className="w-full p-3 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium">
                          <option>💵 USD - US Dollar</option>
                          <option>💶 EUR - Euro</option>
                          <option>💷 GBP - British Pound</option>
                        </select>
                      </div>
                    </div>

                    {/* Tax Information */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <AlertCircle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Tax Information</h3>
                          <p className="text-yellow-800">Please update your tax information to continue receiving payments</p>
                        </div>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-gray-900">Tax Forms Required</h4>
                            <p className="text-sm text-gray-600">W-9 form needs to be submitted</p>
                          </div>
                          <button className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 font-semibold">
                            Update Tax Info
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'account' && (
                  <div className="space-y-8">
                    
                    {/* Profile Information */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
                          <p className="text-gray-600">Update your personal details</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                          <input
                            type="text"
                            defaultValue="Alex Rodriguez"
                            className="w-full p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                          <input
                            type="email"
                            defaultValue="alex.rodriguez@email.com"
                            className="w-full p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                          <input
                            type="tel"
                            defaultValue="+1 (555) 123-4567"
                            className="w-full p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                          <input
                            type="text"
                            defaultValue="San Francisco, CA"
                            className="w-full p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Account Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-200 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                          <Star className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">247</h3>
                        <p className="text-gray-600 font-medium">Jobs Completed</p>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                          <Activity className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">4.9</h3>
                        <p className="text-gray-600 font-medium">Average Rating</p>
                      </div>

                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                          <Zap className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">5</h3>
                        <p className="text-gray-600 font-medium">Years Experience</p>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-2xl border border-red-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center">
                          <AlertCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-red-700">Danger Zone</h3>
                          <p className="text-red-600">Irreversible account actions</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="p-4 bg-white/80 backdrop-blur-sm border border-red-200 text-red-600 rounded-xl hover:bg-red-50 hover:shadow-lg transition-all font-bold">
                          Deactivate Account
                        </button>
                        <button className="p-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 font-bold">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;