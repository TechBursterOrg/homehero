import { Shield, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface Payment {
  status: 'held' | 'confirmed' | 'released' | 'refunded' | 'failed';
  amount: number;
  commission?: number;
  providerAmount?: number;
  heldAt: string;
}

interface Booking {
  id: string;
  status: string;
  payment: Payment;
  autoRefundAt?: string;
}

interface PaymentStatusProps {
  booking: Booking;
  onReleasePayment: (bookingId: string) => void;
}

type PaymentStatus = 'held' | 'confirmed' | 'released' | 'refunded' | 'failed';

const PaymentStatus = ({ booking, onReleasePayment }: PaymentStatusProps) => {
  const { payment } = booking;

  if (!payment) return null;

  const getStatusConfig = (status: PaymentStatus) => {
    const configs = {
      held: {
        icon: Shield,
        color: 'blue',
        title: 'Payment Held in Escrow',
        description: 'Funds are secured until service completion',
        action: null
      },
      confirmed: {
        icon: CheckCircle,
        color: 'green',
        title: 'Payment Confirmed',
        description: 'Provider has accepted the booking',
        action: null
      },
      released: {
        icon: CheckCircle,
        color: 'green',
        title: 'Payment Released',
        description: 'Funds transferred to provider',
        action: null
      },
      refunded: {
        icon: RefreshCw,
        color: 'gray',
        title: 'Payment Refunded',
        description: 'Funds returned to your account',
        action: null
      },
      failed: {
        icon: AlertCircle,
        color: 'red',
        title: 'Payment Failed',
        description: 'Please try again or contact support',
        action: 'retry'
      }
    };

    return configs[status] || configs.held;
  };

  const statusConfig = getStatusConfig(payment.status);
  const StatusIcon = statusConfig.icon;
  const colorClass = `text-${statusConfig.color}-600 bg-${statusConfig.color}-50 border-${statusConfig.color}-200`;

  return (
    <div className={`border rounded-lg p-4 ${colorClass}`}>
      <div className="flex items-center gap-3">
        <StatusIcon className={`w-5 h-5 text-${statusConfig.color}-600`} />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{statusConfig.title}</h4>
          <p className="text-sm text-gray-600">{statusConfig.description}</p>
          
          {/* Additional status info */}
          {payment.status === 'held' && booking.autoRefundAt && (
            <p className="text-xs text-blue-600 mt-1">
              Auto-refund: {new Date(booking.autoRefundAt).toLocaleString()}
            </p>
          )}
          
          {payment.status === 'confirmed' && booking.status === 'completed' && (
            <button
              onClick={() => onReleasePayment(booking.id)}
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Release Payment to Provider
            </button>
          )}
        </div>
      </div>

      {/* Payment Details */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">Amount:</span>
            <span className="font-medium ml-1">${payment.amount}</span>
          </div>
          <div>
            <span className="text-gray-500">Commission:</span>
            <span className="font-medium ml-1">${payment.commission || (payment.amount * 0.20).toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-500">Provider Receives:</span>
            <span className="font-medium ml-1">${payment.providerAmount || (payment.amount * 0.80).toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-500">Held Since:</span>
            <span className="font-medium ml-1">
              {new Date(payment.heldAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;