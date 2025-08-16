import React, { useState } from "react";
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
  Menu,
  X,
} from "lucide-react";

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
  const [activeSection, setActiveSection] = useState("general");
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    newJobs: true,
    messages: true,
    payments: true,
  });

  const settingSections: SettingSection[] = [
    {
      id: "general",
      label: "General",
      icon: SettingsIcon,
      color: "from-blue-500 to-indigo-600",
      bgColor: "from-blue-50 to-indigo-50",
      description: "App preferences & display",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      color: "from-purple-500 to-pink-600",
      bgColor: "from-purple-50 to-pink-50",
      description: "Alerts & communications",
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
      color: "from-emerald-500 to-green-600",
      bgColor: "from-emerald-50 to-green-50",
      description: "Password & authentication",
    },
    {
      id: "payment",
      label: "Payment",
      icon: CreditCard,
      color: "from-yellow-500 to-orange-600",
      bgColor: "from-yellow-50 to-orange-50",
      description: "Billing & payouts",
    },
    {
      id: "account",
      label: "Account",
      icon: User,
      color: "from-rose-500 to-pink-600",
      bgColor: "from-rose-50 to-pink-50",
      description: "Personal information",
    },
  ];

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getCurrentSection = (): SettingSection | undefined => {
    return settingSections.find((section) => section.id === activeSection);
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setSidebarOpen(false); // Close sidebar on mobile when section is selected
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        {/* Mobile-first Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <SettingsIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent leading-tight">
                    Settings
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-tight">
                    Manage your account preferences
                  </p>
                </div>
              </div>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>

            <button className="w-full lg:w-auto bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-3 lg:px-8 lg:py-4 rounded-xl lg:rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 lg:gap-3">
              <div className="w-4 h-4 lg:w-6 lg:h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Save className="w-3 h-3 lg:w-4 lg:h-4" />
              </div>
              <span className="text-sm lg:text-base">Save All Changes</span>
            </button>
          </div>
        </div>

        <div className="relative">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Enhanced Settings Navigation - Mobile Sidebar */}
            <div className={`
              fixed inset-y-0 left-0 z-50 w-80 max-w-[calc(100vw-2rem)] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-auto lg:z-auto
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              lg:col-span-1
            `}>
              <div className="h-full lg:h-auto bg-white/90 lg:bg-white/80 backdrop-blur-sm rounded-none lg:rounded-3xl shadow-xl lg:shadow-sm border-r border-gray-200 lg:border lg:border-gray-100 p-4 sm:p-6 overflow-y-auto">
                <div className="mb-4 lg:mb-6">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-1 lg:mb-2">
                    Settings Menu
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-600">
                    Choose what to configure
                  </p>
                </div>
                <nav className="space-y-2 lg:space-y-3">
                  {settingSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionChange(section.id)}
                      className={`group w-full p-3 lg:p-4 rounded-xl lg:rounded-2xl transition-all duration-200 text-left ${
                        activeSection === section.id
                          ? `bg-gradient-to-r ${section.bgColor} border border-white/50 shadow-sm scale-[1.02] lg:scale-105`
                          : "bg-white/50 hover:bg-white/80 hover:scale-[1.01] lg:hover:scale-102 border border-transparent hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div
                          className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${
                            section.color
                          } rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg ${
                            activeSection === section.id
                              ? "scale-105 lg:scale-110"
                              : "group-hover:scale-105"
                          } transition-transform flex-shrink-0`}
                        >
                          <section.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-sm lg:text-base leading-tight">
                            {section.label}
                          </h4>
                          <p className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors leading-tight">
                            {section.description}
                          </p>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 lg:w-5 lg:h-5 text-gray-400 transition-all flex-shrink-0 ${
                            activeSection === section.id
                              ? "rotate-90 text-blue-600"
                              : "group-hover:text-gray-600"
                          }`}
                        />
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Enhanced Settings Content */}
            <div className="lg:col-span-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Section Header */}
                <div
                  className={`h-24 sm:h-28 lg:h-32 bg-gradient-to-r ${
                    getCurrentSection()?.color || "from-blue-500 to-indigo-600"
                  } relative`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 lg:left-8 flex items-center gap-3 lg:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0">
                      {React.createElement(
                        getCurrentSection()?.icon || SettingsIcon,
                        { className: "w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" }
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight">
                        {getCurrentSection()?.label}
                      </h2>
                      <p className="text-white/80 text-sm sm:text-base leading-tight">
                        {getCurrentSection()?.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6 lg:p-8">
                  {activeSection === "general" && (
                    <div className="space-y-6 lg:space-y-8">
                      {/* Theme Toggle */}
                      {/* <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-blue-200">
                        <div className="flex items-center justify-between gap-3 sm:gap-4">
                          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                            <div
                              className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${
                                darkMode
                                  ? "from-indigo-600 to-purple-700"
                                  : "from-yellow-400 to-orange-500"
                              } rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transition-all flex-shrink-0`}
                            >
                              {darkMode ? (
                                <Moon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                              ) : (
                                <Sun className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 leading-tight">
                                Appearance
                              </h3>
                              <p className="text-sm sm:text-base text-gray-600 leading-tight">
                                Switch between light and dark themes
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`relative w-12 h-6 sm:w-14 sm:h-7 lg:w-16 lg:h-8 rounded-full transition-all duration-300 shadow-inner flex-shrink-0 ${
                              darkMode
                                ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                                : "bg-gradient-to-r from-gray-300 to-gray-400"
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 left-0.5 sm:top-1 sm:left-1 w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${
                                darkMode
                                  ? "transform translate-x-6 sm:translate-x-7 lg:translate-x-8"
                                  : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div> */}

                      {/* Language & Region */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-emerald-200">
                          <div className="flex items-center gap-3 mb-3 sm:mb-4">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                              Language
                            </h3>
                          </div>
                          <select className="w-full p-3 sm:p-3 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm sm:text-base">
                            <option>🇺🇸 English (US)</option>
                            <option>🇪🇸 Spanish</option>
                            <option>🇫🇷 French</option>
                            <option>🇩🇪 German</option>
                          </select>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-purple-200">
                          <div className="flex items-center gap-3 mb-3 sm:mb-4">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                              Time Zone
                            </h3>
                          </div>
                          <select className="w-full p-3 sm:p-3 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-sm sm:text-base">
                            <option>🕐 Pacific Time (PT)</option>
                            <option>🕑 Mountain Time (MT)</option>
                            <option>🕒 Central Time (CT)</option>
                            <option>🕓 Eastern Time (ET)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === "notifications" && (
                    <div className="space-y-6 lg:space-y-8">
                      {/* Delivery Methods */}
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-purple-200">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                              Delivery Methods
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 leading-tight">
                              How you want to receive notifications
                            </p>
                          </div>
                        </div>
                        <div className="grid gap-3 sm:gap-4">
                          {(
                            [
                              {
                                key: "email",
                                label: "Email Notifications",
                                icon: Mail,
                                color: "from-blue-500 to-indigo-600",
                              },
                              {
                                key: "push",
                                label: "Push Notifications",
                                icon: Smartphone,
                                color: "from-emerald-500 to-green-600",
                              },
                              {
                                key: "sms",
                                label: "SMS Notifications",
                                icon: Smartphone,
                                color: "from-orange-500 to-red-600",
                              },
                            ] as NotificationMethod[]
                          ).map((method) => (
                            <div
                              key={method.key}
                              className="group bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/50 hover:shadow-lg transition-all"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                  <div
                                    className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${method.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}
                                  >
                                    <method.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-gray-900 text-sm sm:text-base leading-tight">
                                      {method.label}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-gray-500 leading-tight">
                                      Receive updates via{" "}
                                      {method.label.toLowerCase()}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    handleNotificationChange(method.key)
                                  }
                                  className={`relative w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-all duration-300 shadow-lg flex-shrink-0 ${
                                    notifications[method.key]
                                      ? `bg-gradient-to-r ${method.color}`
                                      : "bg-gradient-to-r from-gray-300 to-gray-400"
                                  }`}
                                >
                                  <div
                                    className={`absolute top-0.5 left-0.5 sm:top-1 sm:left-1 w-5 h-5 sm:w-5 sm:h-5 bg-white rounded-full shadow-lg transition-transform duration-300 flex items-center justify-center ${
                                      notifications[method.key]
                                        ? "transform translate-x-6 sm:translate-x-7"
                                        : ""
                                    }`}
                                  >
                                    {notifications[method.key] && (
                                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" />
                                    )}
                                  </div>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Notification Types */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-blue-200">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                              Notification Types
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 leading-tight">
                              What you want to be notified about
                            </p>
                          </div>
                        </div>
                        <div className="grid gap-3 sm:gap-4">
                          {(
                            [
                              {
                                key: "newJobs",
                                label: "New Job Opportunities",
                                description:
                                  "Get notified when new jobs match your skills",
                                icon: Star,
                                color: "from-yellow-500 to-orange-600",
                              },
                              {
                                key: "messages",
                                label: "New Messages",
                                description:
                                  "Receive alerts for new client messages",
                                icon: Mail,
                                color: "from-green-500 to-emerald-600",
                              },
                              {
                                key: "payments",
                                label: "Payment Updates",
                                description:
                                  "Get notified about payment confirmations and issues",
                                icon: CreditCard,
                                color: "from-purple-500 to-pink-600",
                              },
                            ] as NotificationType[]
                          ).map((type) => (
                            <div
                              key={type.key}
                              className="group bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/50 hover:shadow-lg transition-all"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                  <div
                                    className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${type.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}
                                  >
                                    <type.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-gray-900 text-sm sm:text-base leading-tight">
                                      {type.label}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-gray-500 leading-tight">
                                      {type.description}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    handleNotificationChange(type.key)
                                  }
                                  className={`relative w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-all duration-300 shadow-lg flex-shrink-0 ${
                                    notifications[type.key]
                                      ? `bg-gradient-to-r ${type.color}`
                                      : "bg-gradient-to-r from-gray-300 to-gray-400"
                                  }`}
                                >
                                  <div
                                    className={`absolute top-0.5 left-0.5 sm:top-1 sm:left-1 w-5 h-5 sm:w-5 sm:h-5 bg-white rounded-full shadow-lg transition-transform duration-300 flex items-center justify-center ${
                                      notifications[type.key]
                                        ? "transform translate-x-6 sm:translate-x-7"
                                        : ""
                                    }`}
                                  >
                                    {notifications[type.key] && (
                                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" />
                                    )}
                                  </div>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === "security" && (
                    <div className="space-y-6 lg:space-y-8">
                      {/* Security Status */}
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-emerald-200">
                        <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                            <Shield className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 leading-tight">
                              Account Security
                              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              </div>
                            </h3>
                            <p className="text-sm sm:text-base text-emerald-700 leading-tight">
                              Your account is secured with two-factor authentication
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Password Change */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-blue-200">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                              Change Password
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 leading-tight">
                              Update your account password
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Current Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                className="w-full p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium pr-12 text-sm sm:text-base"
                                placeholder="Enter current password"
                              />
                              <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                                ) : (
                                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-2">
                                New Password
                              </label>
                              <input
                                type="password"
                                className="w-full p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm sm:text-base"
                                placeholder="Enter new password"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-2">
                                Confirm New Password
                              </label>
                              <input
                                type="password"
                                className="w-full p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm sm:text-base"
                                placeholder="Confirm new password"
                              />
                            </div>
                          </div>

                          <button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-3 rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 font-semibold text-sm sm:text-base">
                            <Lock className="w-4 h-4" />
                            <span>Update Password</span>
                          </button>
                        </div>
                      </div>

                      {/* Two-Factor Authentication */}
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-purple-200">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Key className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                              Two-Factor Authentication
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 leading-tight">
                              Add an extra layer of security
                            </p>
                          </div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/50">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                                <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-gray-900 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm sm:text-base leading-tight">
                                  SMS Authentication
                                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                                  </div>
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-600 leading-tight">
                                  Enabled for +1 (555) 123-4567
                                </p>
                              </div>
                            </div>
                            <button className="w-full sm:w-auto bg-gradient-to-r from-gray-600 to-gray-700 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 font-medium text-sm">
                              Manage
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === "payment" && (
                    <div className="space-y-6 lg:space-y-8">
                      {/* Payment Methods */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-blue-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 mb-4 sm:mb-6">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                                Payment Methods
                              </h3>
                              <p className="text-sm sm:text-base text-gray-600 leading-tight">
                                Manage your payment options
                              </p>
                            </div>
                          </div>
                          <button className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 font-medium text-sm">
                            <Plus className="w-4 h-4" />
                            <span>Add Method</span>
                          </button>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/50">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                              <div className="w-12 h-8 sm:w-16 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                                <span className="text-white font-bold text-xs">
                                  BANK
                                </span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-gray-900 text-sm sm:text-base leading-tight">
                                  Bank Account
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-600 leading-tight">
                                  ****1234 - Primary Account
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 self-end sm:self-center">
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-emerald-200">
                          <div className="flex items-center gap-3 mb-3 sm:mb-4">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                              Payout Schedule
                            </h3>
                          </div>
                          <select className="w-full p-3 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm sm:text-base">
                            <option>📅 Weekly (Fridays)</option>
                            <option>📆 Bi-weekly</option>
                            <option>🗓️ Monthly</option>
                          </select>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-purple-200">
                          <div className="flex items-center gap-3 mb-3 sm:mb-4">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                              Currency
                            </h3>
                          </div>
                          <select className="w-full p-3 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-sm sm:text-base">
                            <option>💵 USD - US Dollar</option>
                            <option>💶 EUR - Euro</option>
                            <option>💷 GBP - British Pound</option>
                          </select>
                        </div>
                      </div>

                      {/* Tax Information */}
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-yellow-200">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                            <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                              Tax Information
                            </h3>
                            <p className="text-sm sm:text-base text-yellow-800 leading-tight">
                              Please update your tax information to continue receiving payments
                            </p>
                          </div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/50">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-gray-900 text-sm sm:text-base leading-tight">
                                Tax Forms Required
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-600 leading-tight">
                                W-9 form needs to be submitted
                              </p>
                            </div>
                            <button className="w-full sm:w-auto bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-4 sm:px-6 py-3 rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 font-semibold text-sm">
                              Update Tax Info
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === "account" && (
                    <div className="space-y-6 lg:space-y-8">
                      {/* Profile Information */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-blue-200">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                              Profile Information
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 leading-tight">
                              Update your personal details
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              defaultValue="Alex Rodriguez"
                              className="w-full p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm sm:text-base"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Email Address
                            </label>
                            <input
                              type="email"
                              defaultValue="alex.rodriguez@email.com"
                              className="w-full p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm sm:text-base"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              defaultValue="+1 (555) 123-4567"
                              className="w-full p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm sm:text-base"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Location
                            </label>
                            <input
                              type="text"
                              defaultValue="San Francisco, CA"
                              className="w-full p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm sm:text-base"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Account Statistics */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-emerald-200 text-center">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-3 sm:mb-4">
                            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                            247
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600 font-medium leading-tight">
                            Jobs Completed
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-purple-200 text-center">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-3 sm:mb-4">
                            <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                            4.9
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600 font-medium leading-tight">
                            Average Rating
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-yellow-200 text-center sm:col-span-1 col-span-1">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-3 sm:mb-4">
                            <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">5</h3>
                          <p className="text-sm sm:text-base text-gray-600 font-medium leading-tight">
                            Years Experience
                          </p>
                        </div>
                      </div>

                      {/* Danger Zone */}
                      <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-red-200">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-red-700 leading-tight">
                              Danger Zone
                            </h3>
                            <p className="text-sm sm:text-base text-red-600 leading-tight">
                              Irreversible account actions
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <button className="p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-red-200 text-red-600 rounded-lg sm:rounded-xl hover:bg-red-50 hover:shadow-lg transition-all font-bold text-sm sm:text-base">
                            Deactivate Account
                          </button>
                          <button className="p-3 sm:p-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 font-bold text-sm sm:text-base">
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
    </div>
  );
};

export default Settings;