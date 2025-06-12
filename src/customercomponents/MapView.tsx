import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import {
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Shield,
  Award,
  Navigation,
  Layers
} from 'lucide-react';
import { Provider } from '../types';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  providers: Provider[];
  userLocation: [number, number] | null;
  selectedProvider: Provider | null;
  onProviderSelect: (provider: Provider) => void;
  onBook: (provider: Provider) => void;
  searchRadius: number;
}

// Custom hook to update map view
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const MapView: React.FC<MapViewProps> = ({
  providers,
  userLocation,
  selectedProvider,
  onProviderSelect,
  onBook,
  searchRadius
}) => {
  const [mapView, setMapView] = useState<'roadmap' | 'satellite'>('roadmap');
  
  // Default to San Francisco if no user location
  const defaultCenter: [number, number] = [37.7749, -122.4194];
  const center = userLocation || defaultCenter;

  // Create custom icons for different provider types
  const createProviderIcon = (provider: Provider) => {
    const color = provider.isAvailableNow ? '#10B981' : '#6B7280';
    const iconHtml = `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">
        ${provider.avatar}
      </div>
    `;
    
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(iconHtml)}`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
    });
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="relative h-96 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => setMapView('roadmap')}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              mapView === 'roadmap'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMapView('satellite')}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              mapView === 'satellite'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🛰️
          </button>
        </div>
        
        {userLocation && (
          <button
            onClick={() => {
              // Center map on user location
            }}
            className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            title="Center on my location"
          >
            <Navigation className="w-4 h-4 text-gray-700" />
          </button>
        )}
      </div>

      {/* Search Radius Info */}
      <div className="absolute top-4 left-4 z-[1000] bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-center space-x-2 text-sm">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="text-gray-700">
            {providers.length} providers within {searchRadius} miles
          </span>
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <ChangeView center={center} zoom={12} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={
            mapView === 'roadmap'
              ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          }
        />

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <p className="font-medium text-gray-900">Your Location</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Provider Markers */}
        {providers.map((provider) => (
          <Marker
            key={provider.id}
            position={provider.coordinates}
            icon={createProviderIcon(provider)}
            eventHandlers={{
              click: () => onProviderSelect(provider),
            }}
          >
            <Popup>
              <div className="w-64 p-2">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {provider.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 flex items-center space-x-1">
                      <span>{provider.name}</span>
                      {provider.isVerified && (
                        <Shield className="w-3 h-3 text-blue-500" />
                      )}
                      {provider.isTopRated && (
                        <Award className="w-3 h-3 text-yellow-500" />
                      )}
                    </h3>
                    <div className="flex items-center space-x-1 mb-1">
                      {renderStars(provider.rating)}
                      <span className="text-xs text-gray-600">
                        {provider.rating} ({provider.reviewCount})
                      </span>
                    </div>
                    {provider.isAvailableNow && (
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        Available Now
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex flex-wrap gap-1">
                    {provider.services.slice(0, 2).map((service, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                    {provider.services.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{provider.services.length - 2} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{provider.location}</span>
                    <span className="font-semibold text-green-600">
                      {provider.priceRange}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:shadow-lg transition-all duration-200">
                    Book Now
                  </button>
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;