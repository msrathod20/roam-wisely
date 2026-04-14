// Distance Calculation Debug Tool
// Test the Haversine formula with your actual location

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Test with known coordinates
// Example: Bangalore -> Delhi
const bangaloreToDelhi = getDistance(12.9716, 77.5946, 28.7041, 77.1025);
console.log(`Bangalore to Delhi: ${bangaloreToDelhi.toFixed(2)} km`);
// Expected: ~2150 km

// Example: NYC to LA
const nycToLA = getDistance(40.7128, -74.0060, 34.0522, -118.2437);
console.log(`NYC to LA: ${nycToLA.toFixed(2)} km`);
// Expected: ~3944 km

// Test places distance (for debugging)
// Replace with your actual coordinates
const yourLocation = { lat: 0, lon: 0 }; // SET YOUR COORDINATES HERE
const testPlace = { lat: 0.1, lon: 0.1 }; // SET PLACE COORDINATES HERE
const distance = getDistance(yourLocation.lat, yourLocation.lon, testPlace.lat, testPlace.lon);
console.log(`Distance: ${distance.toFixed(2)} km`);

console.log(`
If distance shows 1.1km but actual is 14km, possible causes:
1. User location wrong (permission issue, default fallback)
2. Place coordinates wrong (Nominatim returning wrong data)
3. Showing Bangalore demo places for non-Bangalore location

Check browser console for actual coordinates being used.
`);
