import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  CheckCircle, 
  Star, 
  Users, 
  TrendingUp, 
  Plus,
  Clock,
  Calendar,
  MapPin,
  X,
  Save,
  Award,
  Target,
  Activity,
  ChevronRight,
  Sparkles,
  PoundSterling,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface AvailabilitySlot {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  serviceType: string;
  notes: string;
  status: string;
}

interface NewSlotData {
  date: string;
  startTime: string;
  endTime: string;
  serviceType: string;
  notes: string;
}

interface DashboardData {
  user: {
    name: string;
    email: string;
    id: string;
    country: string;
  };
  availabilitySlots: AvailabilitySlot[];
  recentJobs: any[];
  upcomingTasks: any[];
  stats: {
    totalEarnings: number;
    jobsCompleted: number;
    averageRating: number;
    activeClients: number;
  };
}

interface DashboardProps {
  userCountry?: 'UK' | 'USA' | 'CANADA' | 'NIGERIA';
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const Dashboard: React.FC<DashboardProps> = ({ userCountry = 'USA' }) => {
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [newSlot, setNewSlot] = useState<NewSlotData>({
    date: '',
    startTime: '',
    endTime: '',
    serviceType: '',
    notes: ''
  });
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data from backend
  useEffect(() => {
   // In your fetchDashboardData function
// In your Dashboard component, replace the fetch call:
const fetchDashboardData = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    // Use API_BASE_URL here instead of hardcoded URL
    const response = await fetch(`${API_BASE_URL}/api/user/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status, response.statusText);
    
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
    
    setDashboardData(data);
    setAvailabilitySlots(data.availabilitySlots || []);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    setError(errorMessage);
    console.error('Dashboard fetch error:', err);
    
    if (errorMessage.includes('session') || errorMessage.includes('Authentication') || errorMessage.includes('token')) {
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock data for development');
      setDashboardData(getMockData());
    }
  } finally {
    setLoading(false);
  }
};



    fetchDashboardData();
  }, []);

  // Mock data for development/testing
  const getMockData = (): DashboardData => ({
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      id: '1',
      country: userCountry
    },
    availabilitySlots: [],
    recentJobs: [
      {
        id: 1,
        title: 'House Cleaning',
        client: 'Sarah Johnson',
        category: 'cleaning',
        payment: 150,
        status: 'completed',
        location: 'Downtown',
        date: 'Aug 25',
        time: '2:00 PM'
      },
      {
        id: 2,
        title: 'Garden Maintenance',
        client: 'Mike Wilson',
        category: 'gardening',
        payment: 200,
        status: 'upcoming',
        location: 'Suburbs',
        date: 'Aug 28',
        time: '10:00 AM'
      }
    ],
    upcomingTasks: [
      {
        id: 1,
        title: 'Plumbing Repair',
        client: 'Alice Brown',
        category: 'handyman',
        time: '9:00 AM',
        duration: '2 hours',
        priority: 'high'
      }
    ],
    stats: {
      totalEarnings: 2500,
      jobsCompleted: 45,
      averageRating: 4.8,
      activeClients: 12
    }
  });

  // Currency configuration based on country
  const getCurrencyConfig = (country: string) => {
    switch (country) {
      case 'UK':
        return {
          symbol: '£',
          icon: PoundSterling,
          name: 'GBP'
        };
      case 'NIGERIA':
        return {
          symbol: '₦',
          icon: () => <span className="text-base font-bold">₦</span>,
          name: 'NGN'
        };
      case 'CANADA':
        return {
          symbol: 'C$',
          icon: DollarSign,
          name: 'CAD'
        };
      case 'USA':
      default:
        return {
          symbol: '$',
          icon: DollarSign,
          name: 'USD'
        };
    }
  };

  const currencyConfig = getCurrencyConfig(userCountry);
  const CurrencyIcon = currencyConfig.icon;

  // Update earnings based on country
  const getLocalizedEarnings = (amount: number) => {
    const multipliers = {
      'UK': { multiplier: 0.79, symbol: '£' },
      'NIGERIA': { multiplier: 1650, symbol: '₦' },
      'CANADA': { multiplier: 1.35, symbol: 'C$' },
      'USA': { multiplier: 1, symbol: '$' }
    };

    const config = multipliers[userCountry] || multipliers['USA'];
    return {
      amount: Math.round(amount * config.multiplier).toLocaleString(),
      symbol: config.symbol
    };
  };

  const serviceTypes = [
    'House Cleaning',
    'Plumbing Repair',
    'Garden Maintenance',
    'Electrical Work',
    'Painting',
    'General Maintenance',
    'Other'
  ];

  const handleAddAvailability = () => {
    setShowAvailabilityModal(true);
  };

  const handleSaveAvailability = async (): Promise<void> => {
  if (newSlot.date && newSlot.startTime && newSlot.endTime && newSlot.serviceType) {
    try {
      const token = localStorage.getItem('authToken');
      // Use API_BASE_URL here too
      const response = await fetch(`${API_BASE_URL}/api/availability`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSlot),
      });

      if (!response.ok) {
        throw new Error('Failed to save availability');
      }

      const result = await response.json();
      setAvailabilitySlots([...availabilitySlots, result.data.slot]);
      setNewSlot({
        date: '',
        startTime: '',
        endTime: '',
        serviceType: '',
        notes: ''
      });
      setShowAvailabilityModal(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save availability';
      setError(errorMessage);
    }
  }
};

  const handleCloseModal = () => {
    setShowAvailabilityModal(false);
    setNewSlot({
      date: '',
      startTime: '',
      endTime: '',
      serviceType: '',
      notes: ''
    });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string): string => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'upcoming': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in-progress': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400 bg-red-50';
      case 'medium': return 'border-amber-400 bg-amber-50';
      case 'low': return 'border-green-400 bg-green-50';
      default: return 'border-blue-400 bg-blue-50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cleaning': return '🧽';
      case 'handyman': return '🔧';
      case 'gardening': return '🌿';
      case 'petcare': return '🐾';
      case 'childcare': return '👶';
      default: return '💼';
    }
  };

  const getClientInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getCountryFlag = (country: string) => {
    switch (country) {
      case 'UK': return '🇬🇧';
      case 'USA': return '🇺🇸';
      case 'CANADA': return '🇨🇦';
      case 'NIGERIA': return '🇳🇬';
      default: return '🇺🇸';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

  const localizedEarnings = getLocalizedEarnings(dashboardData.stats.totalEarnings);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-white font-bold text-sm sm:text-lg md:text-xl">
                    {getClientInitials(dashboardData.user.name)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent leading-tight">
                    <span className="block sm:inline">Welcome back, {dashboardData.user.name.split(' ')[0]}!</span> 
                    <span className="inline sm:inline">👋</span>
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
                      <span className="hidden xs:inline">Ready to make today productive? Here's your overview.</span>
                      <span className="xs:hidden">Here's your overview for today.</span>
                    </p>
                    <div className="flex items-center gap-1 px-2 py-1 bg-white/80 rounded-lg border">
                      <span className="text-sm">{getCountryFlag(userCountry)}</span>
                      <span className="text-xs font-medium text-gray-600">{currencyConfig.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleAddAvailability}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-3 w-full sm:w-auto"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-lg flex items-center justify-center">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <span>Add Availability</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="group bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                {currencyConfig.symbol === '₦' ? (
                  <span className="text-white font-bold text-lg sm:text-xl">₦</span>
                ) : (
                  <CurrencyIcon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                )}
              </div>
              <div className="text-emerald-600">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-900">{localizedEarnings.symbol}{localizedEarnings.amount}</p>
              <div className="flex items-center gap-1 text-xs sm:text-sm">
                <span className="text-emerald-600 font-semibold">+12%</span>
                <span className="text-gray-500 hidden sm:inline">from last month</span>
                <span className="text-gray-500 sm:hidden">vs last</span>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="text-blue-600">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Jobs Completed</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-900">{dashboardData.stats.jobsCompleted}</p>
              <div className="flex items-center gap-1 text-xs sm:text-sm">
                <span className="text-blue-600 font-semibold">+8</span>
                <span className="text-gray-500 hidden sm:inline">this week</span>
                <span className="text-gray-500 sm:hidden">this week</span>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <Star className="w-5 h-5 sm:w-7 sm:h-7 text-white fill-current" />
              </div>
              <div className="text-amber-600">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-900">{dashboardData.stats.averageRating} ⭐</p>
              <div className="text-xs sm:text-sm text-gray-500">
                <span className="hidden sm:inline">Based on reviews</span>
                <span className="sm:hidden">reviews</span>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="text-purple-600">
                <Target className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-900">{dashboardData.stats.activeClients}</p>
              <div className="flex items-center gap-1 text-xs sm:text-sm">
                <span className="text-purple-600 font-semibold">+3</span>
                <span className="text-gray-500 hidden sm:inline">new this week</span>
                <span className="text-gray-500 sm:hidden">new</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Recent Jobs */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
            <div className="p-4 sm:p-8 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Jobs</h3>
                    <p className="text-gray-600 text-sm sm:text-base hidden sm:block">Your latest service activities</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors text-sm sm:text-base">
                  <span className="hidden sm:inline">View All</span>
                  <span className="sm:hidden">All</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-8">
              <div className="space-y-3 sm:space-y-4">
                {dashboardData.recentJobs.map((job) => {
                  const localizedPayment = getLocalizedEarnings(job.payment);
                  return (
                    <div key={job.id} className="group p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:shadow-lg border border-gray-100">
                      {/* Mobile Layout */}
                      <div className="flex flex-col sm:hidden space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-xs">
                                {getClientInitials(job.client)}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-base">{getCategoryIcon(job.category)}</span>
                                <h4 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                                  {job.title}
                                </h4>
                              </div>
                              <p className="text-sm text-gray-600 font-medium">{job.client}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">{localizedPayment.symbol}{localizedPayment.amount}</p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(job.status)}`}>
                              {job.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-[120px]">{job.location}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{job.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{job.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden sm:flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">
                              {getClientInitials(job.client)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-lg">{getCategoryIcon(job.category)}</span>
                              <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {job.title}
                              </h4>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(job.status)}`}>
                                {job.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="font-medium">{job.client}</span>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{job.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600 mb-1">{localizedPayment.symbol}{localizedPayment.amount}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{job.date}</span>
                            <Clock className="w-4 h-4" />
                            <span>{job.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Today's Schedule */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Today's Schedule</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">{new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {dashboardData.upcomingTasks.map((task) => (
                    <div key={task.id} className={`relative p-3 sm:p-4 rounded-xl sm:rounded-2xl border-l-4 ${getPriorityColor(task.priority)} transition-all duration-200 hover:shadow-md`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base sm:text-lg">{getCategoryIcon(task.category)}</span>
                        <h4 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight">{task.title}</h4>
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm mb-3">{task.client}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-blue-600">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{task.time}</span>
                        </div>
                        <span className="text-xs bg-white/80 text-gray-600 px-2 py-1 rounded-lg">
                          {task.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                  {dashboardData.upcomingTasks.length === 0 && (
                    <div className="text-center py-6 sm:py-8 text-gray-500">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                      </div>
                      <p className="font-medium text-sm sm:text-base">No tasks scheduled</p>
                      <p className="text-xs sm:text-sm">Enjoy your free day!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Available Slots */}
            {availabilitySlots.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">Available Slots</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">Open for bookings</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    {availabilitySlots.map((slot) => (
                      <div key={slot.id} className="p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl sm:rounded-2xl border border-emerald-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                          <h4 className="font-bold text-gray-900 text-xs sm:text-sm">{slot.serviceType}</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{formatDate(slot.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-600 font-medium">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                          </div>
                          {slot.notes && (
                            <p className="text-xs sm:text-sm text-gray-500 mt-2 italic">{slot.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Availability Modal */}
        {showAvailabilityModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 sm:p-8 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Add Availability</h2>
                      <p className="text-gray-600 text-sm sm:text-base">Set your available time slots</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleCloseModal}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 sm:p-8 space-y-6">
                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newSlot.date}
                    onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      End Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Service Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newSlot.serviceType}
                    onChange={(e) => setNewSlot({ ...newSlot, serviceType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select a service...</option>
                    {serviceTypes.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={newSlot.notes}
                    onChange={(e) => setNewSlot({ ...newSlot, notes: e.target.value })}
                    placeholder="Any special requirements or notes..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 sm:p-8 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAvailability}
                  disabled={!newSlot.date || !newSlot.startTime || !newSlot.endTime || !newSlot.serviceType}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl sm:rounded-2xl hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-semibold hover:scale-105"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Availability</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;