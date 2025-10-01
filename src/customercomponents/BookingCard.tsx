import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MoreVertical,
  MessageCircle,
  Phone,
  CheckCircle,
  XCircle,
  MapPin,
  DollarSign,
  User,
  Briefcase,
  Heart,
  PhoneCall,
  Video,
  Copy,
  ExternalLink,
  Edit3,
  Eye,
  AlertCircle,
  RefreshCw,
  Star
} from 'lucide-react';
import { Booking } from '../types';
import { getStatusColor } from '../utils/helpers';

interface BookingCardProps {
  booking: Booking;
  onReschedule: (bookingId: string) => void;
  onCancel: (bookingId: string) => void;
  onContact: (bookingId: string, method: 'message' | 'phone' | 'email') => void;
  onViewDetails: (bookingId: string) => void;
  onToggleFavorite?: (bookingId: string) => void;
  isFavorite?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onReschedule,
  onCancel,
  onContact,
  onViewDetails,
  onToggleFavorite,
  isFavorite = false
}) => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showCallOptions, setShowCallOptions] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="w-3 h-3" />;
      case 'in-progress':
        return <RefreshCw className="w-3 h-3" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3" />;
      case 'cancelled':
        return <XCircle className="w-3 h-3" />;
      case 'rescheduled':
        return <Calendar className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold";
    
    switch (status) {
      case 'upcoming':
        return `${baseClasses} bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm`;
      case 'in-progress':
        return `${baseClasses} bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm`;
      case 'completed':
        return `${baseClasses} bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm`;
      case 'cancelled':
        return `${baseClasses} bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm`;
      case 'rescheduled':
        return `${baseClasses} bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-600`;
    }
  };

  const getProviderInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarGradient = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'from-blue-600 to-purple-600';
      case 'in-progress':
        return 'from-orange-600 to-red-600';
      case 'completed':
        return 'from-emerald-600 to-green-600';
      case 'cancelled':
        return 'from-gray-600 to-gray-700';
      case 'rescheduled':
        return 'from-purple-600 to-pink-600';
      default:
        return 'from-blue-600 to-purple-600';
    }
  };

  const handleCallClick = () => {
    setShowCallOptions(true);
  };

  const handleWebCall = (type: 'audio' | 'video') => {
    // Implement web call functionality
    console.log(`Starting ${type} call for booking:`, booking.id);
    setShowCallOptions(false);
  };

  const handlePhoneCall = () => {
    onContact(booking.id, 'phone');
    setShowCallOptions(false);
  };

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText('+1 (234) 567-8900');
      alert('Phone number copied to clipboard!');
    } catch {
      prompt('Copy this phone number:', '+1 (234) 567-8900');
    }
    setShowCallOptions(false);
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date} ${time}`);
    const now = new Date();
    const diffHours = (dateObj.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24 && diffHours > 0) {
      return `Today at ${time}`;
    } else if (diffHours < 48 && diffHours > 0) {
      return `Tomorrow at ${time}`;
    }
    return `${date} at ${time}`;
  };

  const handleViewDetailsClick = () => {
    onViewDetails(booking.id);
    setShowMoreOptions(false);
  };

  const handleRescheduleClick = () => {
    onReschedule(booking.id);
    setShowMoreOptions(false);
  };

  const handleCancelClick = () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      onCancel(booking.id);
    }
    setShowMoreOptions(false);
  };

  return (
    <>
      <div className="group bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 p-4 sm:p-6 overflow-hidden">
        {/* Mobile Layout */}
        <div className="flex flex-col sm:hidden space-y-4">
          {/* Header Row */}
          <div className="flex items-start gap-3">
            <div className={`w-14 h-14 bg-gradient-to-br ${getAvatarGradient(booking.status)} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0`}>
              {getProviderInitials(booking.provider)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1 truncate">
                    {booking.service}
                  </h3>
                  <p className="text-sm text-gray-600 truncate mb-2">{booking.provider}</p>
                  
                  <div className={getStatusBadge(booking.status)}>
                    {getStatusIcon(booking.status)}
                    <span>{booking.status.replace('-', ' ')}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {onToggleFavorite && (
                    <button
                      onClick={() => onToggleFavorite(booking.id)}
                      className={`p-1 rounded-full transition-colors duration-200 ${
                        isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  )}
                  
                  <div className="relative">
                    <button 
                      onClick={() => setShowMoreOptions(!showMoreOptions)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {showMoreOptions && (
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl p-1 z-50 min-w-40">
                        <button
                          onClick={handleViewDetailsClick}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                          <span>View Details</span>
                        </button>
                        {booking.status === 'upcoming' && (
                          <>
                            <button
                              onClick={handleRescheduleClick}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2"
                            >
                              <Edit3 className="w-4 h-4 text-green-600" />
                              <span>Reschedule</span>
                            </button>
                            <button
                              onClick={handleCancelClick}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 rounded-lg flex items-center gap-2 text-red-600"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Cancel</span>
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

          {/* Date & Time */}
          <div className="bg-blue-50 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-700">
                <Calendar className="w-4 h-4" />
                <span className="font-semibold text-sm">{formatDateTime(booking.date, booking.time)}</span>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-600">{booking.price}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onContact(booking.id, 'message')}
                className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              
              <div className="relative">
                <button 
                  onClick={handleCallClick}
                  className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <Phone className="w-4 h-4" />
                </button>
                
                {showCallOptions && (
                  <div className="absolute left-0 bottom-full mb-2 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-50 min-w-44">
                    <button
                      onClick={() => handleWebCall('audio')}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2"
                    >
                      <PhoneCall className="w-4 h-4 text-green-600" />
                      <span>Web Call</span>
                    </button>
                    
                    <button
                      onClick={() => handleWebCall('video')}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2"
                    >
                      <Video className="w-4 h-4 text-blue-600" />
                      <span>Video Call</span>
                    </button>
                    
                    <button
                      onClick={handlePhoneCall}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4 text-purple-600" />
                      <span>Phone App</span>
                    </button>
                    
                    <button
                      onClick={handleCopyNumber}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                      <span>Copy Number</span>
                    </button>
                  </div>
                )}
              </div>

              <button 
                onClick={() => onContact(booking.id, 'email')}
                className="p-2 bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
            
            {booking.status === 'upcoming' && (
              <button
                onClick={handleRescheduleClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-sm"
              >
                Reschedule
              </button>
            )}

            {booking.status === 'completed' && (
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-semibold">Completed</span>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-start gap-4">
          <div className={`w-16 h-16 bg-gradient-to-br ${getAvatarGradient(booking.status)} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300`}>
            {getProviderInitials(booking.provider)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {booking.service}
                  </h3>
                  
                  <div className={getStatusBadge(booking.status)}>
                    {getStatusIcon(booking.status)}
                    <span>{booking.status.replace('-', ' ')}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-2">{booking.provider}</p>
              </div>
              
              <div className="flex items-center gap-2">
                {onToggleFavorite && (
                  <button
                    onClick={() => onToggleFavorite(booking.id)}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                )}
                
                <div className="relative">
                  <button 
                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  {showMoreOptions && (
                    <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-50 min-w-48">
                      <button
                        onClick={handleViewDetailsClick}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                        <span>View Details</span>
                      </button>
                      {booking.status === 'upcoming' && (
                        <>
                          <button
                            onClick={handleRescheduleClick}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2"
                          >
                            <Edit3 className="w-4 h-4 text-green-600" />
                            <span>Reschedule</span>
                          </button>
                          <button
                            onClick={handleCancelClick}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 rounded-lg flex items-center gap-2 text-red-600"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Cancel Booking</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{formatDateTime(booking.date, booking.time)}</p>
                      <p className="text-sm text-gray-600">Scheduled appointment</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-600">{booking.price}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Service Booking</p>
                  <p className="text-xs text-gray-500">Professional service</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onContact(booking.id, 'message')}
                  className="p-3 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                
                <div className="relative">
                  <button 
                    onClick={handleCallClick}
                    className="p-3 bg-green-100 text-green-600 hover:bg-green-200 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                  
                  {showCallOptions && (
                    <div className="absolute right-0 bottom-full mb-2 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-50 min-w-48">
                      <button
                        onClick={() => handleWebCall('audio')}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2"
                      >
                        <PhoneCall className="w-4 h-4 text-green-600" />
                        <span>Web Audio Call</span>
                      </button>
                      
                      <button
                        onClick={() => handleWebCall('video')}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2"
                      >
                        <Video className="w-4 h-4 text-blue-600" />
                        <span>Web Video Call</span>
                      </button>
                      
                      <button
                        onClick={handlePhoneCall}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4 text-purple-600" />
                        <span>Phone App</span>
                      </button>
                      
                      <button
                        onClick={handleCopyNumber}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4 text-gray-600" />
                        <span>Copy Number</span>
                      </button>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => onContact(booking.id, 'email')}
                  className="p-3 bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                
                {booking.status === 'upcoming' && (
                  <button
                    onClick={handleRescheduleClick}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Reschedule
                  </button>
                )}

                {booking.status === 'completed' && (
                  <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">Completed</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl sm:rounded-3xl"></div>
      </div>

      {showMoreOptions && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowMoreOptions(false)}
        />
      )}

      {showCallOptions && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowCallOptions(false)}
        />
      )}
    </>
  );
};

export default BookingCard;