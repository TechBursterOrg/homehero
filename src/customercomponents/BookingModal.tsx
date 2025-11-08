import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, DollarSign, User, Mail, Phone, Star, Shield, Award } from 'lucide-react';

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

// Add PaymentModal component interface (you'll need to implement this)
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentData: any) => Promise<void>;
  amount: number;
  currency: string;
  bookingData: any;
  user: any;
}

// Mock PaymentModal component - you'll need to implement this properly
const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  amount, 
  currency, 
  bookingData, 
  user 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      await onConfirm({ 
        paymentMethod: 'card', 
        transactionId: 'txn_' + Math.random().toString(36).substr(2, 9) 
      });
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Complete Payment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Amount to pay:</span>
              <span className="text-2xl font-bold text-green-600">
                {currency === 'NGN' ? '₦' : '$'}{amount.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-500">For booking with {bookingData.providerName}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing Payment...' : `Pay ${currency === 'NGN' ? '₦' : '$${amount.toLocaleString()}'}`}
            </button>
            
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [formData, setFormData] = useState<BookingFormData>({
    serviceType: provider.services[0] || '',
    description: '',
    date: '',
    time: '',
    location: currentUser.address || '',
    budget: provider.priceRange || `₦${provider.hourlyRate || 0}`,
    contactPhone: currentUser.phoneNumber || '',
    contactEmail: currentUser.email || '',
    specialRequests: ''
  });

  if (!isOpen) return null;

  // Replace the current submit handler with this:
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowPaymentModal(true);
  };

  // Add this new function to handle payment confirmation
  const handlePaymentConfirm = async (paymentData: any) => {
    setIsProcessingPayment(true);
    
    try {
      const bookingData = {
        providerId: provider._id || provider.id,
        providerName: provider.name,
        providerEmail: provider.email,
        serviceType: formData.serviceType,
        description: formData.description,
        location: formData.location,
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
        // Add payment amount
        amount: extractAmountFromBudget(formData.budget),
        price: extractAmountFromBudget(formData.budget),
        paymentData: paymentData // Include payment details
      };
      
      await onConfirm(bookingData);
      
      // Show success message
      alert('Booking request sent! The provider has been notified by email.');
      
      onClose();
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to submit booking. Please try again.');
    } finally {
      setIsProcessingPayment(false);
      setShowPaymentModal(false);
    }
  };

  // Helper function to extract amount from budget string
  const extractAmountFromBudget = (budget: string): number => {
    if (!budget) return 1000; // default amount
    const numericString = budget.replace(/[^\d.]/g, '');
    return parseFloat(numericString) || 1000;
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
  const locationText = provider.location || `${provider.city}, ${provider.state}`;

  return (
    <>
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
                className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
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
                  <span>{locationText}</span>
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
                      />
                    </div>
                  </div>
                )}

                {/* Location */}
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
                    placeholder="Enter the address where service is needed"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                    required
                  />
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
                    />
                  </div>
                </div>
                 <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting || isProcessingPayment}
                  className="px-6 py-3 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isProcessingPayment}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:scale-105 transition-all duration-300 font-semibold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting || isProcessingPayment ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    `Pay ₦${formData.budget ? extractAmountFromBudget(formData.budget).toLocaleString() : '1,000'} to Confirm`
                  )}
                </button>
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
                  />
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
                      <span>Amount to pay:</span>
                      <span className="font-bold text-green-600">
                        ₦{extractAmountFromBudget(formData.budget).toLocaleString()}
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
            <div className="bg-gray-50/80 backdrop-blur-sm border-t border-gray-200/50 p-6 mt-auto">
             
            </div>
          </form>
        </div>
      </div>

      {/* Add the PaymentModal component */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onConfirm={handlePaymentConfirm}
          amount={extractAmountFromBudget(formData.budget)}
          currency="NGN"
          bookingData={{
            providerId: provider._id || provider.id,
            providerName: provider.name,
            serviceType: formData.serviceType,
            customerName: currentUser.name,
            customerEmail: currentUser.email,
            customerCountry: 'NG'
          }}
          user={currentUser}
        />
      )}
    </>
  );
};

export default BookingModal;