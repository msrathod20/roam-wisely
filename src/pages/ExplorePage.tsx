import { useState, useMemo, useEffect, useCallback } from "react";
import { BANGALORE_PLACES, getDistance, PlaceCategory, Place } from "@/data/places";
import { KARNATAKA_PLACES } from "@/data/karnatakaPlaces";
import { useGeolocation } from "@/hooks/useGeolocation";
import PlaceCard from "@/components/PlaceCard";
import PlaceCardSkeleton from "@/components/PlaceCardSkeleton";
import PlaceDetail from "@/components/PlaceDetail";
import ExternalPlaceCard from "@/components/ExternalPlaceCard";
import ExternalPlaceDetail from "@/components/ExternalPlaceDetail";
import FilterBar from "@/components/FilterBar";
import LocationBar from "@/components/LocationBar";
import LocationPrompt from "@/components/LocationPrompt";
import { KarnatakaCity } from "@/data/karnatakaCities";
import { useApp } from "@/context/AppContext";
import { Loader2, Sparkles, Globe, RefreshCw, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { searchExternalPlaces, ExternalPlace } from "@/lib/externalPlaceSearch";
import { searchNearbyPlaces, reverseGeocode, NearbyPlace } from "@/lib/nearbyPlacesSearch";
import AddGemDialog from "@/components/AddGemDialog";
import { fetchApprovedGems, gemToPlace, UserGemRow, GemCategory } from "@/lib/userGems";
import GemHighlights from "@/components/GemHighlights";
import GemFilterChips, { GemFilter } from "@/components/GemFilterChips";

export default function ExplorePage() {
  const {
    latitude,
    longitude,
    loading,
    error,
    needsLocation,
    source,
    manualLabel,
    setManualLocation,
    retry,
  } = useGeolocation();
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
  const [locationName, setLocationName] = useState<string>("your area");

  // User-submitted gems
  const [gems, setGems] = useState<UserGemRow[]>([]);
  const [gemDialogOpen, setGemDialogOpen] = useState(false);
  const [gemFilter, setGemFilter] = useState<GemFilter>("all");

  // External search state
  const [externalResults, setExternalResults] = useState<ExternalPlace[]>([]);
  const [externalLoading, setExternalLoading] = useState(false);
  const [lastExternalQuery, setLastExternalQuery] = useState("");

  // Coords are only set when we trust them (real GPS or user-picked city)
  const hasCoords = typeof latitude === "number" && typeof longitude === "number";
  const hasPreciseLocation = hasCoords && source === "gps";
  const userLat = hasCoords ? latitude : null;
  const userLng = hasCoords ? longitude : null;

  const loadGems = useCallback(async () => {
    const rows = await fetchApprovedGems();
    setGems(rows);
  }, []);

  useEffect(() => {
    loadGems();
  }, [loadGems]);

  // Fetch nearby places from OSM whenever coords or radius change
  useEffect(() => {
    if (loading) return;
    if (!hasCoords || userLat === null || userLng === null) return;

    setNearbyLoading(true);

    // Use manual label if user picked a city; else reverse-geocode
    if (source === "manual" && manualLabel) {
      setLocationName(manualLabel);
    } else {
      reverseGeocode(userLat, userLng).then((name) => setLocationName(name));
    }

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
  }, [userLat, userLng, loading, maxDistance, hasCoords, source, manualLabel]);

  // Combine local DB places (Bangalore + Karnataka curated) + OSM nearby
  const allPlaces = useMemo(() => {
    if (!hasCoords || userLat === null || userLng === null) {
      return [];
    }

    // Merge Bangalore detailed DB + Karnataka-wide curated DB, dedupe by name
    const localDbMap = new Map<string, Place>();
    for (const p of [...BANGALORE_PLACES, ...KARNATAKA_PLACES]) {
      const key = p.name.toLowerCase().trim();
      if (!localDbMap.has(key)) localDbMap.set(key, p);
    }

    const localWithDist = Array.from(localDbMap.values()).map((p) => ({
      ...p,
      distance: getDistance(userLat, userLng, p.lat, p.lng),
      source: "local" as const,
    }));

    // Add OSM places that aren't already in local DB
    const localNames = new Set(localWithDist.map((p) => p.name.toLowerCase()));
    const osmUnique = nearbyPlaces.filter((p) => !localNames.has(p.name.toLowerCase()));

    // Merge community gems
    const gemPlaces = gems.map((g) => {
      const p = gemToPlace(g);
      return { ...p, distance: getDistance(userLat, userLng, p.lat, p.lng) };
    });

    return [...gemPlaces, ...localWithDist, ...osmUnique];
  }, [userLat, userLng, nearbyPlaces, hasCoords, gems]);

  // Approved gems sorted by distance — used for highlights & gem-only filter view
  const nearbyGems = useMemo(() => {
    if (!hasCoords || userLat === null || userLng === null) return [];
    return gems
      .map((g) => {
        const p = gemToPlace(g);
        return { ...p, distance: getDistance(userLat, userLng, p.lat, p.lng) };
      })
      .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  }, [gems, hasCoords, userLat, userLng]);

  // Counts for filter chips (over nearby gems regardless of radius)
  const gemCounts = useMemo(() => {
    const c: Partial<Record<GemFilter, number>> = { all: nearbyGems.length };
    for (const g of nearbyGems) {
      const k = g.gemCategory as GemFilter | undefined;
      if (k) c[k] = (c[k] ?? 0) + 1;
    }
    return c;
  }, [nearbyGems]);

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
    // Community gem filter — when not "all", show ONLY user gems matching that category
    if (gemFilter !== "all") {
      result = result.filter(
        (p) =>
          (p as Place & { isUserGem?: boolean }).isUserGem === true &&
          (p as Place & { gemCategory?: GemCategory }).gemCategory === gemFilter
      );
    }
    // Always filter by distance (from user's actual location)
    let inRadius = result.filter(p => (p.distance ?? 0) <= maxDistance);

    // Auto-expand: if too few local famous places nearby, gradually widen up to 300km
    if (!hasSearch && gemFilter === "all" && inRadius.length < 6) {
      const widerRadii = [maxDistance * 2, 100, 200, 300];
      for (const r of widerRadii) {
        inRadius = result.filter(p => (p.distance ?? 0) <= r);
        if (inRadius.length >= 6) break;
      }
    }
    result = inRadius;
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
  }, [allPlaces, search, selectedCategories, maxDistance, ecoOnly, user, gemFilter]);

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

  // Always-visible fallback list of top curated Karnataka places (used when no coords)
  const fallbackPlaces = useMemo(() => {
    return [...KARNATAKA_PLACES, ...BANGALORE_PLACES]
      .filter((p) => p.image && p.name && p.rating >= 4.4)
      .slice(0, 6);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 container py-6 space-y-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          Detecting your location…
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PlaceCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const showExternalSection = search.trim().length >= 3 && (externalResults.length > 0 || externalLoading);
  const isLoadingPlaces = nearbyLoading && filtered.length === 0;

  const handlePickCity = (city: KarnatakaCity) => {
    setManualLocation(city.lat, city.lng, city.name);
    setLocationName(city.name);
    setNearbyPlaces([]); // clear stale OSM results from previous location
  };

  // No coords yet → show city picker + popular Karnataka places
  if (!hasCoords) {
    return (
      <div className="flex-1 container py-8 space-y-8">
        <LocationPrompt
          error={error}
          loading={loading}
          onRetry={retry}
          onPickCity={handlePickCity}
        />
        <div>
          <h2 className="font-display text-xl font-bold text-foreground mb-4 text-center">
            ✨ Popular in Karnataka
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fallbackPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onSelect={setSelectedPlace}
                usesPreciseLocation={false}
              />
            ))}
          </div>
        </div>
        <PlaceDetail
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          usesPreciseLocation={false}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="container py-6 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="space-y-2 min-w-0">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
              Explore {locationName}
            </h1>
            <LocationBar
              cityLabel={locationName}
              source={source}
              loading={loading}
              onPickCity={handlePickCity}
              onUseMyLocation={retry}
              hasError={!!error && source !== "gps"}
            />
            <p className="text-xs text-muted-foreground">
              <span className="text-primary font-semibold">{filtered.length} places</span>{" "}
              {hasPreciseLocation ? "from your current location" : `near ${locationName}`}
            </p>
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

        {/* Community gem filter chips */}
        {nearbyGems.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-foreground uppercase tracking-wider">
              Community picks
            </p>
            <GemFilterChips value={gemFilter} onChange={setGemFilter} counts={gemCounts} />
          </div>
        )}

        {/* Hidden Gems Near You highlight */}
        {gemFilter === "all" && search.trim().length === 0 && (
          <GemHighlights
            gems={nearbyGems}
            onSelect={setSelectedPlace}
            usesPreciseLocation={hasPreciseLocation}
          />
        )}
      </div>

      <div className="flex-1 container pb-8">
        {/* Loading state */}
        {isLoadingPlaces ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PlaceCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 && !showExternalSection ? (
          <div>
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-3">
                <span className="text-3xl">🗺️</span>
              </div>
              <p className="font-display font-bold text-foreground">No matches in your filters</p>
              <p className="text-sm text-muted-foreground mt-1">
                Showing popular Karnataka destinations instead.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {fallbackPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onSelect={setSelectedPlace}
                  usesPreciseLocation={false}
                />
              ))}
            </div>
          </div>
        ) : filtered.length > 0 ? (
          <>
            {/* Popular Destinations Section */}
            {filtered.some(p => (p as any).isPopular) && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="font-display text-xl font-bold text-foreground">
                    🌟 Popular Destinations Near You
                  </h2>
                  <span className="badge-primary text-xs">Top picks</span>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered
                    .filter(p => (p as any).isPopular)
                    .slice(0, 6)
                    .map((place, i) => (
                      <motion.div
                        key={`pop-${place.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.04, 0.4) }}
                      >
                        <PlaceCard place={place} onSelect={setSelectedPlace} usesPreciseLocation={hasPreciseLocation} />
                      </motion.div>
                    ))}
                </div>
              </div>
            )}

            {/* All places */}
            <div>
              {filtered.some(p => (p as any).isPopular) && (
                <h2 className="font-display text-lg font-bold text-foreground mb-4">
                  All places nearby
                </h2>
              )}
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
            </div>
          </>
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

      {/* Floating Add Gem button */}
      <button
        onClick={() => setGemDialogOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
        aria-label="Add a hidden gem"
      >
        <Plus className="w-5 h-5" />
        <span className="hidden sm:inline">Add a Hidden Gem</span>
        <span className="sm:hidden">Add Gem</span>
        <span aria-hidden>👀</span>
      </button>

      <AddGemDialog
        open={gemDialogOpen}
        onOpenChange={setGemDialogOpen}
        defaultLat={userLat}
        defaultLng={userLng}
        onSubmitted={loadGems}
      />
    </div>
  );
}
