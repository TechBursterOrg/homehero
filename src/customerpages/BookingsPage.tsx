import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Sparkles, Star, DollarSign, MoreVertical, ArrowRight, Plus } from 'lucide-react';
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
  provider?: {
    name: string;
    email: string;
    phoneNumber: string;
    profileImage: string;
  };
}

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
      // Include other properties that might be needed
      providerId: apiBooking.providerId,
      customerId: apiBooking.customerId,
      rating: apiBooking.rating
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
      timeframe: apiBooking.timeframe || ''
    };
  }
};

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      
      // FIXED: Use the correct API endpoint - check your server routes
      // The endpoint might be different based on your server setup
      const response = await fetch('http://localhost:3001/api/bookings/customer', {
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
      
      // Fallback to mock data in development - but handle it carefully
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data as fallback');
        // FIXED: Safely convert mock data to match ApiBooking interface
        const safeMockData = mockBookings.map(booking => {
          const mockBooking = booking as any; // Cast to any to access all properties safely
          
          return {
            _id: booking.id,
            id: booking.id,
            // Safely add requestedAt if it doesn't exist
            requestedAt: mockBooking.requestedAt || new Date().toISOString(),
            // Ensure all required fields exist
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
            // Map status to match API format
            status: (booking.status === 'upcoming' ? 'pending' : 
                    booking.status === 'in-progress' ? 'accepted' :
                    booking.status) as 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled' | 'confirmed',
            updatedAt: new Date().toISOString(),
            rating: mockBooking.rating || 0,
            // Handle provider object - make it optional since it's optional in ApiBooking
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
          endpoint = `http://localhost:3001/api/bookings/${bookingId}/status`;
          body = JSON.stringify({ status: 'cancelled' });
          break;
        case 'reschedule':
          console.log('Reschedule booking:', bookingId);
          return;
        case 'contact-phone':
        case 'contact-email':
          console.log('Contact via:', action, bookingId);
          return;
        default:
          console.log('Unknown action:', action, bookingId);
          return;
      }

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

      const data = await response.json();
      
      if (data.success) {
        fetchUserBookings();
      } else {
        throw new Error(data.message || `Failed to ${action} booking`);
      }
    } catch (err) {
      console.error(`Error ${action} booking:`, err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = '/login';
  };

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
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:gray-700"
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
  
  const averageRating = bookings.reduce((acc, booking) => {
    const rating = booking.rating || 0;
    return acc + rating;
  }, 0) / (bookings.length || 1);
  
  const totalSpent = bookings.reduce((acc, booking) => {
    const amount = typeof booking.budget === 'string' ? 
      parseFloat(booking.budget.replace(/[^0-9.]/g, '')) || 0 : 
      (typeof booking.budget === 'number' ? booking.budget : 0);
    return acc + amount;
  }, 0);

  // Convert API bookings to format expected by BookingCard
  const cardBookings = bookings.map(convertApiBookingToCardFormat);

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
            <button className="group bg-white/80 backdrop-blur-sm border border-white/50 text-gray-700 px-6 py-3 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center space-x-2 font-semibold">
              <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>View Calendar</span>
            </button>
            
            <button className="group bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white px-8 py-3 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 font-semibold shadow-lg">
              <Plus className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span>Book New Service</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Upcoming Bookings */}
        <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full transform translate-x-8 -translate-y-8"></div>
          
          <div className="relative flex items-start justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{upcomingBookings.length}</p>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="relative">
            <h3 className="text-sm font-bold text-gray-900 mb-1">Upcoming</h3>
            <p className="text-xs text-gray-600">
              {upcomingBookings.length > 0 ? 
                `Next: ${new Date(upcomingBookings[0].requestedAt).toLocaleDateString()}` : 
                'No upcoming bookings'}
            </p>
            <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" 
                style={{ width: `${Math.min((upcomingBookings.length / (bookings.length || 1)) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Completed Bookings */}
        <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
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
            <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full w-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                style={{ width: `${Math.min((completedBookings.length / (bookings.length || 1)) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Average Rating */}
        <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full transform translate-x-8 -translate-y-8"></div>
          
          <div className="relative flex items-start justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="text-right flex items-center gap-1">
              <p className="text-3xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300">
                {averageRating.toFixed(1)}
              </p>
              <Star className="w-4 h-4 text-amber-500 fill-current" />
            </div>
          </div>
          
          <div className="relative">
            <h3 className="text-sm font-bold text-gray-900 mb-1">Avg Rating</h3>
            <p className="text-xs text-gray-600">From {bookings.length} bookings</p>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-3 h-3 ${star <= Math.round(averageRating) ? 'text-amber-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Total Spent */}
        <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full transform translate-x-8 -translate-y-8"></div>
          
          <div className="relative flex items-start justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                ${totalSpent.toFixed(0)}
              </p>
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            </div>
          </div>
          
          <div className="relative">
            <h3 className="text-sm font-bold text-gray-900 mb-1">Total Spent</h3>
            <p className="text-xs text-gray-600">This year</p>
            <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full w-4/5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                style={{ width: `${Math.min((totalSpent / 2400) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bookings List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
            <p className="text-gray-600 mt-1">Your latest service appointments</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-200 rounded-2xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                <option>All Bookings</option>
                <option>Upcoming</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
              <MoreVertical className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bookings Cards with Enhanced Animation */}
        <div className="space-y-4">
          {cardBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-600 mb-6">You haven't made any service bookings yet.</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
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
    </div>
  );
};

export default BookingsPage;