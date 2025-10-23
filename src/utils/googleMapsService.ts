// googleMapsService.ts
export interface LatLngLiteral {
  lat: number;
  lng: number;
}

class GoogleMapsService {
  private apiKey = 'AIzaSyCzCXLK2_d7OT0rlw-L7TObYIS1LqDh2_Q';
  private map: google.maps.Map | null = null;
  private markers: google.maps.Marker[] = [];
  private static instance: GoogleMapsService;
  private isLoaded = false;
  private loadPromise: Promise<boolean> | null = null;

  public static getInstance(): GoogleMapsService {
    if (!GoogleMapsService.instance) {
      GoogleMapsService.instance = new GoogleMapsService();
    }
    return GoogleMapsService.instance;
  }

  async loadGoogleMaps(): Promise<boolean> {
    if (this.isLoaded && window.google?.maps) {
      return true;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve) => {
      // Check if already loaded
      if (window.google && window.google.maps) {
        this.isLoaded = true;
        this.loadPromise = null;
        resolve(true);
        return;
      }

      // Remove any existing scripts to avoid conflicts
      const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com/maps/api/js"]');
      existingScripts.forEach(script => script.remove());

      // Load the script with ONLY new APIs - NO callback parameter
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      
      let loadTimeout: NodeJS.Timeout;
      
      script.onload = () => {
        clearTimeout(loadTimeout);
        // Verify that the new APIs are available
        if (window.google?.maps?.places?.Autocomplete && 
            window.google.maps.Geocoder) {
          this.isLoaded = true;
          this.loadPromise = null;
          console.log('✅ Google Maps NEW APIs loaded successfully');
          resolve(true);
        } else {
          console.error('❌ Required Google Maps APIs not available');
          this.isLoaded = false;
          this.loadPromise = null;
          resolve(false);
        }
      };
      
      script.onerror = () => {
        clearTimeout(loadTimeout);
        console.error('❌ Failed to load Google Maps script');
        this.isLoaded = false;
        this.loadPromise = null;
        resolve(false);
      };
      
      document.head.appendChild(script);
      
      // Timeout after 15 seconds
      loadTimeout = setTimeout(() => {
        console.error('❌ Google Maps loading timeout');
        this.isLoaded = false;
        this.loadPromise = null;
        resolve(false);
      }, 15000);
    });

    return this.loadPromise;
  }

  // Check if the NEW Places API is available
  isNewPlacesApiAvailable(): boolean {
    return !!(window.google?.maps?.places?.Autocomplete);
  }

  // Create Autocomplete using NEW API only
  createAutocomplete(inputElement: HTMLInputElement, options: any = {}): google.maps.places.Autocomplete | null {
    if (!this.isNewPlacesApiAvailable()) {
      console.error('NEW Places API not available');
      return null;
    }

    try {
      const autocompleteOptions = {
        types: ['geocode'],
        componentRestrictions: { country: 'ng' },
        fields: ['formatted_address', 'geometry', 'name', 'place_id'],
        ...options
      };

      return new google.maps.places.Autocomplete(inputElement, autocompleteOptions);
    } catch (error) {
      console.error('Error creating Autocomplete:', error);
      return null;
    }
  }

  // Geocode using NEW Geocoding API
  async geocodeAddress(address: string): Promise<LatLngLiteral | null> {
    if (!this.isLoaded || !window.google?.maps?.Geocoder) {
      return null;
    }

    return new Promise((resolve) => {
      const geocoder = new google.maps.Geocoder();
      
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results?.[0]?.geometry?.location) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng()
          });
        } else {
          console.warn('Geocoding failed:', status);
          resolve(null);
        }
      });
    });
  }

  // Reverse geocode using NEW API
  async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    if (!this.isLoaded || !window.google?.maps?.Geocoder) {
      return null;
    }

    return new Promise((resolve) => {
      const geocoder = new google.maps.Geocoder();
      const latLng = new google.maps.LatLng(lat, lng);
      
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === 'OK' && results?.[0]?.formatted_address) {
          resolve(results[0].formatted_address);
        } else {
          console.warn('Reverse geocoding failed:', status);
          resolve(null);
        }
      });
    });
  }

  initializeMap(container: HTMLElement, options: any = {}): google.maps.Map {
    if (!this.isLoaded || !window.google?.maps) {
      throw new Error('Google Maps not loaded. Call loadGoogleMaps() first.');
    }

    const defaultOptions = {
      zoom: 12,
      center: { lat: 6.5244, lng: 3.3792 },
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      ...options
    };

    this.map = new google.maps.Map(container, defaultOptions);
    return this.map;
  }

  addMarker(position: LatLngLiteral, title: string, isSelected: boolean = false): google.maps.Marker | null {
    if (!this.map || !window.google?.maps) {
      return null;
    }

    const marker = new google.maps.Marker({
      position,
      map: this.map,
      title,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: isSelected ? '#EF4444' : '#10B981',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2,
      }
    });

    this.markers.push(marker);
    return marker;
  }

  clearMarkers(): void {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }

  setMapCenter(center: LatLngLiteral, zoom?: number): void {
    if (this.map) {
      this.map.setCenter(center);
      if (zoom !== undefined) this.map.setZoom(zoom);
    }
  }

  destroy(): void {
    this.clearMarkers();
    this.map = null;
  }

  isGoogleMapsLoaded(): boolean {
    return this.isLoaded && !!window.google?.maps;
  }
}

export const googleMapsService = GoogleMapsService.getInstance();