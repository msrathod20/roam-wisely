import { useState, useMemo, useEffect, useCallback } from "react";
import { getDistance, PlaceCategory, Place } from "@/data/places";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useNearbyPlaces } from "@/hooks/useNearbyPlaces";
import PlaceCard from "@/components/PlaceCard";
import PlaceDetail from "@/components/PlaceDetail";
import ExternalPlaceCard from "@/components/ExternalPlaceCard";
import ExternalPlaceDetail from "@/components/ExternalPlaceDetail";
import FilterBar from "@/components/FilterBar";
import { useApp } from "@/context/AppContext";
import { Loader2, MapPin, Sparkles, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { searchExternalPlaces, ExternalPlace } from "@/lib/externalPlaceSearch";

export default function ExplorePage() {
  const { latitude, longitude, loading, error } = useGeolocation();
  const { user } = useApp();
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<PlaceCategory[]>([]);
  const [maxDistance, setMaxDistance] = useState(50);
  const [ecoOnly, setEcoOnly] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedExternal, setSelectedExternal] = useState<ExternalPlace | null>(null);

  // External search state
  const [externalResults, setExternalResults] = useState<ExternalPlace[]>([]);
  const [externalLoading, setExternalLoading] = useState(false);
  const [lastExternalQuery, setLastExternalQuery] = useState("");

  // Fetch nearby places using Google Places API
  const { places: nearbyPlaces, loading: placesLoading } = useNearbyPlaces(latitude, longitude);

  const filtered = useMemo(() => {
    let result = nearbyPlaces;
    const hasSearch = search.trim().length > 0;
    
    if (hasSearch) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.thingsToTry.some(t => t.toLowerCase().includes(q)) ||
        (p.foodNearby || []).some(f => f.toLowerCase().includes(q))
      );
    }
    
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }
    
    // Always apply distance filter to nearby results (they're already within 15km by default)
    result = result.filter(p => (p.distance ?? 0) <= maxDistance);
    
    if (ecoOnly) result = result.filter(p => p.isEcoFriendly);

    if (user?.interests) {
      result.sort((a, b) => {
        const aMatch = user.interests.includes(a.category) ? 0 : 1;
        const bMatch = user.interests.includes(b.category) ? 0 : 1;
        if (aMatch !== bMatch) return aMatch - bMatch;
        return (a.distance ?? 0) - (b.distance ?? 0);
      });
    } else {
      result.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
    }
    return result;
  }, [nearbyPlaces, search, selectedCategories, maxDistance, ecoOnly, user]);

  // Debounced external search when local results are few
  const triggerExternalSearch = useCallback(async (query: string) => {
    if (query.length < 3 || query === lastExternalQuery) return;
    setExternalLoading(true);
    setLastExternalQuery(query);
    try {
      const results = await searchExternalPlaces(query);
      setExternalResults(results);
    } catch {
      setExternalResults([]);
    } finally {
      setExternalLoading(false);
    }
  }, [lastExternalQuery]);

  useEffect(() => {
    const hasSearch = search.trim().length >= 3;
    if (!hasSearch) {
      setExternalResults([]);
      setLastExternalQuery("");
      return;
    }
    // Trigger external search when local results are few or always for search
    const timer = setTimeout(() => triggerExternalSearch(search.trim()), 600);
    return () => clearTimeout(timer);
  }, [search, filtered.length, triggerExternalSearch]);

  const toggleCategory = (cat: PlaceCategory) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  if (loading || placesLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
          <div>
            <p className="font-display font-bold text-foreground">Detecting Location</p>
            <p className="text-sm text-muted-foreground">Finding the best spots near you...</p>
            {latitude && longitude && (
              <p className="text-xs text-muted-foreground mt-2 font-mono">
                Your location: {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Debug: Log place coordinates
  useEffect(() => {
    if (nearbyPlaces.length > 0 && nearbyPlaces[0].distance) {
      console.log('Place Debug Info:');
      nearbyPlaces.slice(0, 3).forEach((place, i) => {
        console.log(`${i + 1}. ${place.name}`);
        console.log(`   Coords: ${place.lat.toFixed(4)}, ${place.lng.toFixed(4)}`);
        console.log(`   Distance: ${place.distance?.toFixed(2)}km`);
      });
    }
  }, [nearbyPlaces]);

  const showExternalSection = search.trim().length >= 3 && (externalResults.length > 0 || externalLoading);

  return (
    <div className="flex-1 flex flex-col">
      <div className="container py-6 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="font-display text-3xl font-extrabold text-foreground">Explore Nearby</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              {error ? "Using your current location" : "Based on your location"}
              <span className="text-primary font-semibold">• {filtered.length} places</span>
            </p>
          </div>
          {user && (
            <div className="badge-primary hidden sm:flex">
              <Sparkles className="w-3.5 h-3.5" /> Personalized for you
            </div>
          )}
        </motion.div>

        <FilterBar
          search={search}
          onSearchChange={setSearch}
          selectedCategories={selectedCategories}
          onCategoryToggle={toggleCategory}
          maxDistance={maxDistance}
          onMaxDistanceChange={setMaxDistance}
          ecoOnly={ecoOnly}
          onEcoToggle={() => setEcoOnly(!ecoOnly)}
        />
      </div>

      <div className="flex-1 container pb-8">
        {/* Local Results */}
        {filtered.length === 0 && !showExternalSection ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
              <span className="text-4xl">🗺️</span>
            </div>
            <p className="font-display font-bold text-foreground text-lg">No local places found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {search.trim().length < 3
                ? "Try adjusting your filters or increasing the radius"
                : "Searching the web for results..."}
            </p>
          </motion.div>
        ) : filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((place, i) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <PlaceCard place={place} onSelect={setSelectedPlace} />
              </motion.div>
            ))}
          </div>
        ) : null}

        {/* External / Web Results */}
        {showExternalSection && (
          <div className={filtered.length > 0 ? "mt-10" : ""}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 mb-5"
            >
              <Globe className="w-5 h-5 text-accent-foreground" />
              <h2 className="font-display text-xl font-bold text-foreground">
                Web Results for "{search.trim()}"
              </h2>
              {externalLoading && <Loader2 className="w-4 h-4 animate-spin text-primary ml-2" />}
            </motion.div>

            {externalResults.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {externalResults.map((place, i) => (
                  <motion.div
                    key={place.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <ExternalPlaceCard place={place} onSelect={setSelectedExternal} />
                  </motion.div>
                ))}
              </div>
            ) : externalLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Searching Wikipedia & OpenStreetMap...</p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <PlaceDetail place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      <ExternalPlaceDetail place={selectedExternal} onClose={() => setSelectedExternal(null)} />
    </div>
  );
}
