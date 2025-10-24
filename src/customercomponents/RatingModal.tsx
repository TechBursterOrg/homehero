import React, { useState } from 'react';
import { Star, X, Send, Loader2 } from 'lucide-react';

interface RatingModalProps {
  isOpen: boolean;
  booking: any;
  onClose: () => void;
  onSubmit: (rating: number, comment?: string) => Promise<void>;
  type: 'provider' | 'customer';
}

const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  booking,
  onClose,
  onSubmit,
  type
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment);
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Rating submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const isRatingProvider = type === 'provider';
  const ratedPersonName = isRatingProvider ? booking.providerName : booking.customerName;
  const modalTitle = isRatingProvider ? 'Rate Provider' : 'Rate Customer';
  const modalDescription = isRatingProvider 
    ? `How was your experience with ${booking.providerName}?`
    : `How was ${booking.customerName} as a customer?`;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full">
        <div className="p-6 sm:p-8 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-current" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{modalTitle}</h2>
                <p className="text-gray-600 text-sm sm:text-base">{modalDescription}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 mb-4">
              How would you rate {ratedPersonName}?
            </p>
            
            {/* Star Rating */}
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-4xl transition-transform hover:scale-110"
                  disabled={isSubmitting}
                >
                  <Star 
                    className={`${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            
            <div className="text-sm text-gray-600 mb-2">
              {rating === 0 ? 'Select a rating' :
               rating === 1 ? 'Poor' :
               rating === 2 ? 'Fair' :
               rating === 3 ? 'Good' :
               rating === 4 ? 'Very Good' : 'Excellent'}
            </div>
          </div>

          {/* Comment Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Comments (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                isRatingProvider 
                  ? "Share your experience... What did you like? Any suggestions for improvement?"
                  : "Share your experience with this customer..."
              }
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Service Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Service Details</h4>
            <p className="text-sm text-gray-700"><strong>Service:</strong> {booking.serviceType}</p>
            <p className="text-sm text-gray-700"><strong>Date:</strong> {new Date(booking.requestedAt).toLocaleDateString()}</p>
            <p className="text-sm text-gray-700"><strong>Location:</strong> {booking.location}</p>
          </div>
        </div>

        <div className="p-6 sm:p-8 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all duration-200 font-semibold"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl sm:rounded-2xl hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-semibold"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span>{isSubmitting ? 'Submitting...' : 'Submit Rating'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;