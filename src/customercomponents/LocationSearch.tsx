// LocationSearch.tsx
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, X as XIcon } from 'lucide-react';

interface LocationData {
  address: string;
  coordinates: [number, number];
}

interface LocationSuggestion {
  id: string;
  address: string;
  coordinates: [number, number];
  type: 'area' | 'city' | 'state' | 'landmark' | 'island';
}

interface LocationSearchProps {
  onLocationSelect: (location: LocationData) => void;
  currentLocation: string;
  onCurrentLocationDetect: () => void;
  serviceType?: string;
  onFindNow?: () => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
  currentLocation,
  onCurrentLocationDetect,
  serviceType,
  onFindNow
}) => {
  const [searchQuery, setSearchQuery] = useState(currentLocation);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Nigerian states and major cities with detailed Lagos areas
  const nigerianLocations: LocationSuggestion[] = [
    // States
    { id: 'abia', address: 'Abia State, Nigeria', coordinates: [5.4527, 7.5248], type: 'state' },
    { id: 'adamawa', address: 'Adamawa State, Nigeria', coordinates: [9.3265, 12.3984], type: 'state' },
    { id: 'akwa-ibom', address: 'Akwa Ibom State, Nigeria', coordinates: [4.9057, 7.8537], type: 'state' },
    { id: 'anambra', address: 'Anambra State, Nigeria', coordinates: [6.2209, 6.9370], type: 'state' },
    { id: 'bauchi', address: 'Bauchi State, Nigeria', coordinates: [10.3103, 9.8439], type: 'state' },
    { id: 'bayelsa', address: 'Bayelsa State, Nigeria', coordinates: [4.7719, 6.0699], type: 'state' },
    { id: 'benue', address: 'Benue State, Nigeria', coordinates: [7.3369, 8.7404], type: 'state' },
    { id: 'borno', address: 'Borno State, Nigeria', coordinates: [11.8846, 13.1520], type: 'state' },
    { id: 'cross-river', address: 'Cross River State, Nigeria', coordinates: [5.8702, 8.5988], type: 'state' },
    { id: 'delta', address: 'Delta State, Nigeria', coordinates: [5.7040, 5.9339], type: 'state' },
    { id: 'ebonyi', address: 'Ebonyi State, Nigeria', coordinates: [6.2649, 8.0137], type: 'state' },
    { id: 'edo', address: 'Edo State, Nigeria', coordinates: [6.6342, 5.9304], type: 'state' },
    { id: 'ekiti', address: 'Ekiti State, Nigeria', coordinates: [7.7190, 5.3110], type: 'state' },
    { id: 'enugu', address: 'Enugu State, Nigeria', coordinates: [6.4584, 7.5464], type: 'state' },
    { id: 'gombe', address: 'Gombe State, Nigeria', coordinates: [10.2791, 11.1731], type: 'state' },
    { id: 'imo', address: 'Imo State, Nigeria', coordinates: [5.5720, 7.0588], type: 'state' },
    { id: 'jigawa', address: 'Jigawa State, Nigeria', coordinates: [12.2280, 9.5616], type: 'state' },
    { id: 'kaduna', address: 'Kaduna State, Nigeria', coordinates: [10.5105, 7.4165], type: 'state' },
    { id: 'kano', address: 'Kano State, Nigeria', coordinates: [11.7471, 8.5247], type: 'state' },
    { id: 'katsina', address: 'Katsina State, Nigeria', coordinates: [12.3797, 7.6306], type: 'state' },
    { id: 'kebbi', address: 'Kebbi State, Nigeria', coordinates: [11.4942, 4.2333], type: 'state' },
    { id: 'kogi', address: 'Kogi State, Nigeria', coordinates: [7.7337, 6.6906], type: 'state' },
    { id: 'kwara', address: 'Kwara State, Nigeria', coordinates: [8.9669, 4.3874], type: 'state' },
    { id: 'lagos', address: 'Lagos State, Nigeria', coordinates: [6.5244, 3.3792], type: 'state' },
    { id: 'nasarawa', address: 'Nasarawa State, Nigeria', coordinates: [8.4998, 8.1997], type: 'state' },
    { id: 'niger', address: 'Niger State, Nigeria', coordinates: [9.9309, 5.5983], type: 'state' },
    { id: 'ogun', address: 'Ogun State, Nigeria', coordinates: [7.1557, 3.3451], type: 'state' },
    { id: 'ondo', address: 'Ondo State, Nigeria', coordinates: [7.2573, 5.2058], type: 'state' },
    { id: 'osun', address: 'Osun State, Nigeria', coordinates: [7.5629, 4.5200], type: 'state' },
    { id: 'oyo', address: 'Oyo State, Nigeria', coordinates: [8.1574, 3.6147], type: 'state' },
    { id: 'plateau', address: 'Plateau State, Nigeria', coordinates: [9.2182, 9.5179], type: 'state' },
    { id: 'rivers', address: 'Rivers State, Nigeria', coordinates: [4.7500, 6.8333], type: 'state' },
    { id: 'sokoto', address: 'Sokoto State, Nigeria', coordinates: [13.0059, 5.2476], type: 'state' },
    { id: 'taraba', address: 'Taraba State, Nigeria', coordinates: [8.6020, 9.8046], type: 'state' },
    { id: 'yobe', address: 'Yobe State, Nigeria', coordinates: [12.2939, 11.4390], type: 'state' },
    { id: 'zamfara', address: 'Zamfara State, Nigeria', coordinates: [12.1222, 6.2236], type: 'state' },
    { id: 'abuja', address: 'Abuja, Federal Capital Territory, Nigeria', coordinates: [9.0765, 7.3986], type: 'state' },
    
    // Major cities
    { id: 'lagos-city', address: 'Lagos, Nigeria', coordinates: [6.5244, 3.3792], type: 'city' },
    { id: 'abuja-city', address: 'Abuja, Nigeria', coordinates: [9.0765, 7.3986], type: 'city' },
    { id: 'kano-city', address: 'Kano, Nigeria', coordinates: [12.0022, 8.5920], type: 'city' },
    { id: 'ibadan', address: 'Ibadan, Nigeria', coordinates: [7.3775, 3.9470], type: 'city' },
    { id: 'port-harcourt', address: 'Port Harcourt, Nigeria', coordinates: [4.8156, 7.0498], type: 'city' },
    { id: 'benin-city', address: 'Benin City, Nigeria', coordinates: [6.3350, 5.6037], type: 'city' },
    
    // Lagos Areas
    { id: 'ikeja', address: 'Ikeja, Lagos, Nigeria', coordinates: [6.6059, 3.3491], type: 'area' },
    { id: 'lekki', address: 'Lekki, Lagos, Nigeria', coordinates: [6.4654, 3.5665], type: 'area' },
    { id: 'ajah', address: 'Ajah, Lagos, Nigeria', coordinates: [6.4730, 3.5770], type: 'area' },
    { id: 'victoria-island', address: 'Victoria Island, Lagos, Nigeria', coordinates: [6.4281, 3.4210], type: 'island' },
    { id: 'ikoyi', address: 'Ikoyi, Lagos, Nigeria', coordinates: [6.4522, 3.4358], type: 'area' },
    { id: 'surulere', address: 'Surulere, Lagos, Nigeria', coordinates: [6.5010, 3.3580], type: 'area' },
    { id: 'yaba', address: 'Yaba, Lagos, Nigeria', coordinates: [6.5098, 3.3711], type: 'area' },
    { id: 'apapa', address: 'Apapa, Lagos, Nigeria', coordinates: [6.4488, 3.3590], type: 'area' },
    { id: 'maryland', address: 'Maryland, Lagos, Nigeria', coordinates: [6.5783, 3.3760], type: 'area' },
    { id: 'ogba', address: 'Ogba, Lagos, Nigeria', coordinates: [6.6248, 3.3373], type: 'area' },
    { id: 'agege', address: 'Agege, Lagos, Nigeria', coordinates: [6.6308, 3.3230], type: 'area' },
    { id: 'alimosho', address: 'Alimosho, Lagos, Nigeria', coordinates: [6.6114, 3.2550], type: 'area' },
    { id: 'oshodi', address: 'Oshodi, Lagos, Nigeria', coordinates: [6.5583, 3.3433], type: 'area' },
    { id: 'isolo', address: 'Isolo, Lagos, Nigeria', coordinates: [6.5207, 3.3081], type: 'area' },
    { id: 'ajah-sangotedo', address: 'Sangotedo, Lagos, Nigeria', coordinates: [6.4677, 3.6424], type: 'area' },
    { id: 'festac', address: 'Festac Town, Lagos, Nigeria', coordinates: [6.4853, 3.2920], type: 'area' },
    { id: 'amuwodofin', address: 'Amuwo Odofin, Lagos, Nigeria', coordinates: [6.4606, 3.2744], type: 'area' },
    { id: 'oshodi-isolo', address: 'Oshodi-Isolo, Lagos, Nigeria', coordinates: [6.5580, 3.3420], type: 'area' },
    { id: 'mushin', address: 'Mushin, Lagos, Nigeria', coordinates: [6.5297, 3.3570], type: 'area' },
    { id: 'egbeda', address: 'Egbeda, Lagos, Nigeria', coordinates: [6.5882, 3.3088], type: 'area' },
    { id: 'ikotun', address: 'Ikotun, Lagos, Nigeria', coordinates: [6.5431, 3.2644], type: 'area' },
    { id: 'ojo', address: 'Ojo, Lagos, Nigeria', coordinates: [6.4650, 3.2060], type: 'area' },
    { id: 'badagry', address: 'Badagry, Lagos, Nigeria', coordinates: [6.4150, 2.8853], type: 'area' },
    { id: 'ebute-metta', address: 'Ebute Metta, Lagos, Nigeria', coordinates: [6.4886, 3.3889], type: 'area' },
    { id: 'bariga', address: 'Bariga, Lagos, Nigeria', coordinates: [6.5371, 3.3884], type: 'area' },
    { id: 'epe', address: 'Epe, Lagos, Nigeria', coordinates: [6.5841, 3.9833], type: 'area' },
    { id: 'ikorodu', address: 'Ikorodu, Lagos, Nigeria', coordinates: [6.6194, 3.5105], type: 'area' },
    { id: 'ajegunle', address: 'Ajegunle, Lagos, Nigeria', coordinates: [6.4566, 3.3422], type: 'area' },
    { id: 'ketu', address: 'Ketu, Lagos, Nigeria', coordinates: [6.5911, 3.3870], type: 'area' },
    { id: 'oshodi-oloosa', address: 'Oshodi Oloosa, Lagos, Nigeria', coordinates: [6.5565, 3.3385], type: 'area' },
    { id: 'iyana-ipaja', address: 'Iyana Ipaja, Lagos, Nigeria', coordinates: [6.6450, 3.3150], type: 'area' },
{ id: 'ipaja', address: 'Ipaja, Lagos, Nigeria', coordinates: [6.6200, 3.3100], type: 'area' },
{ id: 'ayobo', address: 'Ayobo, Lagos, Nigeria', coordinates: [6.6583, 3.3275], type: 'area' },
{ id: 'dopemu', address: 'Dopemu, Lagos, Nigeria', coordinates: [6.6333, 3.3300], type: 'area' },
{ id: 'alagbado', address: 'Alagbado, Lagos, Nigeria', coordinates: [6.6417, 3.3050], type: 'area' },
{ id: 'abule-egba', address: 'Abule Egba, Lagos, Nigeria', coordinates: [6.6350, 3.3200], type: 'area' },
{ id: 'meiran', address: 'Meiran, Lagos, Nigeria', coordinates: [6.6400, 3.3000], type: 'area' },
{ id: 'ijaiye', address: 'Ijaiye, Lagos, Nigeria', coordinates: [6.6250, 3.3150], type: 'area' },
{ id: 'ojokoro', address: 'Ojokoro, Lagos, Nigeria', coordinates: [6.6500, 3.2800], type: 'area' },
{ id: 'command', address: 'Command, Lagos, Nigeria', coordinates: [6.6150, 3.2650], type: 'area' },
{ id: 'idimu', address: 'Idimu, Lagos, Nigeria', coordinates: [6.5783, 3.2800], type: 'area' },
{ id: 'ejigbo', address: 'Ejigbo, Lagos, Nigeria', coordinates: [6.5583, 3.3083], type: 'area' },
{ id: 'igando', address: 'Igando, Lagos, Nigeria', coordinates: [6.5500, 3.2400], type: 'area' },
{ id: 'iyana-oba', address: 'Iyana Oba, Lagos, Nigeria', coordinates: [6.5650, 3.2500], type: 'area' },
{ id: 'shasha', address: 'Shasha, Lagos, Nigeria', coordinates: [6.6100, 3.3250], type: 'area' },
{ id: 'mangoro', address: 'Mangoro, Lagos, Nigeria', coordinates: [6.5850, 3.3200], type: 'area' },
{ id: 'isheri', address: 'Isheri, Lagos, Nigeria', coordinates: [6.6600, 3.3800], type: 'area' },
{ id: 'magodo', address: 'Magodo, Lagos, Nigeria', coordinates: [6.5944, 3.3833], type: 'area' },
{ id: 'omole', address: 'Omole Phase 1, Lagos, Nigeria', coordinates: [6.6200, 3.3600], type: 'area' },
{ id: 'gbagada', address: 'Gbagada, Lagos, Nigeria', coordinates: [6.5583, 3.3833], type: 'area' },
{ id: 'palmgroove', address: 'Palm Grove, Lagos, Nigeria', coordinates: [6.5417, 3.3700], type: 'area' },
{ id: 'onipanu', address: 'Onipanu, Lagos, Nigeria', coordinates: [6.5250, 3.3750], type: 'area' },
{ id: 'fadeyi', address: 'Fadeyi, Lagos, Nigeria', coordinates: [6.5200, 3.3650], type: 'area' },
{ id: 'ojuelegba', address: 'Ojuelegba, Lagos, Nigeria', coordinates: [6.5050, 3.3600], type: 'area' },
{ id: 'lawanson', address: 'Lawanson, Lagos, Nigeria', coordinates: [6.5100, 3.3500], type: 'area' },
{ id: 'itire', address: 'Itire, Lagos, Nigeria', coordinates: [6.5150, 3.3400], type: 'area' },
{ id: 'papa-ajao', address: 'Papa Ajao, Lagos, Nigeria', coordinates: [6.5350, 3.3300], type: 'area' },
{ id: 'shogunle', address: 'Shogunle, Lagos, Nigeria', coordinates: [6.5450, 3.3400], type: 'area' },
{ id: 'ilupeju', address: 'Ilupeju, Lagos, Nigeria', coordinates: [6.5500, 3.3600], type: 'area' },
{ id: 'lagos-island', address: 'Lagos Island, Lagos, Nigeria', coordinates: [6.4533, 3.3958], type: 'island' },
{ id: 'eko-atlantic', address: 'Eko Atlantic, Lagos, Nigeria', coordinates: [6.4150, 3.4000], type: 'area' },
{ id: 'banana-island', address: 'Banana Island, Lagos, Nigeria', coordinates: [6.4400, 3.4300], type: 'island' }
    
  ];

  useEffect(() => {
    setSearchQuery(currentLocation);
  }, [currentLocation]);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const filtered = nigerianLocations.filter(location =>
        location.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    setSearchQuery(suggestion.address);
    setShowSuggestions(false);
    onLocationSelect({
      address: suggestion.address,
      coordinates: suggestion.coordinates
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Only reset selected location if the value is different and we're not selecting
    if (selectedLocation && value !== selectedLocation.address && !isSelecting) {
      setSelectedLocation(null);
    }
  };

  const handleInputFocus = () => {
    // Only show suggestions if we have a query, no selected location, and not currently selecting
    if (searchQuery.length > 2 && !selectedLocation && !isSelecting) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      if (!isSelecting) {
        setShowSuggestions(false);
      }
    }, 150);
  };

  const handleClearLocation = () => {
  setIsSelecting(true);
  setSearchQuery('');
  setSelectedLocation(null);
  setSuggestions([]);
  setShowSuggestions(false);
  setIsSearching(false);
  
  // Send empty location data
  onLocationSelect({
    address: '',
    coordinates: [0, 0]
  });
  
  setTimeout(() => {
    setIsSelecting(false);
  }, 100);
};


  const handleCurrentLocation = async () => {
    if ('geolocation' in navigator) {
      try {
        setIsDetectingLocation(true);
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000
          });
        });

        // Find closest known location
        const { latitude, longitude } = position.coords;
        let closestLocation = nigerianLocations[0];
        let minDistance = Number.MAX_VALUE;
        
        for (const location of nigerianLocations) {
          const [lat, lng] = location.coordinates;
          const distance = Math.sqrt(Math.pow(lat - latitude, 2) + Math.pow(lng - longitude, 2));
          
          if (distance < minDistance) {
            minDistance = distance;
            closestLocation = location;
          }
        }
        
        setSearchQuery(closestLocation.address);
        onLocationSelect({
          address: closestLocation.address,
          coordinates: closestLocation.coordinates
        });
        onCurrentLocationDetect();
        
      } catch (error) {
        alert('Unable to detect your location. Please enter your address manually.');
      } finally {
        setIsDetectingLocation(false);
      }
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'city':
        return '🏙️';
      case 'state':
        return '🗺️';
      case 'landmark':
        return '🏛️';
      case 'island':
        return '🏝️';
      case 'area':
        return '📍';
      default:
        return '📍';
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        if (!isSelecting) {
          setShowSuggestions(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSelecting]);

  return (
    <div className="relative">
      <div className="relative">
  <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
  <input
    ref={inputRef}
    type="text"
    placeholder="Enter your location in ..."
    value={searchQuery}
    onChange={handleInputChange}
    onFocus={handleInputFocus}
    onBlur={handleInputBlur}
    className="w-full pl-14 sm:pl-16 pr-14 sm:pr-16 py-4 sm:py-5 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl text-gray-900 placeholder-gray-500 placeholder:text-center focus:ring-2 focus:ring-yellow-300 focus:outline-none focus:bg-white transition-all duration-200 border border-white/20 shadow-lg text-base sm:text-lg font-medium"
  />

  {searchQuery && (
    <button
      onClick={handleClearLocation}
      className="absolute right-12 top-6 p-1 text-gray-400 hover:text-red-600 transition-colors"
    >
      <XIcon className="w-4 h-4" />
    </button>
  )}

  <button
    onClick={handleCurrentLocation}
    disabled={isDetectingLocation}
    className="absolute right-3 top-3 p-1 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
    title="Use current location"
  >
    {isDetectingLocation ? (
      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    ) : (
      <Navigation className="w-5 h-5 mt-2" />
    )}
  </button>
</div>

      {showSuggestions && suggestions.length > 0 && (
        <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto z-50">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleLocationSelect(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getLocationIcon(suggestion.type)}</span>
                <span className="text-sm font-medium text-gray-900">
                  {suggestion.address}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export { LocationSearch };