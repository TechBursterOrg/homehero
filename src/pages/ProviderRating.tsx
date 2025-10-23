import React, { useState, useEffect } from 'react';
import { Star, Users, TrendingUp } from 'lucide-react';

interface ProviderRatingProps {
  providerId: string;
  averageRating?: number;
  totalRatings?: number;
  showDetails?: boolean;
}

interface RatingData {
  averageRating: number;
  totalRatings: number;
  ratingBreakdown: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const ProviderRating: React.FC<ProviderRatingProps> = ({
  providerId,
  averageRating: initialRating,
  totalRatings: initialTotal,
  showDetails = false
}) => {
  const [ratingData, setRatingData] = useState<RatingData | null>(null);
  const [loading, setLoading] = useState(!initialRating);

  useEffect(() => {
    if (initialRating !== undefined && initialTotal !== undefined) {
      setRatingData({
        averageRating: initialRating,
        totalRatings: initialTotal,
        ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
      return;
    }

    const fetchRatingData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/providers/${providerId}/rating`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setRatingData(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching rating data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatingData();
  }, [providerId, initialRating, initialTotal]);

  const renderStars = (rating: number, size = 'w-4 h-4') => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' :
          i < rating ? 'text-yellow-400 fill-current opacity-70' :
          'text-gray-300'
        }`}
      />
    ));
  };

  const calculatePercentage = (count: number, total: number) => {
    return total > 0 ? (count / total) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
      </div>
    );
  }

  if (!ratingData || ratingData.totalRatings === 0) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Star className="w-4 h-4 text-gray-300" />
        <span className="text-sm">No ratings yet</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Overall Rating */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">
            {ratingData.averageRating.toFixed(1)}
          </div>
          <div className="flex items-center gap-1">
            {renderStars(ratingData.averageRating, 'w-4 h-4')}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {ratingData.totalRatings} {ratingData.totalRatings === 1 ? 'review' : 'reviews'}
          </div>
        </div>

        {showDetails && (
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm text-gray-600 w-4">{star}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${calculatePercentage(
                        ratingData.ratingBreakdown[star as keyof typeof ratingData.ratingBreakdown],
                        ratingData.totalRatings
                      )}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">
                  {ratingData.ratingBreakdown[star as keyof typeof ratingData.ratingBreakdown]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating Stats */}
      {showDetails && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            <div>
              <div className="text-sm font-semibold text-gray-900">{ratingData.totalRatings}</div>
              <div className="text-xs text-gray-600">Total Ratings</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {ratingData.averageRating >= 4.5 ? 'Excellent' :
                 ratingData.averageRating >= 4.0 ? 'Very Good' :
                 ratingData.averageRating >= 3.5 ? 'Good' :
                 ratingData.averageRating >= 3.0 ? 'Average' : 'Poor'}
              </div>
              <div className="text-xs text-gray-600">Rating Level</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderRating;