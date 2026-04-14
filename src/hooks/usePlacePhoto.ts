import { useState, useEffect, useCallback } from 'react';
import { loadGoogleMapsAPI } from '../lib/googleMapsLoader';
import { getCachedWikipediaImage } from '../lib/wikipediaImages';

/**
 * Search for place ID using Google Places API
 */
async function getGooglePlaceId(
  placeName: string,
  lat?: number,
  lng?: number
): Promise<string | null> {
  if (!(window as any).google?.maps?.places?.PlacesService) {
    console.warn('⚠️  Google Places Service not available - library may not be loaded');
    console.warn('   Ensure Places API is enabled in Google Cloud Console');
    return null;
  }

  return new Promise((resolve) => {
    try {
      const tempDiv = document.createElement('div');
      const service = new google.maps.places.PlacesService(tempDiv);

      const request: google.maps.places.PlaceSearchRequest = {
        query: placeName,
        type: 'establishment',
      };

      if (lat !== undefined && lng !== undefined) {
        request.location = new google.maps.LatLng(lat, lng);
        request.radius = 50000; // 50km radius
      }

      service.textSearch(request, (results, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          results &&
          results.length > 0
        ) {
          console.log('✓ Found place via Google Places:', results[0].name);
          resolve(results[0].place_id || null);
        } else {
          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            console.warn(`⚠️  Places API returned status: ${status}`);
          }
          resolve(null);
        }
      });
    } catch (err) {
      console.error('❌ Error creating PlacesService:', err);
      resolve(null);
    }
  });
}

/**
 * Get photo from place ID using Google Places API
 */
async function getGooglePlacePhoto(placeId: string): Promise<string | null> {
  if (!(window as any).google?.maps?.places?.PlacesService) {
    return null;
  }

  return new Promise((resolve) => {
    const tempDiv = document.createElement('div');
    const service = new google.maps.places.PlacesService(tempDiv);

    service.getDetails(
      {
        placeId,
        fields: ['photos', 'name'],
      },
      (result, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          result?.photos &&
          result.photos.length > 0
        ) {
          const photo = result.photos[0];
          const photoUrl = photo.getUrl({ maxWidth: 600 });
          console.log('✓ Got photo from Google Places for:', result.name);
          resolve(photoUrl);
        } else {
          console.warn('✗ No photos found for place ID:', placeId);
          resolve(null);
        }
      }
    );
  });
}

/**
 * Cache for place photos
 */
const photoCache = new Map<string, string | null>();

/**
 * Hook to fetch place photos from Google Places API with Wikipedia fallback
 */
export const usePlacePhoto = (
  placeName: string,
  lat?: number,
  lng?: number,
  fallbackImage?: string
) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(fallbackImage || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!placeName) return;

    let isMounted = true;

    const fetchPhoto = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const cacheKey = `${placeName}-${lat}-${lng}`;

        // Check cache first
        if (photoCache.has(cacheKey)) {
          const cached = photoCache.get(cacheKey);
          if (isMounted) {
            setPhotoUrl(cached || fallbackImage || null);
            setIsLoading(false);
          }
          return;
        }

        // Load Google Maps API
        console.log('📍 Loading Google Maps API for:', placeName);
        await loadGoogleMapsAPI();

        // Try Google Places API first (DISABLED - requires billing)
        let url: string | null = null;
        // Skip Google Places API for now - falling back to Wikipedia
        // TODO: Enable when billing is set up in Google Cloud Console

        // Fallback to Wikipedia if Google Places fails
        if (!url) {
          console.log('📚 Falling back to Wikipedia for:', placeName);
          url = await getCachedWikipediaImage(placeName);
        }

        // Cache the result
        photoCache.set(cacheKey, url);

        if (isMounted) {
          setPhotoUrl(url || fallbackImage || null);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err : new Error(String(err));
          setError(errorMessage);
          setPhotoUrl(fallbackImage || null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const timer = setTimeout(fetchPhoto, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [placeName, lat, lng, fallbackImage]);

  return { photoUrl, isLoading, error };
};

/**
 * Hook to batch fetch photos for multiple places
 */
export const useBatchPlacePhotos = (
  places: Array<{ name: string; lat?: number; lng?: number }>,
  fallbackImages?: Record<string, string>
) => {
  const { isLoaded } = useGoogleMaps();
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isLoaded || !places || places.length === 0) return;

    let isMounted = true;

    const fetchPhotos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const results: Record<string, string> = {};

        // Process in parallel with a limit
        const chunkSize = 3;
        for (let i = 0; i < places.length; i += chunkSize) {
          const chunk = places.slice(i, i + chunkSize);

          const chunkResults = await Promise.allSettled(
            chunk.map(async (place) => {
              try {
                const url = await getCachedPlacePhoto(place.name, place.lat, place.lng);
                return {
                  name: place.name,
                  url: url || fallbackImages?.[place.name] || null,
                };
              } catch {
                return {
                  name: place.name,
                  url: fallbackImages?.[place.name] || null,
                };
              }
            })
          );

          for (const result of chunkResults) {
            if (result.status === 'fulfilled' && result.value.url) {
              results[result.value.name] = result.value.url;
            }
          }
        }

        if (isMounted) {
          setPhotos(results);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err : new Error(String(err));
          setError(errorMessage);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const timer = setTimeout(fetchPhotos, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isLoaded, places, fallbackImages]);

  const getPhotoUrl = useCallback(
    (placeName: string): string | null => {
      return photos[placeName] || fallbackImages?.[placeName] || null;
    },
    [photos, fallbackImages]
  );

  return { photos, isLoading, error, getPhotoUrl };
};
