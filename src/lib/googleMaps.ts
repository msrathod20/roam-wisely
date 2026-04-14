import { Loader } from "@googlemaps/js-api-loader";

export const GOOGLE_MAPS_API_KEY = "AIzaSyD60uaf2flWxU1s3uZmFz0Ww30LVBaYkBU";

const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: "weekly",
  libraries: ["places"],
});

let placesService: google.maps.places.PlacesService | null = null;
let loadPromise: Promise<void> | null = null;

export async function getPlacesService(): Promise<google.maps.places.PlacesService> {
  if (placesService) return placesService;

  if (!loadPromise) {
    loadPromise = loader.importLibrary("places").then(() => {
      const div = document.createElement("div");
      placesService = new google.maps.places.PlacesService(div);
    });
  }

  await loadPromise;
  return placesService!;
}

// Cache for photo URLs to avoid redundant API calls
const photoCache = new Map<string, string>();

export async function getPlacePhotoUrl(
  placeName: string,
  lat?: number,
  lng?: number
): Promise<string | null> {
  const cacheKey = `${placeName}-${lat}-${lng}`;
  if (photoCache.has(cacheKey)) return photoCache.get(cacheKey)!;

  try {
    const service = await getPlacesService();

    return new Promise((resolve) => {
      const request: google.maps.places.FindPlaceFromQueryRequest = {
        query: `${placeName} Bangalore Karnataka`,
        fields: ["photos", "place_id"],
        ...(lat && lng
          ? {
              locationBias: new google.maps.LatLng(lat, lng),
            }
          : {}),
      };

      service.findPlaceFromQuery(request, (results, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          results &&
          results[0]?.photos &&
          results[0].photos.length > 0
        ) {
          const url = results[0].photos[0].getUrl({
            maxWidth: 600,
            maxHeight: 400,
          });
          photoCache.set(cacheKey, url);
          resolve(url);
        } else {
          resolve(null);
        }
      });
    });
  } catch {
    return null;
  }
}

export function getGoogleMapsDirectionsUrl(
  destLat: number,
  destLng: number,
  placeName?: string
): string {
  const destination = placeName
    ? encodeURIComponent(placeName)
    : `${destLat},${destLng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
}

export function getGoogleMapsSearchUrl(
  placeName: string,
  lat: number,
  lng: number
): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}&query_place_id=&center=${lat},${lng}`;
}
