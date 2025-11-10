import React, { useState, useEffect } from 'react';
import { Calendar, Star, ArrowRight, Plus, X, Phone, Mail, Lock, Shield, CheckCircle, AlertCircle, CreditCard } from 'lucide-react';
import BookingCard from '../customercomponents/BookingCard';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

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

interface PaymentData {
  processor: 'stripe' | 'paystack';
  amount: number;
  clientSecret?: string;
  authorizationUrl?: string;
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

// Payment Form Component
const PaymentForm: React.FC<{
  booking: ApiBooking;
  paymentData: PaymentData;
  clientSecret: string;
  onSuccess: () => void;
  onClose: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}> = ({ booking, paymentData, onSuccess, onClose, loading, setLoading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [cardComplete, setCardComplete] = useState(false);

  const handlePayment = async (bookingId:any) => {
  try {
    console.log('Starting payment for booking:', bookingId);
    
    const token = localStorage.getItem('authToken');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    // Step 1: Create payment intent
    const response = await fetch(`/api/bookings/${bookingId}/create-payment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 10000, // Your amount
        customerCountry: userData.country || 'NG'
      }),
    });

    const result = await response.json();
    console.log('Payment creation response:', result);

    if (!result.success) {
      throw new Error(result.message || 'Payment creation failed');
    }

    // Step 2: Handle Paystack redirect
    if (result.data.processor === 'paystack' && result.data.authorizationUrl) {
      console.log('Redirecting to Paystack:', result.data.authorizationUrl);
      
      // Validate the URL before redirecting
      if (result.data.authorizationUrl.includes('checkout.paystack.com')) {
        window.location.href = result.data.authorizationUrl;
      } else {
        throw new Error('Invalid Paystack URL received');
      }
    } else {
      throw new Error('No payment URL received from server');
    }

  } catch (error) {
    console.error('Payment error:', error);
    alert('Payment failed: ');
  }
};


  const handleCardChange = (event: any) => {
    setCardComplete(event.complete);
    if (event.error) {
      setError(event.error.message);
    } else {
      setError('');
    }
  };

  // For Paystack - redirect to their payment page
  const handlePaystackPayment = () => {
    if (paymentData.authorizationUrl) {
      console.log('🔗 Redirecting to Paystack:', paymentData.authorizationUrl);
      // This should redirect to Paystack's payment page
      window.location.href = paymentData.authorizationUrl;
    } else {
      setError('Paystack payment URL not available');
      console.error('❌ No authorization URL provided by Paystack');
    }
  };

  // Render different payment forms based on processor
  if (paymentData.processor === 'paystack') {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-900 mb-1">Paystack Payment</h4>
              <p className="text-sm text-green-700">
                You'll be redirected to Paystack for secure payment processing.
              </p>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Total Amount</span>
            <span className="text-2xl font-bold text-gray-900">
              ₦{paymentData.amount}
            </span>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> You will be redirected to Paystack to complete your payment securely.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 text-red-600 inline mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePaystackPayment}
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Pay ₦{paymentData.amount} with Paystack
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Stripe payment form
  return (
    <div className="space-y-6">
      {/* Development mode notice */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-yellow-600" />
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">Development Mode</h4>
              <p className="text-sm text-yellow-700">
                Use test card: 4242 4242 4242 4242 | Any future expiry | Any 3 digits
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Card Input */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Total Amount</span>
          <span className="text-2xl font-bold text-gray-900">
            ${paymentData.amount}
          </span>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Information
            </label>
            <div className="border border-gray-300 rounded-lg p-3 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                      fontFamily: 'system-ui, sans-serif',
                    },
                  },
                  hidePostalCode: true,
                }}
                onChange={handleCardChange}
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Lock className="w-3 h-3" />
            <span>Your payment details are secured and encrypted</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 text-red-600 inline mr-2" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          onClick={onClose}
          disabled={loading}
          className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handlePayment}
          disabled={!stripe || !cardComplete || loading}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Pay ${paymentData.amount}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Payment Details Component
const PaymentDetails: React.FC<{
  booking: ApiBooking;
  onNext: () => void;
  loading: boolean;
}> = ({ booking, onNext, loading }) => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Secure Payment</h4>
            <p className="text-sm text-blue-700">
              Your payment is processed securely. Funds are held until service completion.
            </p>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Booking Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Service:</span>
            <span className="font-medium">{booking.serviceType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Provider:</span>
            <span className="font-medium">{booking.providerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium text-lg text-green-600">
              {typeof booking.price === 'string' ? booking.price : `₦${booking.price}`}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onNext}
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Initializing...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Proceed to Payment
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Payment Success Component
const PaymentSuccess: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          Payment Successful!
        </h4>
        <p className="text-gray-600">
          Your payment has been processed successfully. Your booking is now confirmed.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 text-left">
        <h5 className="font-semibold text-gray-900 mb-2">What happens next?</h5>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Your booking is now confirmed</li>
          <li>• The provider will contact you to schedule the service</li>
          <li>• You'll receive service reminders</li>
          <li>• Payment is secured until service completion</li>
        </ul>
      </div>

      <button
        onClick={onClose}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
      >
        Close
      </button>
    </div>
  );
};

// Retry Payment Handler
const handleRetryPayment = async (bookingId: string) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/retry-payment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    
    if (result.success) {
      // Redirect to Paystack
      window.location.href = result.data.authorizationUrl;
    } else {
      alert('Failed to retry payment: ' + result.message);
    }
  } catch (error) {
    console.error('Retry payment error:', error);
    alert('Error retrying payment');
  }
};

// Main BookingsPage Component
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

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<ApiBooking | null>(null);
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment' | 'success'>('details');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

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

  // Payment Success Handler
  const handlePaymentSuccess = async (bookingId: any) => {
    console.log('💰 Payment successful for booking:', bookingId);
    
    try {
      // Refresh bookings to show updated status
      await fetchUserBookings();
      
      // Close payment modal
      setShowPaymentModal(false);
      setSelectedBookingForPayment(null);
      setPaymentStep('details');
      setPaymentData(null);
      
      // Show success message
      alert('Payment completed successfully! Your booking is now confirmed.');
      
    } catch (error) {
      console.error('❌ Error handling payment success:', error);
    }
  };

  // Payment Button Click Handler
 const handlePaymentButtonClick = async (bookingId: string) => {
  console.log('🔄 Starting payment process for booking:', bookingId);
  
  const booking = bookings.find(b => b._id === bookingId);
  if (booking) {
    try {
      setPaymentLoading(true);
      
      const paymentResult = await initializePayment(booking);
      console.log('💰 Payment initialization result:', paymentResult);
      
      if (paymentResult.processor === 'paystack' && paymentResult.authorizationUrl) {
        console.log('🔗 Valid Paystack URL found, redirecting...');
        
        // CRITICAL: Validate URL before redirect
        if (paymentResult.authorizationUrl.includes('checkout.paystack.com')) {
          console.log('✅ Redirecting to Paystack payment page');
          window.location.href = paymentResult.authorizationUrl;
        } else {
          throw new Error('Invalid Paystack payment URL');
        }
      } else {
        throw new Error('No valid payment URL received');
      }
    } catch (error) {
      console.error('❌ Payment initialization error:', error);
      alert('Failed to initialize payment: ' );
    } finally {
      setPaymentLoading(false);
    }
  }
};



  // Retry Payment Handler
  const handleRetryPaymentClick = async (bookingId: string) => {
  console.log('🔄 Retrying payment for booking:', bookingId);
  
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/retry-payment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    
    if (result.success && result.data.authorizationUrl) {
      // VALIDATE URL BEFORE REDIRECTING
      const authUrl = result.data.authorizationUrl;
      console.log('🔗 Redirecting to Paystack:', authUrl);
      
      if (!authUrl.includes('checkout.paystack.com')) {
        console.error('❌ INVALID Paystack URL:', authUrl);
        alert('Invalid payment URL. Please try again.');
        return;
      }
      
      // Redirect to Paystack
      window.location.href = authUrl;
    } else {
      alert('Failed to retry payment: ' + (result.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('❌ Retry payment error:', error);
    alert('Error retrying payment. Please try again.');
  }
};


  type CountryCode = 'NG' | 'GB' | 'US';

  const getCountryCode = (countryName: string): CountryCode => {
    const countryMap: Record<string, CountryCode> = {
      'nigeria': 'NG',
      'ng': 'NG',
      'united kingdom': 'GB',
      'uk': 'GB',
      'gb': 'GB',
      'united states': 'US',
      'usa': 'US',
      'us': 'US'
    };
    
    return countryMap[countryName?.toLowerCase()] || 'NG';
  };

const initializePayment = async (booking: ApiBooking) => {
  try {
    console.log('💰 Starting payment for booking:', booking._id);
    
    const token = localStorage.getItem('authToken');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    // TEMPORARY: Use debug endpoint to see what's happening
    const payload = {
      bookingId: booking._id,
      amount: booking.price || booking.amount
    };

    console.log('📦 Payment payload:', payload);

    // TEMPORARY: Use debug endpoint
    const response = await fetch(`${API_BASE_URL}/api/debug/check-payment-response`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    
    console.log('🔍 Full payment response:', result);
    
    if (!response.ok) {
      throw new Error(result.message || `HTTP error! status: ${response.status}`);
    }

    // Extract authorization URL from the response
    const authorizationUrl = result.data?.authorizationUrl;

    console.log('🔗 Authorization URL:', authorizationUrl);

    if (!authorizationUrl) {
      console.error('❌ No authorization URL in response. Full response:', result);
      throw new Error('Payment service did not return a payment URL');
    }

    // Validate it's a proper Paystack URL
    if (!authorizationUrl.includes('checkout.paystack.com')) {
      console.error('❌ Invalid Paystack URL:', authorizationUrl);
      throw new Error('Invalid payment URL received');
    }

    return {
      processor: 'paystack',
      authorizationUrl: authorizationUrl,
      amount: payload.amount
    };

  } catch (error) {
    console.error('❌ Payment initialization failed:', error);
    throw error;
  }
};





  // New function to get existing payment URL
  const getExistingPaymentUrl = async (bookingId: string) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/payment-url`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get payment URL');
    }

    const result = await response.json();
    
    if (result.success && result.data.authorizationUrl) {
      console.log('🔗 Found existing Paystack payment URL');
      return result.data.authorizationUrl;
    }
    
    throw new Error('No payment URL found');

  } catch (error) {
    console.error('❌ Failed to get existing payment URL:', error);
    throw error;
  }
};

const testPaystackDirectly = async () => {
  try {
    const response = await fetch('/api/debug/paystack-raw-response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        amount: 10000, // 100 NGN
        email: 'petervj2019@gmail.com'
      })
    });
    
    const result = await response.json();
    console.log('Paystack test result:', result);
    
    if (result.data.authorization_url) {
      // Redirect to Paystack
      window.location.href = result.data.authorization_url;
    }
  } catch (error) {
    console.error('Paystack test failed:', error);
  }
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
        case 'payment':
          handlePaymentButtonClick(bookingId);
          return;
        case 'retry-payment':
          handleRetryPaymentClick(bookingId);
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
                      onPaymentSuccess={handlePaymentButtonClick}
                      onRetryPayment={handleRetryPaymentClick}
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

