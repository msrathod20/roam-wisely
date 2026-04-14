import { useState, useEffect, useCallback } from 'react';
import { Place, PlaceCategory, BANGALORE_PLACES } from '@/data/places';
import { getDistance } from '@/data/places';

export interface PlacesSearchOptions {
  radius?: number; // in meters (default 5000 = 5km)
  types?: string[]; // Google place types
  keyword?: string;
}

// Popular place types for Nominatim keyword search
const PLACE_KEYWORDS = [
  'restaurant',
  'cafe',
  'museum',
  'park',
  'temple',
  'church',
  'monument',
  'hotel',
  'bar'
];

interface NominatimPlace {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  class: string;
  importance: number;
}

async function searchNominatimNearby(
  latitude: number,
  longitude: number,
  radius: number = 15000
): Promise<Place[]> {
  try {
    const allPlaces: Place[] = [];
    
    // Search for multiple place types
    for (const keyword of PLACE_KEYWORDS.slice(0, 3)) {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${keyword}&lat=${latitude}&lon=${longitude}&radius=${radius}&limit=5`;
        const response = await fetch(url, {
          headers: { 'User-Agent': 'ExplorerApp/1.0' }
        });
        
        if (!response.ok) continue;
        
        const results: NominatimPlace[] = await response.json();
        
        results.forEach((place) => {
          const lat = parseFloat(place.lat);
          const lon = parseFloat(place.lon);
          const dist = getDistance(latitude, longitude, lat, lon);
          
          // Only include places within radius
          if (dist <= (radius / 1000)) {
            allPlaces.push({
              id: `nominatim_${place.place_id}_${keyword}`,
              name: place.display_name.split(',')[0] || 'Place',
              description: place.display_name,
              whyFamous: place.display_name,
              lat,
              lng: lon,
              image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
              rating: Math.min(5, 3 + place.importance),
              isEcoFriendly: false,
              category: inferCategory([place.type, place.class]) as PlaceCategory,
              thingsToTry: [`Visit ${place.display_name.split(',')[0]}`],
              distance: dist,
            });
          }
        });
      } catch {
        // Continue with next keyword if one fails
        continue;
      }
    }
    
    // Remove duplicates and return unique places
    const uniqueMap = new Map();
    allPlaces.forEach(place => {
      const key = `${place.lat.toFixed(4)}_${place.lng.toFixed(4)}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, place);
      }
    });
    
    return Array.from(uniqueMap.values()).slice(0, 20);
  } catch (err) {
    console.warn('Nominatim search failed:', err);
    return [];
  }
}

