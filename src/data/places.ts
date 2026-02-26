import { Leaf, Utensils, Landmark, TreePine, Music, Bike, Camera, Coffee } from "lucide-react";

export type PlaceCategory = "food" | "heritage" | "nature" | "nightlife" | "eco" | "activities" | "attraction" | "cafe";

export interface Place {
  id: string;
  name: string;
  description: string;
  whyFamous: string;
  thingsToTry: string[];
  culturalInsight?: string;
  category: PlaceCategory;
  lat: number;
  lng: number;
  image: string;
  rating: number;
  isEcoFriendly: boolean;
  distance?: number;
}

export interface UserPreferences {
  interests: PlaceCategory[];
}

export const categoryConfig: Record<PlaceCategory, { label: string; icon: typeof Leaf; color: string }> = {
  food: { label: "Food", icon: Utensils, color: "hsl(var(--secondary))" },
  heritage: { label: "Heritage", icon: Landmark, color: "hsl(var(--primary))" },
  nature: { label: "Nature", icon: TreePine, color: "hsl(var(--eco))" },
  nightlife: { label: "Nightlife", icon: Music, color: "hsl(var(--warning))" },
  eco: { label: "Eco-Friendly", icon: Leaf, color: "hsl(var(--eco))" },
  activities: { label: "Activities", icon: Bike, color: "hsl(var(--secondary))" },
  attraction: { label: "Attraction", icon: Camera, color: "hsl(var(--primary))" },
  cafe: { label: "Café", icon: Coffee, color: "hsl(var(--warning))" },
};

