/**
 * Fetch actual place photos from Google Places API
 */

export interface PlacePhoto {
  url: string;
  height: number;
  width: number;
  attributions: string[];
}

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/**
 * Get photo URL from Google Places API using a place ID
 * Returns a high-quality image URL from Google's photo service
 */
export async function getPlacePhotoUrl(
  placeId: string,
  maxWidth: number = 600
): Promise<string | null> {
  try {
    if (!(window as any).google?.maps?.places?.PlacesService) {
      console.warn('Google Places Service not available');
      return null;
    }

    return new Promise((resolve) => {
      // Create a temporary div for the service
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
            // Get the first photo
            const photo = result.photos[0];
            // Use getUrl method to get a photo reference URL
            const photoUrl = photo.getUrl({ maxWidth });
            console.log('Got Google Places photo:', photoUrl);
            resolve(photoUrl);
          } else {
            console.warn('No photos found for place:', placeId, status);
            resolve(null);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error fetching place photo:', error);
    return null;
  }
}

/**
 * Get place ID from Google Places API using a place name and location
 */
export async function getPlaceId(
  placeName: string,
  lat?: number,
  lng?: number
): Promise<string | null> {
  try {
    if (!(window as any).google?.maps?.places?.PlacesService) {
      console.warn('Google Places Service not available');
      return null;
    }

    return new Promise((resolve) => {
      const tempDiv = document.createElement('div');
      const service = new google.maps.places.PlacesService(tempDiv);

      const request: google.maps.places.PlaceSearchRequest = {
        query: placeName,
        type: 'establishment',
      };

      if (lat !== undefined && lng !== undefined) {
        request.location = new google.maps.LatLng(lat, lng);
      }

      service.textSearch(request, (results, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          results &&
          results.length > 0
        ) {
          resolve(results[0].place_id || null);
        } else {
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Error getting place ID:', error);
    return null;
  }
}

/**
 * Get place photo URL using place name and location
 * This is a combined function that first finds the place ID, then gets the photo
 */
export async function getPlacePhotoByName(
  placeName: string,
  lat?: number,
  lng?: number,
  maxWidth: number = 600
): Promise<string | null> {
  try {
    const placeId = await getPlaceId(placeName, lat, lng);
    if (!placeId) {
      console.warn(`Could not find place ID for: ${placeName}`);
      return null;
    }

    const photoUrl = await getPlacePhotoUrl(placeId, maxWidth);
    return photoUrl;
  } catch (error) {
    console.error('Error getting place photo by name:', error);
    return null;
  }
}

/**
 * Batch fetch place photos for multiple places
 * Returns a map of place name to photo URL
 */
export async function getPlacePhotosBatch(
  places: Array<{ name: string; lat?: number; lng?: number }>,
  maxWidth: number = 600
): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  // Process in parallel with a limit of 5 concurrent requests
  const processPlace = async (place: { name: string; lat?: number; lng?: number }) => {
    try {
      const photoUrl = await getPlacePhotoByName(place.name, place.lat, place.lng, maxWidth);
      if (photoUrl) {
        results.set(place.name, photoUrl);
      }
    } catch (error) {
      console.error(`Error fetching photo for ${place.name}:`, error);
    }
  };

  // Limit concurrent requests
  const chunkSize = 5;
  for (let i = 0; i < places.length; i += chunkSize) {
    const chunk = places.slice(i, i + chunkSize);
    await Promise.all(chunk.map(processPlace));
  }

  return results;
}

/**
 * Cache for place photos to avoid repeated API calls
 */
const photoCache = new Map<string, string>();

/**
 * Get cached or fetch place photo
 */
export async function getCachedPlacePhoto(
  placeName: string,
  lat?: number,
  lng?: number,
  maxWidth: number = 600
): Promise<string | null> {
  const cacheKey = `${placeName}-${lat}-${lng}`;

  // Check cache first
  if (photoCache.has(cacheKey)) {
    return photoCache.get(cacheKey) || null;
  }

  // Fetch if not in cache
  const photoUrl = await getPlacePhotoByName(placeName, lat, lng, maxWidth);

  // Store in cache
  if (photoUrl) {
    photoCache.set(cacheKey, photoUrl);
  }

  return photoUrl;
}

/**
 * Clear photo cache
 */
export function clearPhotoCache(): void {
  photoCache.clear();
}

/**
 * Get cache statistics
 */
export function getPhotoCacheStats() {
  return {
    size: photoCache.size,
    entries: Array.from(photoCache.keys()),
  };
}
