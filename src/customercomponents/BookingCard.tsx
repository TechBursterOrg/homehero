import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MoreVertical,
  MessageCircle,
  Phone,
  CheckCircle,
  XCircle,
  Edit3,
  Eye,
  AlertCircle,
  RefreshCw,
  Star,
  Shield,
  UserCheck,
  MapPin,
  CreditCard
} from 'lucide-react';

// Types
interface PaymentData {
  status: 'pending' | 'held' | 'confirmed' | 'released' | 'refunded' | 'failed' | 'requires_payment_method' | 'succeeded';
  amount: number;
  currency: string;
  processor: 'stripe' | 'paystack';
  heldAt?: string;
  confirmedAt?: string;
  releasedAt?: string;
  commission?: number;
  providerAmount?: number;
}

interface Booking {
  id: string;
  _id: string;
  serviceType: string;
  providerName: string;
  customerName: string;
  providerId: string;
  customerId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'accepted' | 'awaiting_payment' | 'in-progress' | 'completed' | 'cancelled';
  price: number;
  amount: number;
  location: string;
  description: string;
  specialRequests: string;
  rating?: number;
  ratingStatus?: {
    customerRated: boolean;
    providerRated: boolean;
  };
  payment?: PaymentData;
  autoRefundAt?: string;
  serviceConfirmedByCustomer?: boolean;
  serviceConfirmedAt?: string;
  provider?: {
    phoneNumber: string;
    email: string;
    profileImage?: string;
  };
}

interface BookingCardProps {
  booking: Booking;
  onReschedule: (bookingId: string) => void;
  onCancel: (bookingId: string) => void;
  onContact: (bookingId: string, type: 'message' | 'phone') => void;
  onViewDetails: (bookingId: string) => void;
  onRateProvider: (bookingId: string, rating: number, comment?: string) => void;
  onPaymentSuccess: (bookingId: string) => void;
  onReleasePayment: (bookingId: string) => void;
  onSeenProvider: (bookingId: string) => void;
  onAcceptBooking?: (bookingId: string) => void;
  onRetryPayment: (bookingId: string) => void; // Add this line
  userType?: 'customer' | 'provider';
}

// Payment Status Component
const PaymentStatus = ({ booking, onReleasePayment }: { booking: Booking; onReleasePayment: (bookingId: string) => void }) => {
  if (!booking.payment) return null;

  const getStatusConfig = (status: PaymentData['status']) => {
    const configs = {
      requires_payment_method: {
        icon: AlertCircle,
        color: 'orange',
        title: 'Payment Required',
        description: 'Please complete payment to confirm booking'
      },
      held: {
        icon: Shield,
        color: 'blue',
        title: 'Payment Held in Escrow',
        description: 'Funds are secured until service completion'
      },
      confirmed: {
        icon: CheckCircle,
        color: 'green',
        title: 'Payment Confirmed',
        description: 'Provider has accepted the booking'
      },
      released: {
        icon: CheckCircle,
        color: 'green',
        title: 'Payment Released',
        description: 'Funds transferred to provider'
      },
      refunded: {
        icon: RefreshCw,
        color: 'gray',
        title: 'Payment Refunded',
        description: 'Funds returned to your account'
      },
      failed: {
        icon: AlertCircle,
        color: 'red',
        title: 'Payment Failed',
        description: 'Please try again or contact support'
      },
      pending: {
        icon: Clock,
        color: 'yellow',
        title: 'Payment Pending',
        description: 'Waiting for payment confirmation'
      },
      succeeded: {
        icon: CheckCircle,
        color: 'green',
        title: 'Payment Successful',
        description: 'Payment completed successfully'
      }
    };

    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(booking.payment.status);
  const StatusIcon = statusConfig.icon;

  const calculateTimeRemaining = (autoRefundAt: string): string => {
    if (!autoRefundAt) return '';
    const now = new Date();
    const refundTime = new Date(autoRefundAt);
    const diffMs = refundTime.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours < 0 || diffMinutes < 0) return 'Expired';
    return `${diffHours}h ${diffMinutes}m`;
  };

  return (
    <div className={`bg-${statusConfig.color}-50 border border-${statusConfig.color}-200 rounded-lg p-3 mt-3`}>
      <div className="flex items-center gap-2">
        <StatusIcon className={`w-4 h-4 text-${statusConfig.color}-600`} />
        <div className="flex-1">
          <span className="text-sm font-medium text-gray-900">
            {statusConfig.title}
          </span>
          <p className="text-xs text-gray-600 mt-1">
            {statusConfig.description}
          </p>
          
          {booking.payment.status === 'held' && booking.autoRefundAt && (
            <p className="text-xs text-blue-600 mt-1">
              Auto-refund in {calculateTimeRemaining(booking.autoRefundAt)}
            </p>
          )}
          
          {booking.payment.status === 'confirmed' && booking.status === 'completed' && !booking.serviceConfirmedByCustomer && (
            <button
              onClick={() => onReleasePayment(booking.id)}
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
            >
              Release Payment to Provider
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Accept Booking Button (For Provider)
const AcceptBookingButton = ({ booking, onAccept, loading = false }: { 
  booking: Booking;
  onAccept: (bookingId: string) => void;
  loading: boolean;
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  if (showConfirmation) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800 mb-2">
          Accept this {booking.serviceType} booking from {booking.customerName}?
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setShowConfirmation(false)}
            disabled={loading}
            className="flex-1 px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onAccept(booking.id);
              setShowConfirmation(false);
            }}
            disabled={loading}
            className="flex-1 px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
          >
            {loading ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <CheckCircle className="w-3 h-3" />
            )}
            Confirm Accept
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirmation(true)}
      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
    >
      <CheckCircle className="w-4 h-4" />
      Accept Booking
    </button>
  );
};