export const BANGALORE_PLACES: Place[] = [
  {
    id: "1",
    name: "Lalbagh Botanical Garden",
    description: "A sprawling 240-acre garden with rare plant species, a glass house, and a beautiful lake.",
    whyFamous: "One of India's premier botanical gardens built by Hyder Ali in 1760.",
    thingsToTry: ["Walk around the lake", "Visit the Glass House", "Morning yoga sessions", "Flower show (Jan & Aug)"],
    culturalInsight: "The garden houses over 1,800 plant species including trees that are a few centuries old.",
    category: "nature",
    lat: 12.9507,
    lng: 77.5848,
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80",
    rating: 4.6,
    isEcoFriendly: true,
  },
  {
    id: "2",
    name: "Bangalore Palace",
    description: "A Tudor-style palace built in 1887, inspired by England's Windsor Castle.",
    whyFamous: "Stunning architecture and royal heritage of the Wadiyar dynasty.",
    thingsToTry: ["Guided palace tour", "Photography in the gardens", "Visit the amusement park nearby"],
    culturalInsight: "The palace grounds cover 454 acres and host major concerts and events.",
    category: "heritage",
    lat: 12.9988,
    lng: 77.5921,
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80",
    rating: 4.3,
    isEcoFriendly: false,
  },
  {
    id: "3",
    name: "VV Puram Food Street",
    description: "A vibrant street food paradise offering South Indian delicacies and chaats.",
    whyFamous: "Bangalore's most famous street food destination with over 40 stalls.",
    thingsToTry: ["Dosa varieties", "Churmuri", "Sugarcane juice", "Pani Puri", "Akki Roti"],
    category: "food",
    lat: 12.9455,
    lng: 77.5730,
    image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80",
    rating: 4.5,
    isEcoFriendly: false,
  },
  {
    id: "4",
    name: "Cubbon Park",
    description: "A green lung of Bangalore spread across 300 acres in the heart of the city.",
    whyFamous: "Historic park established in 1870 with Gothic-style buildings and shady walking paths.",
    thingsToTry: ["Morning jog", "Visit the library", "Band stand concerts", "Birdwatching"],
    culturalInsight: "Home to the iconic Attara Kacheri (High Court) and the State Library.",
    category: "nature",
    lat: 12.9763,
    lng: 77.5929,
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
    rating: 4.5,
    isEcoFriendly: true,
  },
  {
    id: "5",
    name: "Church Street Social",
    description: "A trendy café-bar space with creative cocktails and an industrial aesthetic.",
    whyFamous: "Iconic hangout spot for Bangalore's young crowd with amazing rooftop vibes.",
    thingsToTry: ["Signature cocktails", "Wood-fired pizza", "Live music nights"],
    category: "nightlife",
    lat: 12.9735,
    lng: 77.6066,
    image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&q=80",
    rating: 4.2,
    isEcoFriendly: false,
  },
  {
    id: "6",
    name: "Nandi Hills",
    description: "A scenic hilltop fortress 60km from Bangalore, perfect for sunrise views.",
    whyFamous: "Tipu Sultan's summer retreat with breathtaking sunrise views above the clouds.",
    thingsToTry: ["Sunrise viewing", "Cycling uphill", "Paragliding", "Visit Tipu's Drop"],
    culturalInsight: "The hill has temples dating back to the Chola dynasty period.",
    category: "activities",
    lat: 13.3702,
    lng: 77.6835,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
    rating: 4.7,
    isEcoFriendly: true,
  },
  {
    id: "7",
    name: "ISKCON Temple",
    description: "One of the largest ISKCON temples in the world, a spiritual and architectural marvel.",
    whyFamous: "Beautiful neo-classical architecture and serene spiritual atmosphere.",
    thingsToTry: ["Evening aarti", "Prasadam at Govindas restaurant", "Temple garden walk"],
    category: "heritage",
    lat: 13.0098,
    lng: 77.5510,
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600&q=80",
    rating: 4.6,
    isEcoFriendly: false,
  },
  {
    id: "8",
    name: "Third Wave Coffee",
    description: "Artisanal coffee roasters serving single-origin brews in a cozy atmosphere.",
    whyFamous: "Part of Bangalore's thriving specialty coffee culture.",
    thingsToTry: ["Pour-over coffee", "Cold brew", "Banana bread", "Avocado toast"],
    category: "cafe",
    lat: 12.9716,
    lng: 77.6412,
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80",
    rating: 4.4,
    isEcoFriendly: true,
  },
  {
    id: "9",
    name: "Bannerghatta Biological Park",
    description: "A wildlife sanctuary with safari, zoo, butterfly park, and rescue center.",
    whyFamous: "One of India's few places to experience a safari so close to a major city.",
    thingsToTry: ["Lion & tiger safari", "Butterfly conservatory", "Nature trail hiking"],
    culturalInsight: "Spans 25,000 acres and is home to rescued elephants and big cats.",
    category: "eco",
    lat: 12.8005,
    lng: 77.5773,
    image: "https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=600&q=80",
    rating: 4.3,
    isEcoFriendly: true,
  },
  {
    id: "10",
    name: "UB City Mall",
    description: "Bangalore's luxury shopping destination with premium brands and fine dining.",
    whyFamous: "India's first luxury mall built on the historic UB Group headquarters.",
    thingsToTry: ["Luxury shopping", "Rooftop dining at Caperberry", "Art exhibitions"],
    category: "attraction",
    lat: 12.9716,
    lng: 77.5946,
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80",
    rating: 4.1,
    isEcoFriendly: false,
  },
  {
    id: "11",
    name: "Toit Brewpub",
    description: "Award-winning brewpub with handcrafted beers and delicious food.",
    whyFamous: "Pioneered the microbrewery culture in Bangalore.",
    thingsToTry: ["Toit Weiss beer", "BBQ platter", "Live screening events"],
    category: "nightlife",
    lat: 12.9784,
    lng: 77.6408,
    image: "https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=600&q=80",
    rating: 4.5,
    isEcoFriendly: false,
  },
  {
    id: "12",
    name: "Hesaraghatta Grasslands",
    description: "A unique grassland ecosystem on the outskirts of Bangalore, perfect for birdwatching.",
    whyFamous: "One of the last remaining grassland ecosystems near a metro city.",
    thingsToTry: ["Birdwatching", "Photography", "Nature walks", "Star gazing"],
    culturalInsight: "An important habitat for the critically endangered Indian bustard.",
    category: "eco",
    lat: 13.1362,
    lng: 77.4860,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    rating: 4.0,
    isEcoFriendly: true,
  },
];

export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
