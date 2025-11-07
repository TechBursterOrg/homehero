import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { X, Lock, Shield, CheckCircle, AlertCircle, CreditCard } from 'lucide-react';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  booking, 
  onPaymentSuccess 
}) => {
  const [step, setStep] = useState('details');
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    if (isOpen && booking) {
      fetchPaymentIntent();
    }
  }, [isOpen, booking]);

  const fetchPaymentIntent = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/bookings/${booking.id}/create-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        setClientSecret(result.data.payment.clientSecret);
        setPaymentStatus(result.data.payment.status);
      }
    } catch (error) {
      console.error('Error fetching payment intent:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {step === 'details' && 'Complete Payment'}
              {step === 'payment' && 'Secure Payment'}
              {step === 'success' && 'Payment Successful'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {step === 'details' && (
            <PaymentDetails 
              booking={booking}
              onNext={() => setStep('payment')}
            />
          )}

          {step === 'payment' && clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm 
                booking={booking}
                onSuccess={() => {
                  setStep('success');
                  onPaymentSuccess(booking.id);
                }}
                onBack={() => setStep('details')}
                loading={loading}
                setLoading={setLoading}
              />
            </Elements>
          )}

          {step === 'success' && (
            <PaymentSuccess 
              booking={booking}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const PaymentDetails = ({ booking, onNext }) => {
  const price = typeof booking.price === 'string' 
    ? parseInt(booking.price.replace(/[^\d]/g, '')) 
    : booking.price || 0;

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
            <span className="font-medium">{booking.service}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Provider:</span>
            <span className="font-medium">{booking.provider}</span>
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
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4" />
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

const PaymentForm = ({ booking, onSuccess, onBack, loading, setLoading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const isDevelopment = process.env.NODE_ENV === 'development';

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      if (!stripe || !elements) {
        throw new Error('Stripe not loaded');
      }

      const cardElement = elements.getElement(CardElement);

      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      // Confirm payment with the backend
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/bookings/${booking.id}/confirm-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          bookingId: booking.id
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Payment failed');
      }

      // Confirm card payment
      const { error: confirmError } = await stripe.confirmCardPayment(
        result.data.clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      onSuccess();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Development mode notice */}
      {isDevelopment && (
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

      {/* Real Card Input */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Total Amount</span>
          <span className="text-2xl font-bold text-gray-900">
            {typeof booking.price === 'string' ? booking.price : `₦${booking.price}`}
          </span>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Information
            </label>
            <div className="border border-gray-300 rounded-lg p-3 bg-white">
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
          onClick={onBack}
          disabled={loading}
          className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handlePayment}
          disabled={!stripe || loading}
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
              Pay {typeof booking.price === 'string' ? booking.price : `₦${booking.price}`}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const PaymentSuccess = ({ booking, onClose }) => {
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

export default PaymentModal;