      {/* Payment Modal */}
      {showPaymentModal && selectedBookingForPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {paymentStep === 'details' && 'Complete Payment'}
                  {paymentStep === 'payment' && 'Enter Card Details'}
                  {paymentStep === 'success' && 'Payment Successful'}
                </h3>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedBookingForPayment(null);
                    setPaymentStep('details');
                    setPaymentData(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={paymentLoading}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {paymentStep === 'details' && (
                <PaymentDetails 
                  booking={selectedBookingForPayment}
                  onNext={() => initializePayment(selectedBookingForPayment)}
                  loading={paymentLoading}
                />
              )}

              {paymentStep === 'payment' && paymentData && (
                <Elements stripe={stripePromise}>
                  <PaymentForm 
                    booking={selectedBookingForPayment}
                    paymentData={paymentData}
                    clientSecret=""
                    onSuccess={() => {
                      setPaymentStep('success');
                      setTimeout(() => {
                        handlePaymentSuccess(selectedBookingForPayment._id);
                      }, 2000);
                    }}
                    onClose={() => {
                      setShowPaymentModal(false);
                      setSelectedBookingForPayment(null);
                      setPaymentStep('details');
                      setPaymentData(null);
                    }}
                    loading={paymentLoading}
                    setLoading={setPaymentLoading}
                  />
                </Elements>
              )}

              {paymentStep === 'success' && (
                <PaymentSuccess 
                  onClose={() => {
                    setShowPaymentModal(false);
                    setSelectedBookingForPayment(null);
                    setPaymentStep('details');
                    setPaymentData(null);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;