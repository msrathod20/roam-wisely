import { useEffect, useState, useCallback } from 'react';
import { loadGoogleMapsAPI } from '../lib/googleMapsLoader';

/**
 * Hook to load and initialize Google Maps API
 */
export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initializeGoogleMaps = async () => {
      try {
        setIsLoading(true);
        console.log('🚀 Initializing Google Maps API...');
        
        await loadGoogleMapsAPI();
        
        if (isMounted) {
          setIsLoaded(true);
          setError(null);
          console.log('✅ Google Maps API initialized successfully');
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err : new Error(String(err));
          console.warn('⚠️  Google Maps API initialization warning:', errorMessage.message);
          console.log('   Place photos will use Wikipedia fallback');
          setError(errorMessage);
          // Don't set isLoaded to false - allow fallback to work
          setIsLoaded(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeGoogleMaps();

    return () => {
      isMounted = false;
    };
  }, []);

  return { isLoaded, error, isLoading };
};

/**
 * Hook for Places Autocomplete
 */
export const usePlacesAutocomplete = (inputRef: React.RefObject<HTMLInputElement>) => {
  const { isLoaded } = useGoogleMaps();
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    const { initPlacesAutocomplete } = require('../lib/googleMapsLoader');
    const instance = initPlacesAutocomplete(inputRef.current);
    setAutocomplete(instance);

    return () => {
      setAutocomplete(null);
    };
  }, [isLoaded, inputRef]);

  const getPlaceDetails = useCallback(() => {
    if (!autocomplete) return null;
    return autocomplete.getPlace();
  }, [autocomplete]);

  return { autocomplete, getPlaceDetails };
};

/**
 * Hook for Directions
 */
export const useDirections = () => {
  const { isLoaded } = useGoogleMaps();
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const { getDirectionsService, getDirectionsRenderer } = require('../lib/googleMapsLoader');
    setDirectionsService(getDirectionsService());
    setDirectionsRenderer(getDirectionsRenderer());
  }, [isLoaded]);

  return { directionsService, directionsRenderer };
};
