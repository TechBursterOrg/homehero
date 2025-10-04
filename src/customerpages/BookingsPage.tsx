import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Star, MoreVertical, ArrowRight, Plus, X } from 'lucide-react';
import BookingCard from '../customercomponents/BookingCard';
import { bookings as mockBookings } from '../data/mockData';

// Define a more complete Booking type that matches your API response
interface ApiBooking {
  _id: string;
  id?: string;
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
  budget: string | number;
  specialRequests: string;
  bookingType: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled' | 'confirmed';
  requestedAt: string | Date;
  acceptedAt?: string | Date;
  completedAt?: string | Date;
  updatedAt: string | Date;
  rating?: number;
  ratingStatus?: {
    customerRated: boolean;
    providerRated: boolean;
  };
  provider?: {
    name: string;
    email: string;
    phoneNumber: string;
    profileImage: string;
  };
}

interface RescheduleFormData {
  newDate: string;
  newTime: string;
  reason: string;
}

const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? "https://backendhomeheroes.onrender.com" 
    : "http://localhost:3001";

// Function to convert API booking to the format expected by BookingCard
const convertApiBookingToCardFormat = (apiBooking: ApiBooking): any => {
  try {
    // Safely extract date and time from requestedAt
    let date = '';
    let time = '';
    
    if (apiBooking.requestedAt) {
      try {
        const requestedDate = new Date(apiBooking.requestedAt);
        if (!isNaN(requestedDate.getTime())) {
          date = requestedDate.toISOString().split('T')[0];
          time = requestedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
      } catch (dateError) {
        console.error('Error parsing date:', dateError);
      }
    }
    
    // Convert status from API format to BookingCard expected format
    let status: 'completed' | 'cancelled' | 'upcoming' | 'in-progress';
    switch (apiBooking.status) {
      case 'completed':
        status = 'completed';
        break;
      case 'cancelled':
      case 'rejected':
        status = 'cancelled';
        break;
      case 'pending':
      case 'accepted':
      case 'confirmed':
        status = 'upcoming';
        break;
      default:
        status = 'upcoming';
    }
    
    // Convert budget to price string
    const price = typeof apiBooking.budget === 'string' 
      ? apiBooking.budget 
      : `$${apiBooking.budget || 0}`;
    
    // Return the format expected by BookingCard
    return {
      id: apiBooking._id || apiBooking.id || '',
      service: apiBooking.serviceType,
      description: apiBooking.description,
      date: date,
      time: time,
      location: apiBooking.location,
      price: price,
      status: status,
      provider: apiBooking.providerName,
      customer: apiBooking.customerName,
      specialRequests: apiBooking.specialRequests,
      timeframe: apiBooking.timeframe,
      rating: apiBooking.rating,
      ratingStatus: apiBooking.ratingStatus || {
        customerRated: false,
        providerRated: false
      },
      // Include other properties that might be needed
      providerId: apiBooking.providerId,
      customerId: apiBooking.customerId
    };
  } catch (error) {
    console.error('Error converting booking:', error);
    // Return a safe fallback object
    return {
      id: apiBooking._id || apiBooking.id || 'error',
      service: apiBooking.serviceType || 'Service',
      description: apiBooking.description || '',
      date: '',
      time: '',
      location: apiBooking.location || '',
      price: typeof apiBooking.budget === 'string' ? apiBooking.budget : `$${apiBooking.budget || 0}`,
      status: 'upcoming',
      provider: apiBooking.providerName || 'Provider',
      customer: apiBooking.customerName || 'Customer',
      specialRequests: apiBooking.specialRequests || '',
      timeframe: apiBooking.timeframe || '',
      rating: apiBooking.rating,
      ratingStatus: apiBooking.ratingStatus || {
        customerRated: false,
        providerRated: false
      }
    };
  }
};

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<ApiBooking | null>(null);
  const [rescheduleForm, setRescheduleForm] = useState<RescheduleFormData>({
    newDate: '',
    newTime: '',
    reason: ''
  });
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/bookings/customer`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        throw new Error('Your session has expired. Please log in again.');
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setBookings(data.data.bookings || []);
      } else {
        throw new Error(data.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data as fallback');
        const safeMockData = mockBookings.map(booking => {
          const mockBooking = booking as any;
          
          return {
            _id: booking.id,
            id: booking.id,
            requestedAt: mockBooking.requestedAt || new Date().toISOString(),
            providerId: mockBooking.providerId || 'mock-provider-id',
            providerName: mockBooking.providerName || mockBooking.provider || 'Provider',
            providerEmail: mockBooking.providerEmail || 'provider@example.com',
            customerId: mockBooking.customerId || 'mock-customer-id',
            customerName: mockBooking.customerName || mockBooking.customer || 'Customer',
            customerEmail: mockBooking.customerEmail || 'customer@example.com',
            customerPhone: mockBooking.customerPhone || '123-456-7890',
            serviceType: mockBooking.serviceType || mockBooking.service || 'Service',
            description: mockBooking.description || '',
            location: mockBooking.location || '',
            timeframe: mockBooking.timeframe || '2-3 hours',
            budget: mockBooking.price || '$100',
            specialRequests: mockBooking.specialRequests || '',
            bookingType: mockBooking.bookingType || 'regular',
            status: (booking.status === 'upcoming' ? 'pending' : 
                    booking.status === 'in-progress' ? 'accepted' :
                    booking.status) as 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled' | 'confirmed',
            updatedAt: new Date().toISOString(),
            rating: mockBooking.rating || 0,
            ratingStatus: mockBooking.ratingStatus || {
              customerRated: false,
              providerRated: false
            },
            provider: mockBooking.providerObj ? {
              name: mockBooking.providerObj.name || mockBooking.provider || 'Provider',
              email: mockBooking.providerObj.email || 'provider@example.com',
              phoneNumber: mockBooking.providerObj.phoneNumber || '123-456-7890',
              profileImage: mockBooking.providerObj.profileImage || ''
            } : undefined
          } as ApiBooking;
        });
        
        setBookings(safeMockData);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (bookingId: string, action: string) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      let endpoint = '';
      let method = 'PATCH';
      let body = null;

      switch (action) {
        case 'cancel':
          endpoint = `${API_BASE_URL}/api/bookings/${bookingId}/status`;
          body = JSON.stringify({ status: 'cancelled' });
          break;
        case 'reschedule':
          // This will now open the modal instead of direct API call
          const booking = bookings.find(b => b._id === bookingId);
          if (booking) {
            setSelectedBooking(booking);
            setShowRescheduleModal(true);
          }
          return;
        case 'view-details':
          handleViewDetails(bookingId);
          return;
        case 'contact-phone':
          handleContactPhone(bookingId);
          return;
        case 'contact-email':
          handleContactEmail(bookingId);
          return;
        default:
          console.log('Unknown action:', action, bookingId);
          return;
      }

      if (body) {
        const response = await fetch(endpoint, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body,
        });

        if (response.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          throw new Error('Your session has expired. Please log in again.');
        }

        if (!response.ok) {
          throw new Error(`Failed to ${action} booking`);
        }

        await response.json();
        fetchUserBookings();
      }
    } catch (err) {
      console.error(`Error ${action} booking:`, err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleRateProvider = async (bookingId: string, rating: number, comment?: string) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/api/ratings/customer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          rating,
          comment: comment || ''
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      const result = await response.json();
      
      if (result.success) {
        // Update the local state to reflect the rating
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking._id === bookingId 
              ? { 
                  ...booking, 
                  rating,
                  ratingStatus: { 
                    customerRated: true,
                    providerRated: booking.ratingStatus?.providerRated || false
                  } 
                }
              : booking
          )
        );
        
        alert('Rating submitted successfully!');
      } else {
        throw new Error(result.message || 'Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    try {
      setRescheduleLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      // First, create a reschedule request
      const response = await fetch(`${API_BASE_URL}/api/bookings/reschedule`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: selectedBooking._id,
          newDate: rescheduleForm.newDate,
          newTime: rescheduleForm.newTime,
          reason: rescheduleForm.reason,
          providerId: selectedBooking.providerId,
          customerId: selectedBooking.customerId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit reschedule request');
      }

      const result = await response.json();
      
      if (result.success) {
        // Close modal and refresh bookings
        setShowRescheduleModal(false);
        setSelectedBooking(null);
        setRescheduleForm({ newDate: '', newTime: '', reason: '' });
        fetchUserBookings();
        alert('Reschedule request submitted successfully! The provider will review your request.');
      } else {
        throw new Error(result.message || 'Failed to submit reschedule request');
      }
    } catch (err) {
      console.error('Error submitting reschedule:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setRescheduleLoading(false);
    }
  };

  const handleViewDetails = (bookingId: string) => {
    const booking = bookings.find(b => b._id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      setShowDetailsModal(true);
    }
  };

  const handleContactPhone = (bookingId: string) => {
    const booking = bookings.find(b => b._id === bookingId);
    if (booking && booking.provider?.phoneNumber) {
      window.location.href = `tel:${booking.provider.phoneNumber}`;
    } else {
      alert('Phone number not available for this provider');
    }
  };

  const handleContactEmail = (bookingId: string) => {
    const booking = bookings.find(b => b._id === bookingId);
    if (booking && booking.providerEmail) {
      window.location.href = `mailto:${booking.providerEmail}`;
    } else {
      alert('Email not available for this provider');
    }
  };

  const handleViewCalendar = () => {
    setShowCalendarModal(true);
  };

  const handleBookNewService = () => {
    window.location.href = '/book-service';
  };

  const handleFilterChange = (newFilter: 'all' | 'upcoming' | 'completed' | 'cancelled') => {
    setFilter(newFilter);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = '/login';
  };

  // Filter bookings based on selected filter
  const filteredBookings = bookings.filter(booking => {
    switch (filter) {
      case 'upcoming':
        return booking.status === 'pending' || booking.status === 'accepted' || booking.status === 'confirmed';
      case 'completed':
        return booking.status === 'completed';
      case 'cancelled':
        return booking.status === 'cancelled' || booking.status === 'rejected';
      default:
        return true;
    }
  });

  // Format date for display
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generate calendar events from bookings
  const calendarEvents = bookings.map(booking => ({
    id: booking._id,
    title: `${booking.serviceType} - ${booking.providerName}`,
    date: new Date(booking.requestedAt).toISOString().split('T')[0],
    status: booking.status,
    service: booking.serviceType,
    provider: booking.providerName
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error loading bookings</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <div className="space-x-4">
            <button 
              onClick={fetchUserBookings}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
            <button 
              onClick={handleLogout}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats from real bookings data
  const upcomingBookings = bookings.filter(booking => 
    booking.status === 'pending' || booking.status === 'accepted' || booking.status === 'confirmed'
  );
  
  const completedBookings = bookings.filter(booking => 
    booking.status === 'completed'
  );
  
  const cancelledBookings = bookings.filter(booking => 
    booking.status === 'cancelled' || booking.status === 'rejected'
  );

  // Convert API bookings to format expected by BookingCard
  const cardBookings = filteredBookings.map(convertApiBookingToCardFormat);

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section with Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                My Bookings
              </h1>
            </div>
            <p className="text-gray-700 text-lg font-medium max-w-md">
              Manage your service appointments and track your booking history
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={handleViewCalendar}
              className="group bg-white/80 backdrop-blur-sm border border-white/50 text-gray-700 px-6 py-3 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center space-x-2 font-semibold"
            >
              <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>View Calendar</span>
            </button>
            
            <button 
              onClick={handleBookNewService}
              className="group bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white px-8 py-3 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 font-semibold shadow-lg"
            >
              <Plus className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span>Book New Service</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* All Bookings */}
        <div 
          className={`group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-pointer ${
            filter === 'all' ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => handleFilterChange('all')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full transform translate-x-8 -translate-y-8"></div>
          
          <div className="relative flex items-start justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{bookings.length}</p>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="relative">
            <h3 className="text-sm font-bold text-gray-900 mb-1">All Bookings</h3>
            <p className="text-xs text-gray-600">Total service appointments</p>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div 
          className={`group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-pointer ${
            filter === 'upcoming' ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => handleFilterChange('upcoming')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full transform translate-x-8 -translate-y-8"></div>
          
          <div className="relative flex items-start justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">{upcomingBookings.length}</p>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="relative">
            <h3 className="text-sm font-bold text-gray-900 mb-1">Upcoming</h3>
            <p className="text-xs text-gray-600">
              {upcomingBookings.length > 0 ? 
                `Next: ${new Date(upcomingBookings[0].requestedAt).toLocaleDateString()}` : 
                'No upcoming bookings'}
            </p>
          </div>
        </div>

        {/* Completed Bookings */}
        <div 
          className={`group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-pointer ${
            filter === 'completed' ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => handleFilterChange('completed')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-green-400/10 rounded-full transform translate-x-8 -translate-y-8"></div>
          
          <div className="relative flex items-start justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">{completedBookings.length}</p>
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            </div>
          </div>
          
          <div className="relative">
            <h3 className="text-sm font-bold text-gray-900 mb-1">Completed</h3>
            <p className="text-xs text-gray-600">100% success rate</p>
          </div>
        </div>

        {/* Cancelled Bookings */}
        <div 
          className={`group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-pointer ${
            filter === 'cancelled' ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => handleFilterChange('cancelled')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/10 to-pink-400/10 rounded-full transform translate-x-8 -translate-y-8"></div>
          
          <div className="relative flex items-start justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">{cancelledBookings.length}</p>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          </div>
          
          <div className="relative">
            <h3 className="text-sm font-bold text-gray-900 mb-1">Cancelled</h3>
            <p className="text-xs text-gray-600">Cancelled appointments</p>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => handleFilterChange('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            filter === 'all'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Bookings
        </button>
        <button
          onClick={() => handleFilterChange('upcoming')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            filter === 'upcoming'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => handleFilterChange('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            filter === 'completed'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => handleFilterChange('cancelled')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            filter === 'cancelled'
              ? 'bg-red-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Cancelled
        </button>
      </div>

      {/* Enhanced Bookings List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {filter === 'all' && 'All Bookings'}
              {filter === 'upcoming' && 'Upcoming Bookings'}
              {filter === 'completed' && 'Completed Bookings'}
              {filter === 'cancelled' && 'Cancelled Bookings'}
            </h2>
            <p className="text-gray-600 mt-1">
              {filter === 'all' && 'All your service appointments'}
              {filter === 'upcoming' && 'Your upcoming service appointments'}
              {filter === 'completed' && 'Completed service appointments'}
              {filter === 'cancelled' && 'Cancelled service appointments'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <select 
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value as any)}
                className="appearance-none bg-white border border-gray-200 rounded-2xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="all">All Bookings</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <MoreVertical className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Bookings Cards with Enhanced Animation */}
        <div className="space-y-4">
          {cardBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? "You haven't made any service bookings yet."
                  : `No ${filter} bookings found.`
                }
              </p>
              {filter !== 'all' && (
                <button 
                  onClick={() => handleFilterChange('all')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-2"
                >
                  View All Bookings
                </button>
              )}
              <button 
                onClick={handleBookNewService}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Book Your First Service
              </button>
            </div>
          ) : (
            cardBookings.map((booking, index) => (
              <div
                key={booking.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <BookingCard
                  booking={booking}
                  onReschedule={(id) => handleBookingAction(id, 'reschedule')}
                  onCancel={(id) => handleBookingAction(id, 'cancel')}
                  onContact={(id, method) => handleBookingAction(id, `contact-${method}`)}
                  onViewDetails={(id) => handleViewDetails(id)}
                  onRateProvider={handleRateProvider}
                />
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {cardBookings.length > 0 && (
          <div className="flex justify-center pt-8">
            <button className="group bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-50 hover:to-purple-50 text-gray-700 hover:text-blue-700 px-8 py-3 rounded-2xl border border-gray-200 hover:border-blue-200 transition-all duration-300 flex items-center space-x-3 font-semibold hover:shadow-lg">
              <span>Load More Bookings</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Reschedule Booking</h3>
                <button
                  onClick={() => {
                    setShowRescheduleModal(false);
                    setSelectedBooking(null);
                    setRescheduleForm({ newDate: '', newTime: '', reason: '' });
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Current Booking Details</h4>
                <p className="text-sm text-gray-600">
                  <strong>Service:</strong> {selectedBooking.serviceType}<br />
                  <strong>Provider:</strong> {selectedBooking.providerName}<br />
                  <strong>Current Date:</strong> {formatDate(selectedBooking.requestedAt)}<br />
                  <strong>Location:</strong> {selectedBooking.location}
                </p>
              </div>

              <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Date
                  </label>
                  <input
                    type="date"
                    required
                    value={rescheduleForm.newDate}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, newDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Time
                  </label>
                  <input
                    type="time"
                    required
                    value={rescheduleForm.newTime}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, newTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Rescheduling
                  </label>
                  <textarea
                    required
                    value={rescheduleForm.reason}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, reason: e.target.value })}
                    placeholder="Please explain why you need to reschedule..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRescheduleModal(false);
                      setSelectedBooking(null);
                      setRescheduleForm({ newDate: '', newTime: '', reason: '' });
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={rescheduleLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {rescheduleLoading ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Calendar View Modal */}
      {showCalendarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Booking Calendar</h3>
                <button
                  onClick={() => setShowCalendarModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Calendar View */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Calendar Overview</h4>
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-center text-sm text-gray-500 mb-4">
                      {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 35 }, (_, i) => {
                        const date = new Date();
                        date.setDate(1);
                        date.setDate(date.getDate() - date.getDay() + i);
                        const dateString = date.toISOString().split('T')[0];
                        const dayEvents = calendarEvents.filter(event => event.date === dateString);
                        
                        return (
                          <div
                            key={i}
                            className={`min-h-12 p-1 border border-gray-200 text-sm ${
                              date.getMonth() === new Date().getMonth() 
                                ? 'bg-white' 
                                : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            <div className="text-right text-xs mb-1">{date.getDate()}</div>
                            {dayEvents.slice(0, 2).map(event => (
                              <div
                                key={event.id}
                                className={`text-xs p-1 mb-1 rounded ${
                                  event.status === 'completed' 
                                    ? 'bg-green-100 text-green-800'
                                    : event.status === 'cancelled'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                                title={`${event.service} with ${event.provider}`}
                              >
                                ●
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="text-xs text-gray-500 text-center">
                                +{dayEvents.length - 2} more
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Upcoming Events List */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Upcoming Bookings</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {calendarEvents
                      .filter(event => new Date(event.date) >= new Date())
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .slice(0, 10)
                      .map(event => (
                        <div
                          key={event.id}
                          className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-medium text-gray-900">{event.title}</h5>
                              <p className="text-sm text-gray-600">
                                {new Date(event.date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              event.status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : event.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {event.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    {calendarEvents.filter(event => new Date(event.date) >= new Date()).length === 0 && (
                      <p className="text-gray-500 text-center py-4">No upcoming bookings</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h5 className="font-medium text-gray-900 mb-2">Legend</h5>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
                    <span className="text-sm text-gray-600">Upcoming/Pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                    <span className="text-sm text-gray-600">Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                    <span className="text-sm text-gray-600">Cancelled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Booking Details</h3>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedBooking(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Service Type</label>
                    <p className="text-sm font-medium text-gray-900">{selectedBooking.serviceType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      selectedBooking.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : selectedBooking.status === 'cancelled' || selectedBooking.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Provider</label>
                  <p className="text-sm font-medium text-gray-900">{selectedBooking.providerName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Date & Time</label>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(selectedBooking.requestedAt)} at{' '}
                    {new Date(selectedBooking.requestedAt).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Location</label>
                  <p className="text-sm font-medium text-gray-900">{selectedBooking.location}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Budget</label>
                  <p className="text-sm font-medium text-gray-900">{selectedBooking.budget}</p>
                </div>

                {selectedBooking.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Description</label>
                    <p className="text-sm text-gray-900">{selectedBooking.description}</p>
                  </div>
                )}

                {selectedBooking.specialRequests && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Special Requests</label>
                    <p className="text-sm text-gray-900">{selectedBooking.specialRequests}</p>
                  </div>
                )}

                {selectedBooking.rating && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Your Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= selectedBooking.rating! 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">({selectedBooking.rating}/5)</span>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        setSelectedBooking(null);
                      }}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Close
                    </button>
                    {(selectedBooking.status === 'pending' || selectedBooking.status === 'accepted' || selectedBooking.status === 'confirmed') && (
                      <button
                        onClick={() => {
                          setShowDetailsModal(false);
                          handleBookingAction(selectedBooking._id, 'reschedule');
                        }}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Reschedule
                      </button>
                    )}
                    {selectedBooking.status === 'completed' && !selectedBooking.rating && (
                      <button
                        onClick={() => {
                          setShowDetailsModal(false);
                          handleRateProvider(selectedBooking._id, 5); // Default 5 stars
                        }}
                        className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                      >
                        Rate Provider
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;