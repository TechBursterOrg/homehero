// PaymentStatusPage.tsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, DollarSign, Shield } from 'lucide-react';

// Types
interface BookingDetails {
  amount: number;
  price?: number;
  serviceType: string;
  providerName: string;
  // Add other booking properties as needed
}

interface PaymentBreakdown {
  total: number;
  commission: number;
  providerAmount: number;
}

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? "https://backendhomeheroes.onrender.com" 
  : "http://localhost:3001";

const PaymentStatusPage = () => {
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const bookingId = queryParams.get('bookingId');
    const processor = queryParams.get('processor');
    const reference = queryParams.get('reference');
    const trxref = queryParams.get('trxref');

    if (bookingId) {
      verifyPayment(bookingId, reference || trxref, processor);
    }
  }, [location]);

  const verifyPayment = async (bookingId: string, reference: string | null, processor: string | null) => {
    try {
      if (!reference) {
        setPaymentStatus('failed');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/payments/verify-paystack`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          reference,
          bookingId
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setPaymentStatus('success');
        setBookingDetails(result.data.booking);
        
        // Redirect to customer home after 3 seconds
        setTimeout(() => {
          navigate('/customer');
        }, 3000);
      } else {
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setPaymentStatus('failed');
    }
  };

  const calculateBreakdown = (amount: number): PaymentBreakdown => {
    const commission = amount * 0.20;
    const providerAmount = amount * 0.80;
    
    return {
      total: amount,
      commission,
      providerAmount
    };
  };

  if (paymentStatus === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <Clock className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h2>
          <p className="text-gray-600">We're verifying your payment details...</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
          <p className="text-gray-600 mb-6">There was an issue processing your payment.</p>
          <button
            onClick={() => navigate('/customer')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const amount = bookingDetails?.amount || bookingDetails?.price || 0;
  const breakdown = calculateBreakdown(amount);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        {/* Success Header */}
        <div className="bg-white rounded-2xl p-6 text-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your payment has been processed successfully</p>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Payment Breakdown
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-semibold text-lg">₦{breakdown.total.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Platform Commission (20%):</span>
              <span className="font-semibold text-amber-600">₦{breakdown.commission.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Provider Receives:</span>
              <span className="font-semibold text-green-600">₦{breakdown.providerAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            How Payment Works
          </h2>
          
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                1
              </div>
              <p>Your payment is held securely in escrow until service completion</p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                2
              </div>
              <p>After service completion, confirm you're satisfied with the work</p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                3
              </div>
              <p>We release payment to the provider (minus 20% platform fee)</p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => navigate('/customer')}
          className="w-full bg-green-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-green-700 transition-colors"
        >
          Continue to Home
        </button>

        <p className="text-center text-gray-500 text-sm mt-4">
          Redirecting automatically in 3 seconds...
        </p>
      </div>
    </div>
  );
};

export default PaymentStatusPage;