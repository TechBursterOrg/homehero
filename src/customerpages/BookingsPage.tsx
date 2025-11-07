import React, { useState, useEffect } from 'react';
import { Calendar, Star, ArrowRight, Plus, X, Phone, Mail } from 'lucide-react';
import BookingCard from '../customercomponents/BookingCard';

// Types
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
  date: string;
  time: string;
  timeframe: string;
  price: number;
  amount: number;
  specialRequests: string;
  bookingType: string;
  status: 'pending' | 'confirmed' | 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
  requestedAt: string;
  acceptedAt?: string;
  completedAt?: string;
  updatedAt: string;
  rating?: number;
  ratingStatus?: {
    customerRated: boolean;
    providerRated: boolean;
  };
  payment?: {
    status: 'pending' | 'held' | 'confirmed' | 'released' | 'refunded' | 'failed' | 'requires_payment_method' | 'succeeded';
    amount: number;
    currency: string;
    processor: 'stripe' | 'paystack';
    heldAt?: string;
    confirmedAt?: string;
    releasedAt?: string;
    commission?: number;
    providerAmount?: number;
  };
  autoRefundAt?: string;
  serviceConfirmedByCustomer?: boolean;
  serviceConfirmedAt?: string;
  provider?: {
    name: string;
    email: string;
    phoneNumber: string;
    profileImage?: string;
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
  return {
    id: apiBooking._id || apiBooking.id || '',
    _id: apiBooking._id || apiBooking.id || '',
    serviceType: apiBooking.serviceType,
    providerName: apiBooking.providerName,
    providerId: apiBooking.providerId,
    customerId: apiBooking.customerId,
    date: apiBooking.date,
    time: apiBooking.time,
    status: apiBooking.status,
    price: apiBooking.price || apiBooking.amount,
    amount: apiBooking.amount || apiBooking.price,
    location: apiBooking.location,
    description: apiBooking.description,
    specialRequests: apiBooking.specialRequests,
    rating: apiBooking.rating,
    ratingStatus: apiBooking.ratingStatus || {
      customerRated: false,
      providerRated: false
    },
    payment: apiBooking.payment,
    autoRefundAt: apiBooking.autoRefundAt,
    serviceConfirmedByCustomer: apiBooking.serviceConfirmedByCustomer,
    serviceConfirmedAt: apiBooking.serviceConfirmedAt,
    provider: apiBooking.provider
  };
};

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<ApiBooking | null>(null);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedBookingForRating, setSelectedBookingForRating] = useState<ApiBooking | null>(null);
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
    } finally {
      setLoading(false);
    }
  };

const handlePaymentSuccess = async (bookingId: string) => {
  console.log('💰 Processing payment for booking:', bookingId);
  
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    // Get the booking to know the amount
    const booking = bookings.find(b => b._id === bookingId);
    const amount = booking?.price || booking?.amount || 100;

    console.log('💳 Payment details:', { amount });

    // First, test body parsing
    console.log('🧪 Testing body parsing...');
    const testResponse = await fetch(`${API_BASE_URL}/api/test-body-parsing`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test: 'data', amount: amount }),
    });

    if (testResponse.ok) {
      const testResult = await testResponse.json();
      console.log('✅ Body parsing test passed:', testResult);
    } else {
      console.log('❌ Body parsing test failed');
    }

    // 1. Create payment intent
    const createResponse = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/create-payment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // CRITICAL: This header must be set
      },
      body: JSON.stringify({
        amount: amount,
        customerCountry: 'NG'
      }),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('❌ Create payment failed:', errorText);
      throw new Error(`Payment creation failed: ${createResponse.status} ${createResponse.statusText}`);
    }

    const createResult = await createResponse.json();
    
    if (!createResult.success) {
      throw new Error(createResult.message || 'Payment creation failed');
    }

    console.log('✅ Payment intent created:', createResult.data);

    // 2. If in simulation mode, confirm payment immediately
    if (createResult.data.simulated || createResult.data.processor === 'simulation') {
      console.log('💳 Simulation mode - confirming payment immediately');
      
      const confirmResponse = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/confirm-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId: createResult.data.paymentIntentId
        }),
      });

      if (!confirmResponse.ok) {
        const errorText = await confirmResponse.text();
        throw new Error(`Payment confirmation failed: ${confirmResponse.status}`);
      }

      const confirmResult = await confirmResponse.json();
      
      if (!confirmResult.success) {
        throw new Error(confirmResult.message || 'Payment confirmation failed');
      }

      // Update UI immediately
      setBookings(prev => prev.map(booking => 
        booking._id === bookingId 
          ? { 
              ...booking, 
              payment: {
                status: 'held',
                amount: createResult.data.amount,
                currency: createResult.data.currency,
                processor: createResult.data.processor,
                heldAt: new Date().toISOString(),
                autoRefundAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
              },
              status: 'confirmed'
            }
          : booking
      ));

      alert('✅ Payment confirmed successfully! The provider has been notified.');
      
    } else {
      // 3. For real payments, show appropriate message
      if (createResult.data.processor === 'paystack' && createResult.data.authorizationUrl) {
        alert('🔗 You would be redirected to Paystack for payment in production');
        console.log('Paystack URL:', createResult.data.authorizationUrl);
        // window.location.href = createResult.data.authorizationUrl;
      } else if (createResult.data.processor === 'stripe' && createResult.data.clientSecret) {
        alert('💳 Stripe payment modal would open here in production');
        console.log('Stripe client secret:', createResult.data.clientSecret);
      }
    }

  } catch (error) {
    console.error('❌ Payment processing error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    alert(`Payment failed: ${errorMessage}`);
  }
};




