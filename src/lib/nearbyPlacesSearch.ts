import { Place, PlaceCategory } from "@/data/places";
import { getDistance } from "@/data/places";

export interface NearbyPlace extends Place {
  source: "local" | "osm";
  wikiUrl?: string;
}

// Overpass API categories mapping
const OSM_QUERIES: Record<string, { tags: string; category: PlaceCategory }[]> = {
  tourism: [
    { tags: '"tourism"="attraction"', category: "attraction" },
    { tags: '"tourism"="museum"', category: "heritage" },
    { tags: '"tourism"="viewpoint"', category: "nature" },
    { tags: '"tourism"="zoo"', category: "nature" },
    { tags: '"tourism"="theme_park"', category: "activities" },
  ],
  heritage: [
    { tags: '"historic"', category: "heritage" },
    { tags: '"amenity"="place_of_worship"', category: "heritage" },
  ],
  nature: [
    { tags: '"leisure"="park"', category: "nature" },
    { tags: '"leisure"="garden"', category: "nature" },
    { tags: '"leisure"="nature_reserve"', category: "nature" },
    { tags: '"natural"="water"', category: "nature" },
    { tags: '"waterway"="waterfall"', category: "nature" },
  ],
  food: [
    { tags: '"amenity"="restaurant"', category: "food" },
    { tags: '"amenity"="cafe"', category: "cafe" },
  ],
  activities: [
    { tags: '"leisure"="sports_centre"', category: "activities" },
    { tags: '"sport"', category: "activities" },
    { tags: '"leisure"="water_park"', category: "activities" },
  ],
  nightlife: [
    { tags: '"amenity"="nightclub"', category: "nightlife" },
    { tags: '"amenity"="bar"', category: "nightlife" },
  ],
};

function buildOverpassQuery(lat: number, lng: number, radiusMeters: number): string {
  const queries: string[] = [];

  // Tourism & attractions
  queries.push(`node["tourism"~"attraction|museum|viewpoint|zoo|theme_park"](around:${radiusMeters},${lat},${lng});`);
  queries.push(`way["tourism"~"attraction|museum|viewpoint|zoo|theme_park"](around:${radiusMeters},${lat},${lng});`);

  // Heritage
  queries.push(`node["historic"](around:${radiusMeters},${lat},${lng});`);
  queries.push(`way["historic"](around:${radiusMeters},${lat},${lng});`);
  queries.push(`node["amenity"="place_of_worship"]["name"](around:${radiusMeters},${lat},${lng});`);

  // Nature
  queries.push(`node["leisure"~"park|garden|nature_reserve"](around:${radiusMeters},${lat},${lng});`);
  queries.push(`way["leisure"~"park|garden|nature_reserve"](around:${radiusMeters},${lat},${lng});`);

  // Food (popular ones only)
  queries.push(`node["amenity"="restaurant"]["name"](around:${radiusMeters},${lat},${lng});`);
  queries.push(`node["amenity"="cafe"]["name"](around:${radiusMeters},${lat},${lng});`);

  // Activities
  queries.push(`node["leisure"~"sports_centre|water_park"](around:${radiusMeters},${lat},${lng});`);

  // Nightlife
  queries.push(`node["amenity"~"nightclub|bar"]["name"](around:${radiusMeters},${lat},${lng});`);

  return `[out:json][timeout:15];(${queries.join("")});out center 80;`;
}

function inferCategoryFromOSM(tags: Record<string, string>): PlaceCategory {
  const tourism = tags.tourism || "";
  const historic = tags.historic || "";
  const amenity = tags.amenity || "";
  const leisure = tags.leisure || "";
  const natural = tags.natural || "";

  if (historic || tourism === "museum" || amenity === "place_of_worship") return "heritage";
  if (leisure === "park" || leisure === "garden" || leisure === "nature_reserve" || natural) return "nature";
  if (amenity === "restaurant") return "food";
  if (amenity === "cafe") return "cafe";
  if (amenity === "nightclub" || amenity === "bar") return "nightlife";
  if (leisure === "sports_centre" || leisure === "water_park" || tourism === "theme_park") return "activities";
  if (tourism === "viewpoint" || tourism === "attraction" || tourism === "zoo") return "attraction";
  return "attraction";
}

