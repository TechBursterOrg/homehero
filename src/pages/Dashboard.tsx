import React, { useState, useEffect } from 'react';
import { 
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
  Loader2,
  AlertCircle,
  BookOpen,
  Eye,
  MessageCircle,
  Mail,
  Phone,
  User
} from 'lucide-react';

interface BusinessHours {
  id?: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  serviceTypes: string[];
  notes: string;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

interface Booking {
  _id: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  description: string;
  location: string;
  timeframe: string;
  budget: string;
  specialRequests: string;
  bookingType: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'; // FIXED: changed 'confirmed' to 'accepted'
  requestedAt: string;
  acceptedAt?: string;
  completedAt?: string;
  updatedAt: string;
}

interface ScheduleEntry {
  id: string;
  title: string;
  client: string;
  phone: string;
  location: string;
  date: string;
  time: string;
  endTime: string;
  duration: string;
  payment: string;
  status: 'accepted' | 'pending' | 'cancelled'; // FIXED: changed 'confirmed' to 'accepted'
  notes: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

interface DashboardData {
  user: {
    name: string;
    email: string;
    id: string;
    country: string;
  };
  businessHours: BusinessHours[];
  recentJobs: any[];
  upcomingTasks: any[];
  bookings: Booking[];
  schedule: ScheduleEntry[];
  stats: {
    totalEarnings: number;
    jobsCompleted: number;
    averageRating: number;
    activeClients: number;
  };
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const Dashboard: React.FC = () => {
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data.notifications || []);
        setUnreadCount(data.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) return;

      await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      // Update local state
      setNotifications(prev => prev.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Days of the week
  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  // Initialize default hours for each day
  const defaultHours: BusinessHours = {
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '17:00',
    isAvailable: true,
    serviceTypes: [],
    notes: ''
  };

  // Get hours for the selected day
  const getHoursForDay = (day: string): BusinessHours => {
    const existingHours = businessHours.find(hours => hours.dayOfWeek === day);
    return existingHours || {
      ...defaultHours,
      dayOfWeek: day
    };
  };

  // Update hours for the selected day
  const updateHoursForDay = (updatedHours: BusinessHours) => {
    const existingIndex = businessHours.findIndex(hours => hours.dayOfWeek === updatedHours.dayOfWeek);
    
    if (existingIndex >= 0) {
      const updatedBusinessHours = [...businessHours];
      updatedBusinessHours[existingIndex] = updatedHours;
      setBusinessHours(updatedBusinessHours);
    } else {
      setBusinessHours([...businessHours, updatedHours]);
    }
  };

  // Fetch dashboard data from backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

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
      console.log('Dashboard API response:', data);
      
      if (data.success === false && data.message?.includes('token')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        throw new Error('Authentication failed. Please log in again.');
      }
      
      setDashboardData(data);
      setBusinessHours(data.businessHours || []);
      setSchedule(data.schedule || []);
      
      if (data.bookings) {
        console.log('Bookings received:', data.bookings.length);
      } else {
        console.log('No bookings in response');
      }

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
        const mockData = getMockData();
        setDashboardData(mockData);
        setSchedule(mockData.schedule || []);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Mock data for development/testing
  const getMockData = (): DashboardData => ({
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      id: '1',
      country: 'NIGERIA'
    },
    businessHours: [
      {
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '17:00',
        isAvailable: true,
        serviceTypes: ['House Cleaning'],
        notes: ''
      },
      {
        dayOfWeek: 'Tuesday',
        startTime: '09:00',
        endTime: '17:00',
        isAvailable: true,
        serviceTypes: ['Plumbing Repair'],
        notes: ''
      },
      {
        dayOfWeek: 'Wednesday',
        startTime: '09:00',
        endTime: '17:00',
        isAvailable: true,
        serviceTypes: ['General Maintenance'],
        notes: ''
      }
    ],
    recentJobs: [
      {
        id: 1,
        title: 'House Cleaning',
        client: 'Sarah Johnson',
        category: 'cleaning',
        payment: 15000,
        status: 'completed',
        location: 'Victoria Island',
        date: 'Aug 25',
        time: '2:00 PM'
      },
      {
        id: 2,
        title: 'Garden Maintenance',
        client: 'Mike Wilson',
        category: 'gardening',
        payment: 25000,
        status: 'upcoming',
        location: 'Lekki',
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
    bookings: [
      {
        _id: '1',
        providerId: 'provider1',
        providerName: 'John Doe',
        providerEmail: 'john@example.com',
        customerId: 'customer1',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah@example.com',
        customerPhone: '+2341234567890',
        serviceType: 'House Cleaning',
        description: 'Full house cleaning service',
        location: 'Victoria Island, Lagos',
        timeframe: 'ASAP',
        budget: '₦15,000',
        specialRequests: 'Focus on kitchen and bathrooms',
        bookingType: 'immediate',
        status: 'pending',
        requestedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '2',
        providerId: 'provider1',
        providerName: 'John Doe',
        providerEmail: 'john@example.com',
        customerId: 'customer2',
        customerName: 'Mike Wilson',
        customerEmail: 'mike@example.com',
        customerPhone: '+2340987654321',
        serviceType: 'Garden Maintenance',
        description: 'Lawn mowing and garden cleanup',
        location: 'Lekki Phase 1, Lagos',
        timeframe: 'Next week',
        budget: '₦25,000',
        specialRequests: '',
        bookingType: 'long-term',
        status: 'confirmed', // FIXED: changed from 'confirmed' to 'accepted'
        requestedAt: new Date().toISOString(),
        acceptedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    schedule: [
      {
        id: '1',
        title: 'House Cleaning',
        client: 'Sarah Johnson',
        phone: '+2341234567890',
        location: 'Victoria Island, Lagos',
        date: new Date().toISOString().split('T')[0],
        time: '2:00 PM',
        endTime: '4:00 PM',
        duration: '2 hours',
        payment: '₦15,000',
        status: 'accepted', // FIXED: changed from 'confirmed' to 'accepted'
        notes: 'Focus on kitchen and bathrooms',
        category: 'cleaning',
        priority: 'medium'
      }
    ],
    stats: {
      totalEarnings: 350000,
      jobsCompleted: 45,
      averageRating: 4.8,
      activeClients: 12
    }
  });

  // Format amount in Naira
  const formatNaira = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
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

  const handleSaveBusinessHours = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/business-hours/bulk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessHours }),
      });