const simulatePaymentSuccess = (bookingId: string) => {
  setBookings(prev => prev.map(booking => 
    booking._id === bookingId 
      ? { 
          ...booking, 
          payment: {
            status: 'confirmed',
            amount: booking.price || booking.amount,
            currency: 'NGN',
            processor: 'paystack',
            confirmedAt: new Date().toISOString()
          },
          status: 'confirmed'
        }
      : booking
  ));
  alert('💳 Payment simulation: Payment confirmed successfully! The provider has been notified.\n\n🔧 Note: Backend CORS needs configuration for real payments.');
};

  const handleReleasePayment = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/api/payments/release`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
      });

      if (response.ok) {
        setBookings(prev => prev.map(booking => 
          booking._id === bookingId 
            ? { 
                ...booking, 
                payment: booking.payment ? { ...booking.payment, status: 'released' } : undefined
              }
            : booking
        ));
        alert('Payment released to provider successfully!');
      } else {
        throw new Error('Failed to release payment');
      }
    } catch (err) {
      console.error('Error releasing payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to release payment');
    }
  };

  const handleSeenProvider = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/api/payments/confirm-service-completion`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setBookings(prev => prev.map(booking => 
            booking._id === bookingId 
              ? { 
                  ...booking, 
                  serviceConfirmedByCustomer: true,
                  serviceConfirmedAt: new Date().toISOString(),
                  payment: booking.payment ? { ...booking.payment, status: 'released' } : undefined
                }
              : booking
          ));
          alert('Service completion confirmed! Payment has been released to the provider.');
        } else {
          throw new Error(result.message || 'Failed to confirm service completion');
        }
      } else {
        throw new Error('Failed to confirm service completion');
      }
    } catch (err) {
      console.error('Error confirming service completion:', err);
      setError(err instanceof Error ? err.message : 'Failed to confirm service completion');
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
          const booking = bookings.find(b => b._id === bookingId);
          if (booking) {
            setSelectedBooking(booking);
            setShowRescheduleModal(true);
          }
          return;
        case 'view-details':
          handleViewDetails(bookingId);
          return;
        case 'contact-message':
          handleContactMessage(bookingId);
          return;
        case 'contact-phone':
          handleContactPhone(bookingId);
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
          bookingId: bookingId,
          rating: rating,
          comment: comment || ''
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
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
      } else {
        throw new Error('Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      alert(`Failed to submit rating: ${errorMessage}`);
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

  const handleContactMessage = (bookingId: string) => {
    const booking = bookings.find(b => b._id === bookingId);
    if (booking && booking.providerEmail) {
      window.location.href = `mailto:${booking.providerEmail}`;
    } else {
      alert('Email not available for this provider');
    }
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
        return booking.status === 'pending' || booking.status === 'confirmed' || booking.status === 'upcoming';
      case 'completed':
        return booking.status === 'completed';
      case 'cancelled':
        return booking.status === 'cancelled';
      default:
        return true;
    }
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Calculate stats from real bookings data
  const upcomingBookings = bookings.filter(booking => 
    booking.status === 'pending' || booking.status === 'confirmed' || booking.status === 'upcoming'
  );
  
  const completedBookings = bookings.filter(booking => 
    booking.status === 'completed'
  );
  
  const cancelledBookings = bookings.filter(booking => 
    booking.status === 'cancelled'
  );

  // Convert API bookings to format expected by BookingCard
  const cardBookings = filteredBookings.map(convertApiBookingToCardFormat);

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">
                  My Bookings
                </h1>
              </div>
              <p className="text-gray-700 text-lg font-medium">
                Manage your service appointments and track your booking history
              </p>
            </div>
            
            <button 
              onClick={handleBookNewService}
              className="bg-blue-600 text-white px-8 py-3 rounded-2xl hover:bg-blue-700 transition-colors flex items-center space-x-2 font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>Book New Service</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'All Bookings', count: bookings.length, color: 'blue' },
            { label: 'Upcoming', count: upcomingBookings.length, color: 'green' },
            { label: 'Completed', count: completedBookings.length, color: 'emerald' },
            { label: 'Cancelled', count: cancelledBookings.length, color: 'red' }
          ].map((stat) => (
            <div 
              key={stat.label}
              className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-200 cursor-pointer ${
                filter.toLowerCase() === stat.label.toLowerCase() ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}
              onClick={() => handleFilterChange(stat.label.toLowerCase() as any)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-2xl flex items-center justify-center shadow-lg`}>
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{stat.label}</h3>
                <p className="text-xs text-gray-600">Total service appointments</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((filterType) => (
                    <button
                      key={filterType}
                      onClick={() => handleFilterChange(filterType)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                        filter === filterType
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
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
                cardBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  >
                    <BookingCard
                      booking={booking}
                      onReschedule={(id: string) => handleBookingAction(id, 'reschedule')}
                      onCancel={(id: string) => handleBookingAction(id, 'cancel')}
                      onContact={(id: string, method: 'message' | 'phone') => handleBookingAction(id, `contact-${method}`)}
                      onViewDetails={(id: string) => handleViewDetails(id)}
                      onRateProvider={handleRateProvider}
                      onPaymentSuccess={handlePaymentSuccess}
                      onReleasePayment={handleReleasePayment}
                      onSeenProvider={handleSeenProvider}
                    />
                  </div>
                ))
              )}
            </div>

            {/* Load More Button */}
            {cardBookings.length > 0 && (
              <div className="flex justify-center pt-8">
                <button 
                  onClick={fetchUserBookings}
                  className="bg-gray-50 text-gray-700 hover:text-blue-700 px-8 py-3 rounded-xl border border-gray-200 hover:border-blue-200 transition-all duration-300 flex items-center space-x-3 font-medium hover:shadow-sm"
                >
                  <span>Refresh Bookings</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
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
                  <strong>Current Date:</strong> {formatDate(selectedBooking.date)}<br />
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
                        : selectedBooking.status === 'cancelled'
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
                    {formatDate(selectedBooking.date)} at {selectedBooking.time}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Location</label>
                  <p className="text-sm font-medium text-gray-900">{selectedBooking.location}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Price</label>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedBooking.payment?.currency === 'GBP' ? '£' : '₦'}{selectedBooking.price}
                  </p>
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

                {selectedBooking.provider && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Provider Contact</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{selectedBooking.provider.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{selectedBooking.provider.email}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedBooking.rating && (
                  <div className="pt-4 border-t border-gray-200">
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
                    {(selectedBooking.status === 'pending' || selectedBooking.status === 'confirmed' || selectedBooking.status === 'upcoming') && (
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
                          setSelectedBookingForRating(selectedBooking);
                          setRatingModalOpen(true);
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

      {/* Rating Modal */}
      {ratingModalOpen && selectedBookingForRating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Rate Your Experience</h3>
              <button
                onClick={() => {
                  setRatingModalOpen(false);
                  setSelectedBookingForRating(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">How was your experience with {selectedBookingForRating.providerName}?</p>
              
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRateProvider(selectedBookingForRating._id, star)}
                    className="text-3xl transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (selectedBookingForRating.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setRatingModalOpen(false);
                  setSelectedBookingForRating(null);
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setRatingModalOpen(false);
                  setSelectedBookingForRating(null);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;