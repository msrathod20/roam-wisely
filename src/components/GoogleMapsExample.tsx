import { useEffect, useRef, useState } from 'react';
import { useGoogleMaps, useDirections, usePlacesAutocomplete } from '../hooks/useGoogleMaps';
import {
  calculateRoute,
  getDirectionsRenderer,
  getPlacesService,
  nearbySearch,
  textSearch,
} from '../lib/googleMapsLoader';
import { Button } from './ui/button';
import { Input } from './ui/input';

export const GoogleMapsExample = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const originInputRef = useRef<HTMLInputElement>(null);
  const destinationInputRef = useRef<HTMLInputElement>(null);
  
  const { isLoaded, error, isLoading } = useGoogleMaps();
  const { directionsService, directionsRenderer } = useDirections();
  const { getPlaceDetails: getOriginDetails } = usePlacesAutocomplete(originInputRef);
  const { getPlaceDetails: getDestinationDetails } = usePlacesAutocomplete(destinationInputRef);
  
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [routeInfo, setRouteInfo] = useState<string>('');

  // Initialize Map
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const newMap = new google.maps.Map(mapRef.current, {
      zoom: 12,
      center: { lat: 40.7128, lng: -74.006 }, // Default to NYC
      mapTypeControl: true,
    });

    setMap(newMap);

    if (directionsRenderer) {
      directionsRenderer.setMap(newMap);
    }

    return () => {
      setMap(null);
    };
  }, [isLoaded, directionsRenderer]);

  // Calculate route between origin and destination
  const handleCalculateRoute = async () => {
    if (!directionsService || !directionsRenderer || !map) {
      alert('Maps API is not fully loaded. Please wait.');
      return;
    }

    const originPlace = originInputRef.current?.value;
    const destinationPlace = destinationInputRef.current?.value;

    if (!originPlace || !destinationPlace) {
      alert('Please enter both origin and destination');
      return;
    }

    try {
      const result = await calculateRoute(
        originPlace,
        destinationPlace,
        google.maps.TravelMode.DRIVING,
        directionsService,
        directionsRenderer
      );

      if (result && result.routes[0]) {
        const leg = result.routes[0].legs[0];
        const distance = leg.distance?.text || 'N/A';
        const duration = leg.duration?.text || 'N/A';
        
        setRouteInfo(`Distance: ${distance} | Duration: ${duration}`);
      }
    } catch (err) {
      console.error('Error calculating route:', err);
      alert('Failed to calculate route');
    }
  };

  // Search for nearby places
  const handleNearbySearch = async () => {
    if (!map || !isLoaded) return;

    const placesService = getPlacesService(map);
    if (!placesService) return;

    try {
      const results = await nearbySearch(placesService, {
        location: map.getCenter()!,
        radius: 5000,
        type: 'restaurant',
      });

      console.log('Nearby places:', results);
      
      // You can display results in UI, add markers to map, etc.
    } catch (err) {
      console.error('Error searching nearby places:', err);
    }
  };

  // Search for places by text
  const handleTextSearch = async (query: string) => {
    if (!map || !isLoaded) return;

    const placesService = getPlacesService(map);
    if (!placesService) return;

    try {
      const results = await textSearch(placesService, query);
      console.log('Text search results:', results);
    } catch (err) {
      console.error('Error during text search:', err);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading Google Maps API...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">Google Maps Integration Example</h2>

      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-96 border rounded-lg"
        style={{ minHeight: '400px' }}
      />

      {/* Directions Controls */}
      <div className="space-y-2 border-t pt-4">
        <h3 className="text-lg font-semibold">Directions</h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            ref={originInputRef}
            placeholder="Enter origin address"
            className="flex-1"
          />
          <Input
            ref={destinationInputRef}
            placeholder="Enter destination address"
            className="flex-1"
          />
          <Button onClick={handleCalculateRoute} className="sm:w-auto">
            Get Directions
          </Button>
        </div>
        {routeInfo && <p className="text-sm text-gray-600">{routeInfo}</p>}
      </div>

      {/* Places Search Controls */}
      <div className="space-y-2 border-t pt-4">
        <h3 className="text-lg font-semibold">Places Search</h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={handleNearbySearch} variant="outline">
            Find Nearby Restaurants
          </Button>
          <Button
            onClick={() => handleTextSearch('pizza near me')}
            variant="outline"
          >
            Search Pizza Places
          </Button>
        </div>
      </div>

      {/* Status Info */}
      <div className="border-t pt-4 text-sm text-gray-500">
        <p>Maps API Status: {isLoaded ? '✓ Loaded' : '✗ Loading'}</p>
      </div>
    </div>
  );
};
