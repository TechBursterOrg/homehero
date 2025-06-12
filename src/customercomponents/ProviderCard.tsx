import React from 'react';
import {
  Star,
  MapPin,
  Clock,
  Heart,
  Shield,
  Award,
  MessageCircle,
  Phone
} from 'lucide-react';
import { Provider, ServiceType } from '../types';

interface ProviderCardProps {
  provider: Provider;
  serviceType: ServiceType;
  onBook: (provider: Provider) => void;
  onToggleFavorite: (providerId: string) => void;
  isFavorite: boolean;
}

const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  serviceType,
  onBook,
  onToggleFavorite,
  isFavorite
}) => {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-lg ring-4 ring-white shadow-lg">
          {provider.avatar}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <span>{provider.name}</span>
                {provider.isVerified && (
                  <Shield className="w-4 h-4 text-blue-500" title="Verified Provider" />
                )}
                {provider.isTopRated && (
                  <Award className="w-4 h-4 text-yellow-500" title="Top Rated" />
                )}
                {provider.isAvailableNow && serviceType === 'immediate' && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium animate-pulse">
                    Available Now
                  </span>
                )}
              </h3>
              <div className="flex items-center space-x-2 mb-1">
                <div className="flex items-center space-x-1">
                  {renderStars(provider.rating)}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {provider.rating}
                </span>
                <span className="text-sm text-gray-600">
                  ({provider.reviewCount} reviews)
                </span>
              </div>
            </div>
            <button
              onClick={() => onToggleFavorite(provider.id)}
              className={`p-1 rounded-full transition-colors duration-200 ${
                isFavorite
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex flex-wrap gap-2">
              {provider.services.map((service, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                >
                  {service}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{provider.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Responds {provider.responseTime}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-semibold text-green-600">
                {provider.priceRange}
              </span>
              <p className="text-xs text-gray-500">
                {provider.completedJobs} jobs completed
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <MessageCircle className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                <Phone className="w-5 h-5" />
              </button>
              <button
                onClick={() => onBook(provider)}
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 font-medium hover:scale-105"
              >
                {serviceType === 'immediate' ? 'Book Now' : 'Get Quote'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;