const categoryImages: Record<PlaceCategory, string> = {
  food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
  cafe: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
  nature: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
  heritage: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80",
  nightlife: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80",
  activities: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80",
  attraction: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80",
  eco: "https://images.unsplash.com/photo-1500049242364-5f500807cdd7?w=600&q=80",
};

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

// Fetch Wikipedia image for a place
async function fetchWikiImage(name: string, lat: number, lng: number): Promise<string | null> {
  try {
    // Try geosearch first for accuracy
    const geoUrl = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lng}&gsradius=1000&gslimit=5&format=json&origin=*`;
    const geoRes = await fetch(geoUrl);
    if (geoRes.ok) {
      const geoData = await geoRes.json();
      const results = geoData?.query?.geosearch || [];
      const match = results.find((r: any) => r.title.toLowerCase().includes(name.toLowerCase().split(" ")[0]));
      const pageTitle = match?.title || (results.length > 0 ? null : null);

      if (pageTitle) {
        const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=pageimages&piprop=thumbnail&pithumbsize=600&format=json&origin=*`;
        const imgRes = await fetch(imgUrl);
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          const pages = imgData?.query?.pages;
          if (pages) {
            const page = Object.values(pages)[0] as any;
            if (page?.thumbnail?.source) return page.thumbnail.source;
          }
        }
      }
    }

    // Fallback: search by name
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&srlimit=1&format=json&origin=*`;
    const searchRes = await fetch(searchUrl);
    if (searchRes.ok) {
      const searchData = await searchRes.json();
      const title = searchData?.query?.search?.[0]?.title;
      if (title) {
        const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&piprop=thumbnail&pithumbsize=600&format=json&origin=*`;
        const imgRes = await fetch(imgUrl);
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          const pages = imgData?.query?.pages;
          if (pages) {
            const page = Object.values(pages)[0] as any;
            if (page?.thumbnail?.source) return page.thumbnail.source;
          }
        }
      }
    }
  } catch {
    // ignore
  }
  return null;
}

// Cache for nearby results
const nearbyCache = new Map<string, { places: NearbyPlace[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(lat: number, lng: number, radiusKm: number): string {
  return `${lat.toFixed(3)},${lng.toFixed(3)},${radiusKm}`;
}

export async function searchNearbyPlaces(
  userLat: number,
  userLng: number,
  radiusKm: number = 25
): Promise<NearbyPlace[]> {
  const cacheKey = getCacheKey(userLat, userLng, radiusKm);
  const cached = nearbyCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.places;
  }

  const radiusMeters = radiusKm * 1000;
  const query = buildOverpassQuery(userLat, userLng, radiusMeters);

  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!res.ok) throw new Error("Overpass API failed");

    const data = await res.json();
    const elements: OverpassElement[] = data.elements || [];

    const seenNames = new Set<string>();
    const places: NearbyPlace[] = [];

    // Process & deduplicate
    for (const el of elements) {
      const tags = el.tags || {};
      const name = tags.name || tags["name:en"];
      if (!name || name.length < 2) continue;

      const normalizedName = name.toLowerCase().trim();
      if (seenNames.has(normalizedName)) continue;
      seenNames.add(normalizedName);

      const lat = el.lat ?? el.center?.lat;
      const lng = el.lon ?? el.center?.lon;
      if (!lat || !lng) continue;

      const category = inferCategoryFromOSM(tags);
      const distance = getDistance(userLat, userLng, lat, lng);

      // Skip if beyond radius
      if (distance > radiusKm) continue;

      const description = tags.description || tags["description:en"] || 
        [tags.tourism, tags.historic, tags.amenity, tags.leisure]
          .filter(Boolean)
          .map(t => t!.replace(/_/g, " "))
          .join(" · ") || category;

      places.push({
        id: `osm-${el.type}-${el.id}`,
        name,
        description: description.charAt(0).toUpperCase() + description.slice(1),
        whyFamous: tags["wikipedia"] ? `Featured on Wikipedia` : `Popular ${category} spot`,
        thingsToTry: generateThingsToTry(category, tags),
        foodNearby: [],
        category,
        lat,
        lng,
        image: categoryImages[category],
        rating: estimateRating(tags),
        isEcoFriendly: category === "nature" || category === "eco",
        distance,
        source: "osm",
        wikiUrl: tags.wikipedia ? `https://en.wikipedia.org/wiki/${encodeURIComponent(tags.wikipedia.replace(/^en:/, ""))}` : undefined,
        bestTime: tags.opening_hours || undefined,
        entryFee: tags.fee === "yes" ? "Paid entry" : tags.fee === "no" ? "Free entry" : undefined,
      });
    }

    // Sort by distance
    places.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));

    // Limit results
    const topPlaces = places.slice(0, 50);

    // Fetch Wikipedia images for top places (in background batches)
    fetchImagesInBackground(topPlaces);

    nearbyCache.set(cacheKey, { places: topPlaces, timestamp: Date.now() });
    return topPlaces;
  } catch (err) {
    console.error("Nearby places search failed:", err);
    return [];
  }
}