// Main BookingCard Component
const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onReschedule,
  onCancel,
  onContact,
  onViewDetails,
  onRateProvider,
  onPaymentSuccess,
  onReleasePayment,
  onSeenProvider,
  onAcceptBooking,
  userType = 'customer'
}) => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showCallOptions, setShowCallOptions] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [seenProviderLoading, setSeenProviderLoading] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);

  const moreOptionsRef = useRef<HTMLDivElement>(null);
  const callOptionsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreOptionsRef.current && !moreOptionsRef.current.contains(event.target as Node)) {
        setShowMoreOptions(false);
      }
      if (callOptionsRef.current && !callOptionsRef.current.contains(event.target as Node)) {
        setShowCallOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper functions
  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'accepted': return <CheckCircle className="w-3 h-3" />;
      case 'awaiting_payment': return <CreditCard className="w-3 h-3" />;
      case 'confirmed': return <CheckCircle className="w-3 h-3" />;
      case 'in-progress': return <RefreshCw className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'cancelled': return <XCircle className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    const baseClasses = "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold";
    
    switch (status) {
      case 'pending': return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'accepted': return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'awaiting_payment': return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'confirmed': return `${baseClasses} bg-green-100 text-green-800`;
      case 'in-progress': return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'completed': return `${baseClasses} bg-green-100 text-green-800`;
      case 'cancelled': return `${baseClasses} bg-red-100 text-red-800`;
      default: return `${baseClasses} bg-gray-100 text-gray-600`;
    }
  };

  const getProviderInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const formatDateTime = (date: string, time: string) => {
    if (!date) return 'ASAP';
    try {
      const dateObj = new Date(`${date}T${time}`);
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return `${date} at ${time}`;
    }
  };

  const getCurrencySymbol = (currency: string = 'NGN') => {
    switch (currency) {
      case 'GBP': return '£';
      case 'USD': return '$';
      case 'NGN': return '₦';
      default: return '₦';
    }
  };

  const handleCallClick = () => {
    if (booking.provider?.phoneNumber) {
      window.location.href = `tel:${booking.provider.phoneNumber}`;
    } else {
      alert('Phone number not available');
    }
    setShowCallOptions(false);
  };

  const handleCopyNumber = async () => {
    if (booking.provider?.phoneNumber) {
      try {
        await navigator.clipboard.writeText(booking.provider.phoneNumber);
        alert('Phone number copied to clipboard!');
      } catch {
        prompt('Copy this phone number:', booking.provider.phoneNumber);
      }
    } else {
      alert('Phone number not available');
    }
    setShowCallOptions(false);
  };

  const handleSubmitRating = () => {
    if (rating > 0 && onRateProvider) {
      onRateProvider(booking.id, rating, comment);
      setShowRatingModal(false);
      setRating(0);
      setComment('');
    }
  };

  const handleSeenProvider = async () => {
    if (!onSeenProvider) return;
    
    setSeenProviderLoading(true);
    try {
      await onSeenProvider(booking.id);
    } catch (error) {
      console.error('Error confirming seen provider:', error);
    } finally {
      setSeenProviderLoading(false);
    }
  };

  const handleAcceptBooking = async () => {
    if (!onAcceptBooking) return;
    
    setAcceptLoading(true);
    try {
      await onAcceptBooking(booking.id);
    } catch (error) {
      console.error('Error accepting booking:', error);
    } finally {
      setAcceptLoading(false);
    }
  };

  // FIXED: Improved price calculation with better fallbacks
  const calculatePrice = (): number => {
    // First check payment amount
    if (booking.payment?.amount && booking.payment.amount > 0) {
      return booking.payment.amount;
    }
    // Then check booking price
    if (booking.price && booking.price > 0) {
      return booking.price;
    }
    // Then check booking amount
    if (booking.amount && booking.amount > 0) {
      return booking.amount;
    }
    // Default to 0 if no valid price found
    return 0;
  };

  // Check conditions for different buttons
  const isCustomer = userType === 'customer';
  const isProvider = userType === 'provider';

  const needsPayment = 
    isCustomer && 
    (booking.status === 'awaiting_payment' || 
     (booking.payment && booking.payment.status === 'requires_payment_method'));

  const canAcceptBooking = 
    isProvider && 
    booking.status === 'pending';

  const isRated = booking.ratingStatus?.customerRated || (booking.rating && booking.rating > 0) || false;
  
  const shouldShowSeenProvider = 
    isCustomer &&
    booking.status === 'completed' && 
    booking.payment?.status === 'confirmed' &&
    !booking.serviceConfirmedByCustomer &&
    onSeenProvider;

  // FIXED: Use the improved price calculation
  const price = calculatePrice();
  const currency = booking.payment?.currency || 'NGN';
  const currencySymbol = getCurrencySymbol(currency);

  // FIXED: Format price with commas for better readability
  const formattedPrice = price > 0 ? price.toLocaleString() : '0';

  // Debug logging to help identify the issue
  useEffect(() => {
    console.log('Booking data:', {
      id: booking.id,
      price: booking.price,
      amount: booking.amount,
      paymentAmount: booking.payment?.amount,
      calculatedPrice: price,
      status: booking.status
    });
  }, [booking]);

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 p-4 sm:p-6 overflow-hidden">
        {/* Mobile Layout */}
        <div className="flex flex-col sm:hidden space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {isCustomer ? getProviderInitials(booking.providerName) : 'C'}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900 truncate">
                    {booking.serviceType}
                  </h3>
                  <p className="text-sm text-gray-600 truncate mb-2">
                    {isCustomer ? booking.providerName : booking.customerName}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600 truncate">{booking.location}</span>
                  </div>
                  
                  <div className={getStatusBadge(booking.status)}>
                    {getStatusIcon(booking.status)}
                    <span>{booking.status.replace('_', ' ')}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <div className="relative" ref={moreOptionsRef}>
                    <button 
                      onClick={() => setShowMoreOptions(!showMoreOptions)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {showMoreOptions && (
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1 z-50 min-w-40">
                        <button
                          onClick={() => {
                            onViewDetails(booking.id);
                            setShowMoreOptions(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                          View Details
                        </button>
                        
                        {isCustomer && booking.status === 'completed' && !isRated && (
                          <button
                            onClick={() => setShowRatingModal(true)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
                          >
                            <Star className="w-4 h-4 text-yellow-500" />
                            Rate Provider
                          </button>
                        )}
                        
                        {isCustomer && (booking.status === 'pending' || booking.status === 'confirmed') && (
                          <>
                            <button
                              onClick={() => onReschedule(booking.id)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
                            >
                              <Edit3 className="w-4 h-4 text-green-600" />
                              Reschedule
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to cancel this booking?')) {
                                  onCancel(booking.id);
                                }
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 rounded flex items-center gap-2 text-red-600"
                            >
                              <XCircle className="w-4 h-4" />
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Date & Time with Price - FIXED */}
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-700">
                <Calendar className="w-4 h-4" />
                <span className="font-semibold text-sm">
                  {formatDateTime(booking.date, booking.time)}
                </span>
              </div>
              <div className="text-right">
                {/* FIXED: Price display with proper formatting */}
                <p className="text-lg font-bold text-emerald-600">
                  {currencySymbol}{formattedPrice}
                </p>
                <p className="text-xs text-gray-500">Total Amount</p>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          {booking.payment && (
            <PaymentStatus 
              booking={booking} 
              onReleasePayment={onReleasePayment}
            />
          )}

          {/* Provider Accept Button */}
          {canAcceptBooking && (
            <AcceptBookingButton 
              booking={booking}
              onAccept={handleAcceptBooking}
              loading={acceptLoading}
            />
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onContact(booking.id, 'message')}
                className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              
              <div className="relative" ref={callOptionsRef}>
                <button 
                  onClick={() => setShowCallOptions(!showCallOptions)}
                  className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-all duration-200"
                >
                  <Phone className="w-4 h-4" />
                </button>
                
                {showCallOptions && (
                  <div className="absolute left-0 bottom-full mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 min-w-44">
                    <button
                      onClick={handleCallClick}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4 text-green-600" />
                      <span>{isCustomer ? 'Call Provider' : 'Call Customer'}</span>
                    </button>
                    
                    <button
                      onClick={handleCopyNumber}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                      <span>Copy Number</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              {shouldShowSeenProvider && (
                <button
                  onClick={handleSeenProvider}
                  disabled={seenProviderLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm disabled:opacity-50 flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  {seenProviderLoading ? 'Confirming...' : 'Seen Provider'}
                </button>
              )}
              
              {needsPayment ? (
                <button
                  onClick={() => onPaymentSuccess(booking.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm"
                >
                  Pay {currencySymbol}{formattedPrice} to Confirm
                </button>
              ) : isCustomer && booking.status === 'pending' ? (
                <button
                  onClick={() => onReschedule(booking.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                >
                  Reschedule
                </button>
              ) : isCustomer && booking.status === 'completed' && !isRated ? (
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-semibold text-sm"
                >
                  Rate Provider
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {isCustomer ? getProviderInitials(booking.providerName) : 'C'}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {booking.serviceType}
                  </h3>
                  
                  <div className={getStatusBadge(booking.status)}>
                    {getStatusIcon(booking.status)}
                    <span>{booking.status.replace('_', ' ')}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-2">
                  {isCustomer ? booking.providerName : booking.customerName}
                </p>
                
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{booking.location}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-500">
                    {formatDateTime(booking.date, booking.time)}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                {/* FIXED: Price display in desktop */}
                <p className="text-2xl font-bold text-emerald-600">
                  {currencySymbol}{formattedPrice}
                </p>
                <p className="text-sm text-gray-500">Total Amount</p>
              </div>
            </div>

            {/* Payment Status for Desktop */}
            {booking.payment && (
              <PaymentStatus 
                booking={booking} 
                onReleasePayment={onReleasePayment}
              />
            )}

            {/* Provider Accept Button for Desktop */}
            {canAcceptBooking && (
              <div className="mb-4">
                <AcceptBookingButton 
                  booking={booking}
                  onAccept={handleAcceptBooking}
                  loading={acceptLoading}
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onContact(booking.id, 'message')}
                    className="p-3 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-all duration-200"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  
                  <div className="relative" ref={callOptionsRef}>
                    <button 
                      onClick={() => setShowCallOptions(!showCallOptions)}
                      className="p-3 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-all duration-200"
                    >
                      <Phone className="w-5 h-5" />
                    </button>
                    
                    {showCallOptions && (
                      <div className="absolute right-0 bottom-full mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 min-w-48">
                        <button
                          onClick={handleCallClick}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
                        >
                          <Phone className="w-4 h-4 text-green-600" />
                          <span>{isCustomer ? 'Call Provider' : 'Call Customer'}</span>
                        </button>
                        
                        <button
                          onClick={handleCopyNumber}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                          <span>Copy Number</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Desktop Action Buttons */}
              <div className="flex gap-3">
                {shouldShowSeenProvider && (
                  <button
                    onClick={handleSeenProvider}
                    disabled={seenProviderLoading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 flex items-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    {seenProviderLoading ? 'Confirming...' : 'Confirm Seen Provider'}
                  </button>
                )}
                
                {needsPayment ? (
                  <button
                    onClick={() => onPaymentSuccess(booking.id)}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Pay {currencySymbol}{formattedPrice} to Confirm
                  </button>
                ) : isCustomer && booking.status === 'pending' ? (
                  <button
                    onClick={() => onReschedule(booking.id)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Reschedule Booking
                  </button>
                ) : isCustomer && booking.status === 'completed' && !isRated ? (
                  <button
                    onClick={() => setShowRatingModal(true)}
                    className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
                  >
                    Rate Provider
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Rate Your Experience</h3>
              <button
                onClick={() => setShowRatingModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">How was your experience with {booking.providerName}?</p>
              
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="text-3xl transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience (optional)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={rating === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingCard;