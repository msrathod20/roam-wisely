# Google Maps APIs Integration Guide

## Setup Complete ✓

I've set up the structure for integrating Google Maps APIs (Places, Maps JavaScript, and Directions). Here's what's been added:

### Files Created:

1. **[.env](.env)** - Environment configuration
   - Added `VITE_GOOGLE_MAPS_API_KEY` variable (replace with your API key)

2. **[src/lib/googleMapsLoader.ts](src/lib/googleMapsLoader.ts)** - Core Google Maps utilities
   - `loadGoogleMapsAPI()` - Load the API
   - `initPlacesAutocomplete()` - Set up autocomplete for location inputs
   - `getDirectionsService()` - Get directions service
   - `getDirectionsRenderer()` - Get directions renderer
   - `calculateRoute()` - Calculate and display routes
   - `getPlaceDetails()` - Get detailed place information
   - `getPlacesService()` - Initialize places service
   - `nearbySearch()` - Search for nearby places
   - `textSearch()` - Text-based place search

3. **[src/hooks/useGoogleMaps.ts](src/hooks/useGoogleMaps.ts)** - React hooks
   - `useGoogleMaps()` - Main hook to load API with loading/error states
   - `usePlacesAutocomplete()` - Hook for place autocomplete
   - `useDirections()` - Hook for directions functionality

4. **[src/components/GoogleMapsExample.tsx](src/components/GoogleMapsExample.tsx)** - Example component
   - Shows how to integrate the map, directions, and place search

## Next Steps:

### 1. Install TypeScript Types (if needed)
```bash
bun add -D @types/google.maps
```

### 2. Replace API Key
Open [.env](.env) and replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual Google Maps API key:
```
VITE_GOOGLE_MAPS_API_KEY="sk-..."
```

### 3. Enable Required APIs in Google Cloud Console
Make sure these APIs are enabled in your Google Cloud project:
- ✓ Maps JavaScript API
- ✓ Places API
- ✓ Directions API

### 4. Usage Examples

#### In a React Component:
```tsx
import { useGoogleMaps, useDirections, usePlacesAutocomplete } from '@/hooks/useGoogleMaps';
import { calculateRoute, getPlacesService, nearbySearch } from '@/lib/googleMapsLoader';

function MyComponent() {
  const { isLoaded, error } = useGoogleMaps();
  const { directionsService, directionsRenderer } = useDirections();
  const inputRef = useRef<HTMLInputElement>(null);
  const { getPlaceDetails } = usePlacesAutocomplete(inputRef);

  // Your component logic...
}
```

#### Calculate Route:
```tsx
const origin = "Times Square, NYC";
const destination = "Central Park, NYC";
const result = await calculateRoute(
  origin,
  destination,
  google.maps.TravelMode.DRIVING,
  directionsService,
  directionsRenderer
);
```

#### Search Nearby Places:
```tsx
const service = getPlacesService(map);
const results = await nearbySearch(service, {
  location: map.getCenter(),
  radius: 5000,
  type: 'restaurant'
});
```

#### Text Search:
```tsx
const results = await textSearch(service, "pizza near me");
```

### 5. Integrate into Your App

You can:
- Import `GoogleMapsExample` component to test the setup
- Add individual utilities to your existing components (e.g., ExplorePage, TripPlannerPage)
- Use the hooks in your location search, place details, and route planning features

## Notes:
- All API calls are async - use `.then()` or `async/await`
- The API loader handles loading the script only once
- Error states are captured and can be displayed to users
- The example component shows all three API features