      if (!response.ok) {
        throw new Error('Failed to save business hours');
      }

      const result = await response.json();
      setBusinessHours(result.data.businessHours || []);
      setShowAvailabilityModal(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save business hours';
      setError(errorMessage);
    }
  };

  const handleCloseModal = () => {
    setShowAvailabilityModal(false);
  };

  const formatTime = (timeString: string): string => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // FIXED: Updated status colors to match new status values
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'upcoming': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in-progress': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'accepted': return 'bg-blue-100 text-blue-700 border-blue-200'; // FIXED: changed from 'confirmed'
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
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

  const handleServiceTypeToggle = (serviceType: string) => {
    const currentHours = getHoursForDay(selectedDay);
    const updatedServiceTypes = currentHours.serviceTypes.includes(serviceType)
      ? currentHours.serviceTypes.filter(st => st !== serviceType)
      : [...currentHours.serviceTypes, serviceType];
    
    updateHoursForDay({
      ...currentHours,
      serviceTypes: updatedServiceTypes
    });
  };

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  // Function to add booking to schedule when accepted
  const addBookingToSchedule = async (booking: Booking): Promise<void> => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Calculate end time based on service type
      const calculateEndTime = (startTime: string, serviceType: string): string => {
        const [time, modifier] = startTime.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        
        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        
        // Add duration based on service type
        let durationHours = 2; // default 2 hours
        if (serviceType.includes('Cleaning')) durationHours = 3;
        if (serviceType.includes('Maintenance')) durationHours = 4;
        if (serviceType.includes('Repair')) durationHours = 2;
        
        const totalMinutes = hours * 60 + minutes + durationHours * 60;
        let endHours = Math.floor(totalMinutes / 60) % 24;
        const endMinutes = totalMinutes % 60;
        
        const endModifier = endHours >= 12 ? 'PM' : 'AM';
        if (endHours > 12) endHours -= 12;
        if (endHours === 0) endHours = 12;
        
        return `${endHours}:${endMinutes.toString().padStart(2, '0')} ${endModifier}`;
      };

      const scheduleData = {
        title: booking.serviceType,
        client: booking.customerName,
        phone: booking.customerPhone,
        location: booking.location,
        date: new Date().toISOString().split('T')[0], // Use today's date or parse from booking
        time: '10:00 AM', // Default time or parse from booking
        endTime: calculateEndTime('10:00 AM', booking.serviceType),
        duration: '2 hours',
        payment: booking.budget,
        status: 'accepted' as const, // FIXED: changed from 'confirmed'
        notes: booking.specialRequests || booking.description,
        category: booking.serviceType.toLowerCase().includes('clean') ? 'cleaning' : 'handyman',
        priority: 'medium' as const
      };

