/**
 * Google Maps API Loader
 * Handles loading the Google Maps JavaScript API with Places and Directions services
 */

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Library identifiers for Google Maps
const LIBRARIES = ['places', 'geometry'];

/**
 * Load Google Maps API script
 */
export const loadGoogleMapsAPI = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as any).google?.maps?.places) {
      console.log('✓ Google Maps API already loaded');
      resolve();
      return;
    }

    if (!API_KEY) {
      console.error('❌ VITE_GOOGLE_MAPS_API_KEY is not set in environment variables');
      reject(new Error('Google Maps API key is missing'));
      return;
    }

    // Create a callback name for the global scope
    const callbackName = `__gmaps_init_${Date.now()}`;
    
    // Set up the callback function
    (window as any)[callbackName] = () => {
      console.log('✓ Google Maps API loaded successfully');
      delete (window as any)[callbackName];
      resolve();
    };

    const script = document.createElement('script');
    const librariesParam = LIBRARIES.join(',');
    
    // Load Google Maps API with libraries, callback, and loading=async
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=${librariesParam}&callback=${callbackName}&loading=async`;
    script.type = 'text/javascript';
    script.async = true;
    
    script.onerror = () => {
      delete (window as any)[callbackName];
      console.error('❌ Failed to load Google Maps API');
      reject(new Error('Failed to load Google Maps API'));
    };
    
    document.head.appendChild(script);
  });
};

/**
 * Initialize Places Autocomplete for input field
 */
export const initPlacesAutocomplete = (
  inputElement: HTMLInputElement,
  options?: google.maps.places.AutocompleteOptions
): google.maps.places.Autocomplete | null => {
  if (!inputElement || !(window as any).google?.maps?.places) {
    console.error('Input element or Google Maps Places API not available');
    return null;
  }

  return new google.maps.places.Autocomplete(inputElement, {
    fields: ['address_components', 'formatted_address', 'geometry', 'name'],
    ...options,
  });
};

/**
 * Initialize Directions Service
 */
export const getDirectionsService = (): google.maps.DirectionsService | null => {
  if (!(window as any).google?.maps?.DirectionsService) {
    console.error('Google Maps Directions API not available');
    return null;
  }

  return new google.maps.DirectionsService();
};

/**
 * Initialize Directions Renderer
 */
export const getDirectionsRenderer = (
  options?: google.maps.DirectionsRendererOptions
): google.maps.DirectionsRenderer | null => {
  if (!(window as any).google?.maps?.DirectionsRenderer) {
    console.error('Google Maps Directions Renderer not available');
    return null;
  }

  return new google.maps.DirectionsRenderer(options);
};

/**
 * Calculate route and render directions on map
 */
export const calculateRoute = (
  origin: string | google.maps.LatLngLiteral,
  destination: string | google.maps.LatLngLiteral,
  mode: google.maps.TravelMode = google.maps.TravelMode.DRIVING,
  directionsService: google.maps.DirectionsService,
  directionsRenderer: google.maps.DirectionsRenderer
): Promise<google.maps.DirectionsResult> => {
  return new Promise((resolve, reject) => {
    directionsService.route(
      {
        origin,
        destination,
        travelMode: mode,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          directionsRenderer.setDirections(result);
          resolve(result);
        } else {
          reject(new Error(`Directions request failed: ${status}`));
        }
      }
    );
  });
};

/**
 * Get place details using Places Library
 */
export const getPlaceDetails = (
  placeId: string,
  fields?: string[]
): Promise<google.maps.places.PlaceResult | null> => {
  return new Promise((resolve, reject) => {
    if (!(window as any).google?.maps?.places?.PlacesService) {
      reject(new Error('Google Maps Places API not available'));
      return;
    }

    // Create a temporary div for the service
    const tempDiv = document.createElement('div');
    const service = new google.maps.places.PlacesService(tempDiv);

    const defaultFields = [
      'address_component',
      'formatted_address',
      'geometry',
      'formatted_phone_number',
      'opening_hours',
      'website',
      'rating',
      'reviews',
      'photos',
    ];

    service.getDetails(
      {
        placeId,
        fields: fields || defaultFields,
      },
      (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(result);
        } else {
          reject(new Error(`Place details request failed: ${status}`));
        }
      }
    );
  });
};

/**
 * Initialize Places Service for maps
 */
export const getPlacesService = (
  map: google.maps.Map
): google.maps.places.PlacesService | null => {
  if (!(window as any).google?.maps?.places?.PlacesService) {
    console.error('Google Maps Places Service not available');
    return null;
  }

  return new google.maps.places.PlacesService(map);
};

/**
 * Nearby Places Search
 */
export const nearbySearch = (
  service: google.maps.places.PlacesService,
  request: google.maps.places.PlaceSearchRequest
): Promise<google.maps.places.PlaceResult[] | null> => {
  return new Promise((resolve, reject) => {
    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        resolve(results);
      } else {
        reject(new Error(`Nearby search failed: ${status}`));
      }
    });
  });
};

/**
 * Text Search for places
 */
export const textSearch = (
  service: google.maps.places.PlacesService,
  query: string,
  location?: google.maps.LatLng
): Promise<google.maps.places.PlaceResult[] | null> => {
  return new Promise((resolve, reject) => {
    service.textSearch(
      {
        query,
        location,
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(results);
        } else {
          reject(new Error(`Text search failed: ${status}`));
        }
      }
    );
  });
};
