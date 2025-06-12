import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Service, ServiceType } from '../types';

interface ServiceCardProps {
  service: Service;
  serviceType: ServiceType;
  onClick: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, serviceType, onClick }) => {
  return (
    <div
      onClick={() => onClick(service)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
    >
      <div className="flex items-start space-x-4">
        <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
          {service.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {service.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 leading-relaxed">
            {service.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-green-600 font-semibold">
              {service.averagePrice}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {serviceType === 'immediate' 
                  ? `${Math.floor(service.providers * 0.3)} available` 
                  : `${service.providers} providers`}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;