import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, DollarSign, User, Mail, Phone, Star, Shield, Award, Loader, Lock } from 'lucide-react';

interface Provider {
  _id?: string;
  id: string;
  name: string;
  email: string;
  services: string[];
  hourlyRate: number;
  averageRating?: number;
  city: string;
  state: string;
  country: string;
  profileImage?: string;
  isAvailableNow: boolean;
  experience: string;
  distance?: number;
  phoneNumber?: string;
  address?: string;
  rating?: number;
  reviewCount?: number;
  location?: string;
  priceRange?: string;
  coordinates?: [number, number];
  responseTime?: string;
  isVerified?: boolean;
  isTopRated?: boolean;
  completedJobs?: number;
  avatar?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  provider: Provider;
  currentUser: {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    address?: string;
  };
  onClose: () => void;
  onConfirm: (bookingData: any) => Promise<void>;
  serviceType: 'immediate' | 'long-term';
  authToken?: string;
}

interface BookingFormData {
  serviceType: string;
  description: string;
  date: string;
  time: string;
  location: string;
  budget: string;
  contactPhone: string;
  contactEmail: string;
  specialRequests: string;
}

// API Base URL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? "https://backendhomeheroes.onrender.com" 
  : "http://localhost:3001";

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  provider,
  currentUser,
  onClose,
  onConfirm,
  serviceType,
  authToken
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const [formData, setFormData] = useState<BookingFormData>({
    serviceType: provider.services[0] || '',
    description: '',
    date: '',
    time: '',
    location: currentUser.address || '', // Customer's location
    budget: provider.priceRange || `₦${provider.hourlyRate || 0}`,
    contactPhone: currentUser.phoneNumber || '',
    contactEmail: currentUser.email || '',
    specialRequests: ''
  });

  if (!isOpen) return null;

  // Helper function to extract amount from budget string
  const extractAmountFromBudget = (budget: string): number => {
    if (!budget) return 1000; // default amount
    const numericString = budget.replace(/[^\d.]/g, '');
    return parseFloat(numericString) || 1000;
  };

  // Function to create booking and initialize payment
  const createBookingAndInitializePayment = async (bookingData: any) => {
    try {
      setIsSubmitting(true);
      setPaymentError(null);

      console.log('💰 Starting booking and payment process...');
      
      const token = authToken || localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Step 1: Create the booking first
      console.log('📦 Creating booking...', bookingData);
      
      const bookingResponse = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      // Log the raw response for debugging
      console.log('📋 Booking response status:', bookingResponse.status);
      console.log('📋 Booking response headers:', bookingResponse.headers);

      if (!bookingResponse.ok) {
        const errorText = await bookingResponse.text();
        console.error('❌ Booking creation failed:', errorText);
        let errorMessage = `Failed to create booking: ${bookingResponse.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If not JSON, use the text as is
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const bookingResult = await bookingResponse.json();
      
      console.log('🔍 Full booking response:', bookingResult);

      if (!bookingResult.success) {
        throw new Error(bookingResult.message || 'Failed to create booking');
      }

      // FIX: Handle different possible response structures
      const bookingId = bookingResult.data?.booking?._id || 
                       bookingResult.data?._id || 
                       bookingResult.booking?._id ||
                       bookingResult._id;

      console.log('✅ Booking created successfully. Booking ID:', bookingId);

      if (!bookingId) {
        console.error('❌ No booking ID found in response:', bookingResult);
        throw new Error('Booking created but no booking ID returned');
      }

      // Step 2: Initialize payment with Paystack
      console.log('💰 Initializing Paystack payment for booking:', bookingId);
      
      const paymentPayload = {
        bookingId: bookingId,
        amount: bookingData.amount || bookingData.price,
        email: currentUser.email,
        currency: 'NGN'
      };

      console.log('📦 Payment payload:', paymentPayload);

      const paymentResponse = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/create-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentPayload),
      });

      // Log payment response for debugging
      console.log('💰 Payment response status:', paymentResponse.status);

      if (!paymentResponse.ok) {
        const errorText = await paymentResponse.text();
        console.error('❌ Payment initialization failed:', errorText);
        let errorMessage = `Payment initialization failed: ${paymentResponse.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If not JSON, use the text as is
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const paymentResult = await paymentResponse.json();
      
      console.log('🔍 Full payment response:', paymentResult);

      if (!paymentResult.success) {
        throw new Error(paymentResult.message || 'Payment initialization failed');
      }

      // Extract authorization URL from the response
      const authorizationUrl = paymentResult.data?.authorizationUrl || 
                              paymentResult.authorizationUrl;

      console.log('🔗 Authorization URL:', authorizationUrl);

      if (!authorizationUrl) {
        console.error('❌ No authorization URL in response. Full response:', paymentResult);
        throw new Error('Payment service did not return a payment URL');
      }

      // Validate it's a proper Paystack URL
      if (!authorizationUrl.includes('checkout.paystack.com')) {
        console.error('❌ Invalid Paystack URL:', authorizationUrl);
        throw new Error('Invalid payment URL received');
      }

      // Step 3: Immediately redirect to Paystack
      console.log('🔗 Immediately redirecting to Paystack payment page...');
      
      // Close the modal first
      onClose();
      
      // Immediately redirect to Paystack
      window.location.href = authorizationUrl;

    } catch (error) {
      console.error('❌ Booking and payment error:', error);
      setPaymentError(error instanceof Error ? error.message : 'Failed to process booking and payment');
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use customer's location (where service will be performed)
    const serviceLocation = formData.location || currentUser.address || 'Location not specified';
    
    const bookingData = {
      providerId: provider._id || provider.id, // Handle both _id and id
      providerName: provider.name,
      providerEmail: provider.email,
      serviceType: formData.serviceType,
      description: formData.description,
      location: serviceLocation, // Customer's location where service happens
      timeframe: serviceType === 'immediate' ? 'ASAP' : formData.date ? `${formData.date} at ${formData.time}` : 'Flexible',
      budget: formData.budget,
      contactInfo: {
        phone: formData.contactPhone,
        email: formData.contactEmail,
        name: currentUser.name
      },
      specialRequests: formData.specialRequests,
      bookingType: serviceType,
      requestedAt: new Date().toISOString(),
      amount: extractAmountFromBudget(formData.budget),
      price: extractAmountFromBudget(formData.budget),
      status: 'awaiting_payment'
    };
    
    console.log('📝 Booking data prepared:', bookingData);
    
    // Start the booking and payment process immediately
    await createBookingAndInitializePayment(bookingData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 transition-colors ${
          i < Math.floor(rating) ? 'text-amber-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const rating = provider.averageRating || provider.rating || 4.5;
  const reviewCount = provider.reviewCount || 0;
  const providerLocation = provider.location || provider.address || `${provider.city}, ${provider.state}`;
  const amount = extractAmountFromBudget(formData.budget);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-200/50 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              Book {provider.name}
            </h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Provider Info Card */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
              {provider.profileImage ? (
                <img 
                  src={provider.profileImage} 
                  alt={provider.name}
                  className="w-16 h-16 rounded-2xl object-cover"
                />
              ) : (
                provider.avatar || getInitials(provider.name)
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-white">{provider.name}</h3>
                {provider.isVerified && (
                  <Shield className="w-4 h-4 text-blue-200" />
                )}
                {provider.isTopRated && (
                  <Award className="w-4 h-4 text-amber-300" />
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  {renderStars(rating)}
                </div>
                <span className="text-sm font-medium text-white">{rating.toFixed(1)}</span>
                <span className="text-sm text-white/70">({reviewCount} reviews)</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-white/80">
                <span>{providerLocation}</span>
                <span>{provider.experience}</span>
                {provider.isAvailableNow && serviceType === 'immediate' && (
                  <span className="bg-emerald-500/30 text-emerald-200 px-2 py-1 rounded-lg text-xs font-medium">
                    Available Now
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="max-h-[60vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Error Display */}
              {paymentError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-800">
                    <X className="w-4 h-4" />
                    <span className="font-medium">Payment Error</span>
                  </div>
                  <p className="text-red-600 text-sm mt-1">{paymentError}</p>
                  <button
                    type="button"
                    onClick={() => setPaymentError(null)}
                    className="text-red-600 text-sm underline mt-2"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Escrow Explanation */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Secure Escrow Payment</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div className="flex items-start gap-2">
                        <span className="font-medium">1.</span>
                        <span>Pay now - funds held securely in escrow</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium">2.</span>
                        <span>Provider accepts & travels to you</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium">3.</span>
                        <span>Confirm "Hero Here" when provider arrives</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium">4.</span>
                        <span>Payment released: 85% to provider, 15% service fee</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Service Type *
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  required
                  disabled={isSubmitting}
                >
                  {provider.services.map((service, index) => (
                    <option key={index} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what you need help with..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm resize-none"
                  disabled={isSubmitting}
                />
              </div>

              {serviceType === 'long-term' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Preferred Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              )}

              {/* Location - CUSTOMER'S LOCATION where service will be performed */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Service Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter your address where service is needed"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Service will be performed at this location
                </p>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Budget Range
                </label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="e.g., ₦5,000 - ₦10,000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  disabled={isSubmitting}
                />
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={currentUser.name}
                      disabled
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/80 backdrop-blur-sm text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={currentUser.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/80 backdrop-blur-sm text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Special Requests or Notes
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  placeholder="Any special requirements, tools needed, or additional information..."
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm resize-none"
                  disabled={isSubmitting}
                />
              </div>
              <div className="bg-gray-50/80 backdrop-blur-sm border-t border-gray-200/50 p-6 mt-auto">
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-3 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:scale-105 transition-all duration-300 font-semibold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 min-w-[200px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Redirecting to Paystack...
                  </>
                ) : (
                  `Pay ₦${amount.toLocaleString()} to Book`
                )}
              </button>
            </div>
            
            {/* Payment Processing Info */}
            {isSubmitting && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  You will be redirected to Paystack to complete your payment securely.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  After payment, you'll be redirected back to your bookings page.
                </p>
              </div>
            )}
          </div>

              {/* Booking Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Booking Summary</h3>
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">{formData.serviceType || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium capitalize">{serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Provider:</span>
                    <span className="font-medium">{provider.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-medium text-right max-w-[150px] truncate">{formData.location || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount to pay:</span>
                    <span className="font-bold text-green-600">
                      ₦{amount.toLocaleString()}
                    </span>
                  </div>
                  {serviceType === 'immediate' && (
                    <div className="flex justify-between">
                      <span>Availability:</span>
                      <span className="font-medium text-emerald-600">Available Now</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          
        </form>
      </div>
    </div>
  );
};

export default BookingModal;