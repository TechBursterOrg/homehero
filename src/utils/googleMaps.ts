// utils/googleMaps.ts
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
    // If already loaded, return immediately
    if (this.isLoaded && window.google?.maps) {
      return true;
    }

    // If loading in progress, return the existing promise
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve) => {
      // Check if Google Maps is already available globally
      if (window.google && window.google.maps) {
        console.log('✅ Google Maps already available globally');
        this.isLoaded = true;
        this.loadPromise = null;
        resolve(true);
        return;
      }

      // Check if script is already in the document
      const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
      if (existingScript) {
        console.log('🔄 Google Maps script already exists, waiting for load...');
        
        const checkLoad = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkLoad);
            this.isLoaded = true;
            this.loadPromise = null;
            console.log('✅ Existing Google Maps script loaded successfully');
            resolve(true);
          }
        }, 100);

        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkLoad);
          if (!window.google?.maps) {
            console.error('❌ Timeout waiting for Google Maps to load');
            this.loadPromise = null;
            resolve(false);
          }
        }, 10000);
        
        return;
      }

      // Load the script for the first time
      console.log('📥 Loading Google Maps script...');
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('✅ Google Maps script loaded successfully');
        // Small delay to ensure Google Maps is fully initialized
        setTimeout(() => {
          this.isLoaded = true;
          this.loadPromise = null;
          resolve(true);
        }, 100);
      };
      
      script.onerror = (error) => {
        console.error('❌ Failed to load Google Maps script:', error);
        this.isLoaded = false;
        this.loadPromise = null;
        resolve(false);
      };
      
      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  // ... rest of the GoogleMapsService methods remain the same
  initializeMap(container: HTMLElement, options: any = {}): google.maps.Map {
    if (!this.isLoaded || !window.google?.maps) {
      throw new Error('Google Maps not loaded. Call loadGoogleMaps() first.');
    }

    // Ensure container is visible and has dimensions
    if (!container.offsetParent || container.offsetWidth === 0 || container.offsetHeight === 0) {
      console.warn('Map container might not be visible or have dimensions');
    }

    // Default options
    const defaultOptions = {
      zoom: 12,
      center: { lat: 6.5244, lng: 3.3792 }, // Lagos coordinates
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        }
      ],
      ...options
    };

    try {
      console.log('🗺️ Initializing map...');
      this.map = new google.maps.Map(container, defaultOptions);
      console.log('✅ Map initialized successfully');
      return this.map;
    } catch (error) {
      console.error('❌ Error initializing map:', error);
      throw error;
    }
  }

  addMarker(
    position: LatLngLiteral, 
    title: string, 
    isSelected: boolean = false, 
    isAvailable: boolean = true
  ): google.maps.Marker | null {
    if (!this.map || !window.google?.maps) {
      console.warn('Map not initialized when adding marker');
      return null;
    }

    const color = isSelected ? '#EF4444' : (isAvailable ? '#10B981' : '#6B7280');
    
    const marker = new google.maps.Marker({
      position,
      map: this.map,
      title,
      icon: {
        url: `data:image/svg+xml;base64,${btoa(`
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="${color}" stroke="white" stroke-width="3"/>
            <circle cx="20" cy="20" r="8" fill="white"/>
            ${isSelected ? `<circle cx="20" cy="20" r="4" fill="${color}"/>` : ''}
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20)
      },
      animation: isSelected ? google.maps.Animation.BOUNCE : undefined
    });

    this.markers.push(marker);
    return marker;
  }

  addProviderMarker(
    provider: any, 
    isSelected: boolean = false, 
    onClick?: (provider: any) => void
  ): google.maps.Marker | null {
    if (!provider.coordinates || provider.coordinates.length !== 2) {
      console.warn(`Provider ${provider.name} missing coordinates`);
      return null;
    }

    const position: LatLngLiteral = {
      lat: provider.coordinates[0],
      lng: provider.coordinates[1]
    };

    const marker = this.addMarker(position, provider.name, isSelected, provider.isAvailableNow);
    
    if (marker && onClick) {
      marker.addListener('click', () => {
        onClick(provider);
      });
    }

    return marker;
  }

  clearMarkers(): void {
    this.markers.forEach(marker => {
      if (marker) {
        marker.setMap(null);
      }
    });
    this.markers = [];
  }

  setMapCenter(center: LatLngLiteral, zoom?: number): void {
    if (this.map) {
      this.map.setCenter(center);
      if (zoom !== undefined) {
        this.map.setZoom(zoom);
      }
    }
  }

  fitBounds(bounds: google.maps.LatLngBounds): void {
    if (this.map && bounds && !bounds.isEmpty()) {
      this.map.fitBounds(bounds);
    }
  }

  calculateDistance(point1: LatLngLiteral, point2: LatLngLiteral): number {
    if (!window.google?.maps?.geometry) {
      console.warn('Google Maps geometry library not loaded');
      return 0;
    }

    try {
      const latLng1 = new google.maps.LatLng(point1.lat, point1.lng);
      const latLng2 = new google.maps.LatLng(point2.lat, point2.lng);
      
      return google.maps.geometry.spherical.computeDistanceBetween(latLng1, latLng2);
    } catch (error) {
      console.error('Error calculating distance:', error);
      return 0;
    }
  }

  destroy(): void {
    console.log('🧹 Cleaning up Google Maps service...');
    this.clearMarkers();
    this.map = null;
    // Don't reset isLoaded and loadPromise to allow reuse
  }

  isGoogleMapsLoaded(): boolean {
    return this.isLoaded && !!window.google?.maps;
  }

  getMap(): google.maps.Map | null {
    return this.map;
  }

  // Reset the service (for testing or complete cleanup)
  reset(): void {
    this.destroy();
    this.isLoaded = false;
    this.loadPromise = null;
  }
}

export const googleMapsService = GoogleMapsService.getInstance();