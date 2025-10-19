// types/google-maps.d.ts
declare global {
  interface Window {
    google: {
      maps: {
        Map: typeof google.maps.Map;
        Marker: typeof google.maps.Marker;
        DirectionsService: typeof google.maps.DirectionsService;
        DirectionsRenderer: typeof google.maps.DirectionsRenderer;
        LatLng: typeof google.maps.LatLng;
        TravelMode: typeof google.maps.TravelMode;
        DirectionsStatus: typeof google.maps.DirectionsStatus;
        geometry: {
          spherical: {
            computeDistanceBetween: (latLng1: google.maps.LatLng, latLng2: google.maps.LatLng) => number;
          };
        };
      };
    };
  }
}

export {};