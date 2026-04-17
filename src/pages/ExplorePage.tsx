import { useState, useMemo, useEffect, useCallback } from "react";
import { BANGALORE_PLACES, getDistance, PlaceCategory, Place } from "@/data/places";
import { useGeolocation } from "@/hooks/useGeolocation";
import PlaceCard from "@/components/PlaceCard";
import PlaceDetail from "@/components/PlaceDetail";
import ExternalPlaceCard from "@/components/ExternalPlaceCard";
import ExternalPlaceDetail from "@/components/ExternalPlaceDetail";
import FilterBar from "@/components/FilterBar";
import { useApp } from "@/context/AppContext";
import { Loader2, MapPin, Sparkles, Globe, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { searchExternalPlaces, ExternalPlace } from "@/lib/externalPlaceSearch";
import { searchNearbyPlaces, reverseGeocode, NearbyPlace } from "@/lib/nearbyPlacesSearch";

export default function ExplorePage() {
  const { latitude, longitude, loading, error, isFallback } = useGeolocation();
  const { user } = useApp();
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<PlaceCategory[]>([]);
  const [maxDistance, setMaxDistance] = useState(25);
  const [ecoOnly, setEcoOnly] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedExternal, setSelectedExternal] = useState<ExternalPlace | null>(null);

  // Nearby OSM places state
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [locationName, setLocationName] = useState("your area");

  // External search state
  const [externalResults, setExternalResults] = useState<ExternalPlace[]>([]);
  const [externalLoading, setExternalLoading] = useState(false);
  const [lastExternalQuery, setLastExternalQuery] = useState("");

  // We always have coords now (real GPS or Bangalore fallback)
  const hasCoords = typeof latitude === "number" && typeof longitude === "number";
  const hasPreciseLocation = hasCoords && !isFallback;
  const userLat = hasCoords ? latitude : null;
  const userLng = hasCoords ? longitude : null;

  // Fetch nearby places from OSM whenever coords or radius change
  useEffect(() => {
    if (loading) return;
    if (!hasCoords || userLat === null || userLng === null) return;

    setNearbyLoading(true);

    // Get location name
    reverseGeocode(userLat, userLng).then(name => setLocationName(name));

    // Fetch nearby places
    searchNearbyPlaces(userLat, userLng, maxDistance)
      .then(places => {
        console.log(`[Explore] Got ${places.length} nearby places for`, userLat, userLng);
        setNearbyPlaces(places);
        setNearbyLoading(false);
      })
      .catch((err) => {
        console.error("[Explore] Nearby search failed:", err);
        setNearbyLoading(false);
      });
  }, [userLat, userLng, loading, maxDistance, hasCoords]);

  // Combine local DB places (with recalculated distance) + OSM nearby places
  const allPlaces = useMemo(() => {
    if (!hasCoords || userLat === null || userLng === null) {
      return [];
    }

    const localWithDist = BANGALORE_PLACES.map((p) => ({
      ...p,
      distance: getDistance(userLat, userLng, p.lat, p.lng),
      source: "local" as const,
    }));

    // Merge: prefer local DB entries, add OSM for places not in local DB
    const localNames = new Set(localWithDist.map(p => p.name.toLowerCase()));
    const osmUnique = nearbyPlaces.filter(p => !localNames.has(p.name.toLowerCase()));

    return [...localWithDist, ...osmUnique];
  }, [userLat, userLng, nearbyPlaces, hasCoords]);

  const filtered = useMemo(() => {
    let result = allPlaces;
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
    // Always filter by distance (from user's actual location)
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
  }, [allPlaces, search, selectedCategories, maxDistance, ecoOnly, user]);

  // Debounced external search
  const triggerExternalSearch = useCallback(async (query: string) => {
    if (query.length < 3 || query === lastExternalQuery) return;
    setExternalLoading(true);
    setLastExternalQuery(query);
    try {
      const results = await searchExternalPlaces(query);
      // Add distance to external results
       const withDistance = results.map(r => ({
        ...r,
         distance: hasPreciseLocation && userLat !== null && userLng !== null && r.lat !== 0
           ? getDistance(userLat, userLng, r.lat, r.lng)
           : undefined,
      }));
      setExternalResults(withDistance);
    } catch {
      setExternalResults([]);
    } finally {
      setExternalLoading(false);
    }
  }, [lastExternalQuery, userLat, userLng, hasPreciseLocation]);

  useEffect(() => {
    const hasSearch = search.trim().length >= 3;
    if (!hasSearch) {
      setExternalResults([]);
      setLastExternalQuery("");
      return;
    }
    const timer = setTimeout(() => triggerExternalSearch(search.trim()), 600);
    return () => clearTimeout(timer);
  }, [search, filtered.length, triggerExternalSearch]);

  const toggleCategory = (cat: PlaceCategory) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleRefresh = () => {
    if (!hasCoords || userLat === null || userLng === null) return;

    setNearbyLoading(true);
    searchNearbyPlaces(userLat, userLng, maxDistance).then(places => {
      setNearbyPlaces(places);
      setNearbyLoading(false);
    }).catch(() => setNearbyLoading(false));
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
          <div>
            <p className="font-display font-bold text-foreground">Detecting Location</p>
            <p className="text-sm text-muted-foreground">Finding the best spots near you...</p>
          </div>
        </div>
      </div>
    );
  }

  const showExternalSection = search.trim().length >= 3 && (externalResults.length > 0 || externalLoading);
  const isLoadingPlaces = nearbyLoading && filtered.length === 0;

  return (
    <div className="flex-1 flex flex-col">
      <div className="container py-6 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="font-display text-3xl font-extrabold text-foreground">
              Explore {locationName}
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              {hasPreciseLocation
                ? `Showing places near your current location`
                : "Enable location for accurate distances"}
              <span className="text-primary font-semibold">• {filtered.length} places</span>
            </p>
            {!hasPreciseLocation && error && (
              <p className="text-xs text-muted-foreground mt-1">
                Enable location access for accurate nearby distances and directions.
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {nearbyLoading && (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            )}
            <button
              onClick={handleRefresh}
              className="p-2 rounded-xl bg-muted hover:bg-accent transition-colors"
              title="Refresh nearby places"
            >
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </button>
            {user && (
              <div className="badge-primary hidden sm:flex">
                <Sparkles className="w-3.5 h-3.5" /> Personalized for you
              </div>
            )}
          </div>
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
        {/* Loading state */}
        {isLoadingPlaces ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
            <p className="font-display font-bold text-foreground">Discovering places near you...</p>
            <p className="text-sm text-muted-foreground mt-1">Searching OpenStreetMap for nearby attractions</p>
          </div>
        ) : filtered.length === 0 && !showExternalSection ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
              <span className="text-4xl">🗺️</span>
            </div>
            <p className="font-display font-bold text-foreground text-lg">No places found nearby</p>
            <p className="text-sm text-muted-foreground mt-1">
                {hasPreciseLocation
                  ? "Try increasing the radius or search for a specific place"
                  : "Enable location access to discover places near your current location"}
            </p>
          </motion.div>
        ) : filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((place, i) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.5) }}
              >
                <PlaceCard place={place} onSelect={setSelectedPlace} usesPreciseLocation={hasPreciseLocation} />
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
                    <ExternalPlaceCard
                      place={place}
                      onSelect={setSelectedExternal}
                      userLat={userLat ?? undefined}
                      userLng={userLng ?? undefined}
                      usesPreciseLocation={hasPreciseLocation}
                    />
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

      <PlaceDetail place={selectedPlace} onClose={() => setSelectedPlace(null)} usesPreciseLocation={hasPreciseLocation} />
      <ExternalPlaceDetail place={selectedExternal} onClose={() => setSelectedExternal(null)} />
    </div>
  );
}