// Fetch images in background without blocking
async function fetchImagesInBackground(places: NearbyPlace[]) {
  const priorityPlaces = places.slice(0, 12);
  
  for (const place of priorityPlaces) {
    fetchWikiImage(place.name, place.lat, place.lng).then(url => {
      if (url) {
        place.image = url;
        // Trigger a re-render by updating cache
        for (const [key, cached] of nearbyCache.entries()) {
          const idx = cached.places.findIndex(p => p.id === place.id);
          if (idx !== -1) {
            cached.places[idx].image = url;
          }
        }
      }
    });
  }
}

function generateThingsToTry(category: PlaceCategory, tags: Record<string, string>): string[] {
  const base: string[] = [];
  switch (category) {
    case "nature":
      base.push("Take a nature walk", "Photography", "Bird watching");
      break;
    case "heritage":
      base.push("Guided tour", "Learn the history", "Photography");
      break;
    case "food":
      base.push("Try local specialties", "Food photography");
      if (tags.cuisine) base.push(`Try ${tags.cuisine.replace(/;/g, ", ")} cuisine`);
      break;
    case "cafe":
      base.push("Try specialty coffee", "Enjoy the ambiance");
      break;
    case "activities":
      base.push("Participate in activities", "Group outing");
      break;
    case "nightlife":
      base.push("Evening visit", "Try local drinks");
      break;
    case "attraction":
      base.push("Explore the area", "Take photos", "Visit nearby spots");
      break;
    default:
      base.push("Explore and enjoy", "Take photographs");
  }
  return base.slice(0, 3);
}

function estimateRating(tags: Record<string, string>): number {
  // Use stars tag if available
  if (tags.stars) {
    const s = parseFloat(tags.stars);
    if (s >= 1 && s <= 5) return s;
  }
  // Wikipedia presence = likely notable
  if (tags.wikipedia || tags.wikidata) return 4.2 + Math.random() * 0.5;
  // Heritage sites
  if (tags.historic || tags.heritage) return 4.0 + Math.random() * 0.6;
  // Default
  return 3.5 + Math.random() * 1.0;
}

// Reverse geocode to get location name
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`,
      { headers: { "User-Agent": "GlideSmartExplorer/1.0" } }
    );
    if (!res.ok) return "your location";
    const data = await res.json();
    const addr = data.address;
    return addr?.city || addr?.town || addr?.village || addr?.county || addr?.state || "your location";
  } catch {
    return "your location";
  }
}