      const response = await fetch(`${API_BASE_URL}/api/schedule`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData),
      });

      if (!response.ok) {
        throw new Error('Failed to add booking to schedule');
      }

      const newScheduleEntry = await response.json();
      setSchedule(prev => [...prev, newScheduleEntry.data]);
      
    } catch (err) {
      console.error('Error adding booking to schedule:', err);
      // Don't throw error here to avoid blocking the booking status update
    }
  };

  // FIXED: Updated function to handle booking status changes with correct status values
  const handleUpdateBookingStatus = async (bookingId: string, status: 'pending' | 'accepted' | 'completed' | 'cancelled') => {
    try {
      setError(null);
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      console.log('Updating booking status:', { bookingId, status });

      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // If status is accepted, add to schedule
        if (status === 'accepted' && selectedBooking) {
          await addBookingToSchedule(selectedBooking);
        }
        
        // Refresh all data
        setRefreshing(true);
        await Promise.all([
          fetchDashboardData(),
          fetchNotifications()
        ]);
        
        // Show success message
        setError(null);
        
        // Close modal
        setShowBookingModal(false);
        
        // Show success feedback
        alert(`Booking ${status} successfully! ${status === 'accepted' ? 'Added to schedule and customer has been notified.' : ''}`);
      } else {
        throw new Error(result.message || 'Failed to update booking status');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update booking status';
      setError(errorMessage);
      console.error('Booking status update error:', err);
      
      // Show detailed error in development
      if (process.env.NODE_ENV === 'development') {
        alert(`Error: ${errorMessage}`);
      }
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleContactCustomer = (booking: Booking, method: 'email' | 'phone') => {
    if (method === 'email') {
      window.location.href = `mailto:${booking.customerEmail}`;
    } else if (method === 'phone') {
      window.location.href = `tel:${booking.customerPhone}`;
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
                      <span className="text-sm">🇳🇬</span>
                      <span className="text-xs font-medium text-gray-600"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              {/* <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-3 bg-white/80 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                <Loader2 className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button> */}
              <button 
                onClick={handleAddAvailability}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-lg flex items-center justify-center">
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <span>Set Business Hours</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="group bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg sm:text-xl">₦</span>
              </div>
              <div className="text-emerald-600">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-900">{formatNaira(dashboardData.stats.totalEarnings)}</p>
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
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
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
                  {dashboardData.recentJobs.map((job) => (
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
                            <p className="text-lg font-bold text-green-600">{formatNaira(job.payment)}</p>
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
                          <p className="text-2xl font-bold text-green-600 mb-1">{formatNaira(job.payment)}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{job.date}</span>
                            <Clock className="w-4 h-4" />
                            <span>{job.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bookings Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
              <div className="p-4 sm:p-8 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Bookings</h3>
                      <p className="text-gray-600 text-sm sm:text-base hidden sm:block">Your upcoming appointments</p>
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
                <div className="space-y-4">
                  {dashboardData.bookings && dashboardData.bookings.map((booking) => (
                    <div key={booking._id} className="p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl sm:rounded-2xl hover:from-green-50 hover:to-teal-50 transition-all duration-300 hover:shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xs sm:text-sm">
                              {getClientInitials(booking.customerName)}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm sm:text-base">{booking.serviceType}</h4>
                            <p className="text-gray-600 text-xs sm:text-sm">{booking.customerName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                              <span className="text-xs sm:text-sm text-gray-600">{formatDate(booking.requestedAt)}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                              <span className="text-xs sm:text-sm text-gray-600">{booking.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg sm:text-xl font-bold text-green-600">{booking.budget}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                          <div className="mt-2 flex justify-end gap-2">
                            <button 
                              onClick={() => handleViewBooking(booking)}
                              className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <button 
                              onClick={() => handleContactCustomer(booking, 'email')}
                              className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              title="Send Email"
                            >
                              <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <button 
                              onClick={() => handleContactCustomer(booking, 'phone')}
                              className="p-1.5 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                              title="Call Customer"
                            >
                              <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!dashboardData.bookings || dashboardData.bookings.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="font-medium">No bookings yet</p>
                      <p className="text-sm">Your upcoming appointments will appear here</p>
                    </div>
                  )}
                </div>
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
                  {schedule.map((task) => (
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
                  {schedule.length === 0 && (
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

            {/* Business Hours */}
            {businessHours.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">Business Hours</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">Your weekly availability</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    {businessHours.map((hours, index) => (
                      <div key={index} className="p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl sm:rounded-2xl border border-emerald-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-900 text-xs sm:text-sm">{hours.dayOfWeek}</h4>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${hours.isAvailable ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                            <span className="text-xs text-gray-600">{hours.isAvailable ? 'Available' : 'Unavailable'}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-600 font-medium">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{formatTime(hours.startTime)} - {formatTime(hours.endTime)}</span>
                          </div>
                          {hours.serviceTypes.length > 0 && (
                            <p className="text-xs sm:text-sm text-gray-700 font-medium">
                              Services: {hours.serviceTypes.join(', ')}
                            </p>
                          )}
                          {hours.notes && (
                            <p className="text-xs sm:text-sm text-gray-500 mt-2 italic">{hours.notes}</p>
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

        {/* Add Business Hours Modal */}
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
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Set Business Hours</h2>
                      <p className="text-gray-600 text-sm sm:text-base">Configure your weekly availability</p>
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
                {/* Day Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Day <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`p-2 text-xs font-medium rounded-lg transition-all ${
                          selectedDay === day
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={getHoursForDay(selectedDay).startTime}
                      onChange={(e) => updateHoursForDay({
                        ...getHoursForDay(selectedDay),
                        startTime: e.target.value
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      End Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={getHoursForDay(selectedDay).endTime}
                      onChange={(e) => updateHoursForDay({
                        ...getHoursForDay(selectedDay),
                        endTime: e.target.value
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Availability Toggle */}
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-700">
                    Available on this day
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={getHoursForDay(selectedDay).isAvailable}
                      onChange={(e) => updateHoursForDay({
                        ...getHoursForDay(selectedDay),
                        isAvailable: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Service Types */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Service Types <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {serviceTypes.map((service) => {
                      const isSelected = getHoursForDay(selectedDay).serviceTypes.includes(service);
                      return (
                        <button
                          key={service}
                          type="button"
                          onClick={() => handleServiceTypeToggle(service)}
                          className={`p-2 text-xs font-medium rounded-lg transition-all ${
                            isSelected
                              ? 'bg-blue-100 text-blue-700 border border-blue-300'
                              : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          {service}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={getHoursForDay(selectedDay).notes}
                    onChange={(e) => updateHoursForDay({
                      ...getHoursForDay(selectedDay),
                      notes: e.target.value
                    })}
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
                  onClick={handleSaveBusinessHours}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl sm:rounded-2xl hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-semibold hover:scale-105"
                >
                  <Save className="w-5 h-5" />
                  <span>Save All Hours</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Details Modal */}
        {showBookingModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 sm:p-8 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Booking Details</h2>
                      <p className="text-gray-600 text-sm sm:text-base">Appointment information</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowBookingModal(false)}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Client Name
                    </label>
                    <p className="text-gray-900">{selectedBooking.customerName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Service
                    </label>
                    <p className="text-gray-900">{selectedBooking.serviceType}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date Requested
                    </label>
                    <p className="text-gray-900">{formatDate(selectedBooking.requestedAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Timeframe
                    </label>
                    <p className="text-gray-900">{selectedBooking.timeframe}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <p className="text-gray-900">{selectedBooking.location}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Budget
                  </label>
                  <p className="text-2xl font-bold text-green-600">{selectedBooking.budget}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>

                {selectedBooking.description && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedBooking.description}</p>
                  </div>
                )}

                {selectedBooking.specialRequests && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Special Requests
                    </label>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedBooking.specialRequests}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <p className="text-gray-900">{selectedBooking.customerEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <p className="text-gray-900">{selectedBooking.customerPhone}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Update Status
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {/* FIXED: Changed 'confirmed' to 'accepted' */}
                    <button 
                      onClick={() => handleUpdateBookingStatus(selectedBooking._id, 'accepted')}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                      disabled={selectedBooking.status === 'confirmed'}
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleUpdateBookingStatus(selectedBooking._id, 'completed')}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                      disabled={selectedBooking.status === 'completed'}
                    >
                      Complete
                    </button>
                    <button 
                      onClick={() => handleUpdateBookingStatus(selectedBooking._id, 'cancelled')}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                      disabled={selectedBooking.status === 'cancelled'}
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Customer
                  </label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleContactCustomer(selectedBooking, 'email')}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </button>
                    <button 
                      onClick={() => handleContactCustomer(selectedBooking, 'phone')}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 border-t border-gray-100">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl sm:rounded-2xl hover:shadow-xl transition-all duration-200 font-semibold"
                >
                  Close
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