import React from 'react';
import {
  Calendar,
  Clock,
  MoreVertical,
  MessageCircle,
  Phone,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Booking } from '../types';
import { getStatusColor } from '../utils/helpers';

interface BookingCardProps {
  booking: Booking;
  onReschedule: (bookingId: string) => void;
  onCancel: (bookingId: string) => void;
  onContact: (bookingId: string, method: 'message' | 'phone') => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onReschedule,
  onCancel,
  onContact
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
            {booking.provider.split(' ').map(n => n[0]).join('')}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {booking.service}
            </h3>
            <p className="text-gray-600">{booking.provider}</p>
            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{booking.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{booking.time}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">
              {booking.price}
            </p>
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
              {booking.status.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {booking.status === 'upcoming' && (
              <>
                <button
                  onClick={() => onContact(booking.id, 'message')}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Message"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onContact(booking.id, 'phone')}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
              </>
            )}
            
            {booking.status === 'completed' && (
              <button className="p-2 text-green-600 bg-green-50 rounded-lg">
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
            
            {booking.status === 'cancelled' && (
              <button className="p-2 text-red-600 bg-red-50 rounded-lg">
                <XCircle className="w-4 h-4" />
              </button>
            )}

            <div className="relative group">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {/* Dropdown menu would go here */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-1">
                  {booking.status === 'upcoming' && (
                    <>
                      <button
                        onClick={() => onReschedule(booking.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => onCancel(booking.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;