export function useNearbyPlaces(latitude: number | null, longitude: number | null) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchNearbyPlaces = useCallback(async (options: PlacesSearchOptions = {}) => {
    if (!latitude || !longitude) {
      // Use fallback places if no location
      const withDistance = BANGALORE_PLACES.map(p => ({
        ...p,
        distance: getDistance(0, 0, p.lat, p.lng),
      }));
      setPlaces(withDistance);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Try Google Places first
      const hasPlacesService = (window as any).google?.maps?.places?.PlacesService;
      
      if (hasPlacesService) {
        try {
          const service = new google.maps.places.PlacesService(
            document.createElement('div')
          );

          const request: google.maps.places.PlaceSearchRequest = {
            location: new google.maps.LatLng(latitude, longitude),
            radius: options.radius || 15000, // default 15km
            ...(options.types && { type: options.types[0] }),
            ...(options.keyword && { keyword: options.keyword }),
          };

          return new Promise<void>((resolve) => {
            service.nearbySearch(request, async (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                const convertedPlaces: Place[] = results
                  .filter((place) => place.geometry?.location && place.type)
                  .slice(0, 20)
                  .map((place, index): Place => {
                    const lat = place.geometry!.location!.lat();
                    const lng = place.geometry!.location!.lng();
                    
                    return {
                      id: place.place_id || `place_${index}`,
                      name: place.name || 'Unknown Place',
                      description: place.formatted_address || '',
                      whyFamous: place.name || 'Interesting place',
                      lat,
                      lng,
                      image:
                        place.photos?.[0]?.getUrl({ maxWidth: 400, maxHeight: 400 }) ||
                        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
                      rating: place.rating || 3.5,
                      isEcoFriendly: false,
                      category: inferCategory(place.types || []) as PlaceCategory,
                      thingsToTry: place.types || ['Visit this place'],
                      distance: getDistance(latitude, longitude, lat, lng),
                    };
                  });

                setPlaces(convertedPlaces);
                resolve();
              } else {
                // Google Places failed, try Nominatim
                console.warn(`Google Places status: ${status}, trying Nominatim...`);
                const nominatimPlaces = await searchNominatimNearby(latitude, longitude, options.radius || 15000);
                
                if (nominatimPlaces.length > 0) {
                  setPlaces(nominatimPlaces);
                  resolve();
                } else {
                  // Fallback to Bangalore places
                  const withDistance = BANGALORE_PLACES.map(p => ({
                    ...p,
                    distance: getDistance(latitude, longitude, p.lat, p.lng),
                  }));
                  setPlaces(withDistance);
                  resolve();
                }
              }
            });
          });
        } catch (err) {
          console.warn('Google Places error:', err, '- trying Nominatim');
          // Google Places threw error, try Nominatim
          const nominatimPlaces = await searchNominatimNearby(latitude, longitude, options.radius || 15000);
          
          if (nominatimPlaces.length > 0) {
            setPlaces(nominatimPlaces);
          } else {
            // Fallback to Bangalore places
            const withDistance = BANGALORE_PLACES.map(p => ({
              ...p,
              distance: getDistance(latitude, longitude, p.lat, p.lng),
            }));
            setPlaces(withDistance);
          }
        }
      } else {
        // No Google Places, try Nominatim
        console.warn('Google Places not loaded - trying Nominatim');
        const nominatimPlaces = await searchNominatimNearby(latitude, longitude, options.radius || 15000);
        
        if (nominatimPlaces.length > 0) {
          setPlaces(nominatimPlaces);
        } else {
          // Fallback to Bangalore places
          const withDistance = BANGALORE_PLACES.map(p => ({
            ...p,
            distance: getDistance(latitude, longitude, p.lat, p.lng),
          }));
          setPlaces(withDistance);
        }
      }
    } catch (err) {
      console.warn('Nearby places search error:', err);
      // Always have a fallback
      const withDistance = BANGALORE_PLACES.map(p => ({
        ...p,
        distance: getDistance(latitude, longitude, p.lat, p.lng),
      }));
      setPlaces(withDistance);
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude]);

  // Auto-search on mount
  useEffect(() => {
    searchNearbyPlaces({ radius: 15000 }); // 15km default radius
  }, [latitude, longitude, searchNearbyPlaces]);

  return { places, loading, error, searchNearbyPlaces };
}

function inferCategory(types: string[]): PlaceCategory {
  const typeStr = types.join(' ').toLowerCase();
  
  if (typeStr.includes('restaurant') || typeStr.includes('food')) return 'food';
  if (typeStr.includes('cafe') || typeStr.includes('bakery')) return 'cafe';
  if (typeStr.includes('park') || typeStr.includes('garden') || typeStr.includes('natural')) return 'nature';
  if (typeStr.includes('museum') || typeStr.includes('historical') || typeStr.includes('church') || typeStr.includes('temple')) return 'heritage';
  if (typeStr.includes('bar') || typeStr.includes('night_club')) return 'nightlife';
  if (typeStr.includes('amusement') || typeStr.includes('park') || typeStr.includes('sports')) return 'activities';
  if (typeStr.includes('point_of_interest') || typeStr.includes('landmark')) return 'attraction';
  
  return 'attraction';
}
