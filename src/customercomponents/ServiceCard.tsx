import React from 'react';
import { ArrowRight, Star, Users, Zap, Calendar } from 'lucide-react';
import { Service, ServiceType } from '../types';

interface ServiceCardProps {
  service: Service;
  serviceType: ServiceType;
  onClick: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, serviceType, onClick }) => {
  const isImmediate = serviceType === 'immediate';
  const availableProviders = isImmediate ? Math.floor(service.providers * 0.3) : service.providers;
  
  return (
    <div
      onClick={() => onClick(service)}
      className="group bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex items-start gap-3 sm:gap-4 mb-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:scale-110 shrink-0">
            <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-200">
              {service.icon}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                {service.name}
              </h3>
              
              {isImmediate && availableProviders > 0 && (
                <div className="flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-2 py-1 rounded-lg text-xs font-semibold shadow-sm shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="hidden sm:inline">Available</span>
                  <span className="sm:hidden">Now</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm sm:text-base mb-4 leading-relaxed">
          {service.description}
        </p>

        {/* Stats Section */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-400 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-xs sm:text-sm">$</span>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold text-emerald-600">
                  {service.averagePrice}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 -mt-1">
                  avg price
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-1 sm:gap-2 text-blue-600 mb-1">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-sm sm:text-base font-bold">
                  {availableProviders}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">
                {isImmediate ? 'available now' : 'providers'}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-center pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-amber-600">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                {isImmediate ? (
                  <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                ) : (
                  <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                )}
              </div>
              <span className="text-xs sm:text-sm font-semibold">
                {isImmediate ? 'Quick Response' : 'Plan Project'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl sm:rounded-3xl"></div>
    </div>
  );
};

export default ServiceCard;