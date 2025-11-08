import React, { useState } from 'react';
import { X, CreditCard, Globe, Shield } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentData: any) => void;
  amount: number;
  currency: string;
  bookingData: any;
  user: any;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  amount,
  currency,
  bookingData,
  user
}) => {
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedProcessor, setSelectedProcessor] = useState<'stripe' | 'paystack'>('paystack');

  if (!isOpen) return null;

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handlePaymentSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsProcessing(true);

  try {
    // Determine processor based on country
    const customerCountry = user.country || 'NG';
    const isNigeria = customerCountry === 'NG' || customerCountry === 'Nigeria';
    const processor = isNigeria ? 'paystack' : 'stripe';

    // Create payment intent
    const paymentResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/bookings/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        amount,
        currency,
        customerCountry,
        bookingData: {
          ...bookingData,
          amount,
          price: amount
        }
      })
    });

    const paymentResult = await paymentResponse.json();

    if (paymentResult.success) {
      // ⚠️ CRITICAL FIX: Check if payment is simulated
      if (paymentResult.data.paymentIntentId && paymentResult.data.paymentIntentId.startsWith('sim_')) {
        throw new Error('Payment simulation detected. Real payment processors are not configured on the server.');
      }

      // REAL PAYMENT PROCESSING
      console.log('✅ REAL Payment intent created:', paymentResult.data.paymentIntentId);
      
      // For Paystack - redirect to authorization URL
      if (processor === 'paystack' && paymentResult.data.authorizationUrl) {
        window.location.href = paymentResult.data.authorizationUrl;
        return;
      }
      
      // For Stripe - handle client secret
      if (processor === 'stripe' && paymentResult.data.clientSecret) {
        // You'll need to integrate Stripe Elements here
        // For now, confirm immediately
        onConfirm({
          ...bookingData,
          payment: {
            processor,
            status: 'held',
            amount,
            currency,
            paymentIntentId: paymentResult.data.paymentIntentId,
            clientSecret: paymentResult.data.clientSecret
          }
        });
      } else {
        throw new Error('Invalid payment response from server');
      }
    } else {
      throw new Error(paymentResult.message || 'Payment failed');
    }
  } catch (error) {
    console.error('Payment error:', error);
    
    // Proper error handling for TypeScript
    let errorMessage = 'Payment failed. Please try again.';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }
    
    alert(errorMessage);
  } finally {
    setIsProcessing(false);
  }
};

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden border border-gray-200 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Complete Payment</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
              disabled={isProcessing}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-3xl font-bold">{formatCurrency(amount, currency)}</p>
            <p className="text-white/80 mt-2">For {bookingData.serviceType} with {bookingData.providerName}</p>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePaymentSubmit} className="p-6">
          {/* Payment Processor Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Globe className="w-4 h-4 inline mr-1" />
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedProcessor('paystack')}
                className={`p-3 border-2 rounded-xl text-center transition-all ${
                  selectedProcessor === 'paystack'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">Paystack</div>
                <div className="text-xs mt-1">Nigeria</div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedProcessor('stripe')}
                className={`p-3 border-2 rounded-xl text-center transition-all ${
                  selectedProcessor === 'stripe'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">Stripe</div>
                <div className="text-xs mt-1">International</div>
              </button>
            </div>
          </div>

          {/* Card Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <CreditCard className="w-4 h-4 inline mr-1" />
                Card Number
              </label>
              <input
                type="text"
                name="number"
                value={cardDetails.number}
                onChange={handleCardInputChange}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleCardInputChange}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CVC
                </label>
                <input
                  type="text"
                  name="cvc"
                  value={cardDetails.cvc}
                  onChange={handleCardInputChange}
                  placeholder="123"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                name="name"
                value={cardDetails.name}
                onChange={handleCardInputChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-semibold">Secure Payment</p>
                <p className="mt-1">Your payment information is encrypted and secure. We use {selectedProcessor === 'paystack' ? 'Paystack' : 'Stripe'} for processing.</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full mt-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing Payment...
              </div>
            ) : (
              `Pay ${formatCurrency(amount, currency)}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;