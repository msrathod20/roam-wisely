import { useState, useMemo, lazy, Suspense } from "react";
import { BANGALORE_PLACES, getDistance, PlaceCategory, Place } from "@/data/places";
import { useGeolocation } from "@/hooks/useGeolocation";
const ExploreMap = lazy(() => import("@/components/ExploreMap"));
import PlaceCard from "@/components/PlaceCard";
import PlaceDetail from "@/components/PlaceDetail";
import FilterBar from "@/components/FilterBar";
import { useApp } from "@/context/AppContext";
import { Loader2, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function ExplorePage() {
  const { latitude, longitude, loading, error } = useGeolocation();
  const { user } = useApp();
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<PlaceCategory[]>([]);
  const [maxDistance, setMaxDistance] = useState(100);
  const [ecoOnly, setEcoOnly] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [viewMode, setViewMode] = useState<"split" | "list" | "map">("list");

  const userLat = latitude ?? 12.9716;
  const userLng = longitude ?? 77.5946;

  const placesWithDistance = useMemo(() => {
    return BANGALORE_PLACES.map((p) => ({
      ...p,
      distance: getDistance(userLat, userLng, p.lat, p.lng),
    }));
  }, [userLat, userLng]);

  const filtered = useMemo(() => {
    let result = placesWithDistance;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }
    result = result.filter(p => (p.distance ?? 0) <= maxDistance);
    if (ecoOnly) result = result.filter(p => p.isEcoFriendly);

    // Sort by user interests first, then distance
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
  }, [placesWithDistance, search, selectedCategories, maxDistance, ecoOnly, user]);

  const toggleCategory = (cat: PlaceCategory) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Detecting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="container py-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Explore</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {error ? "Using default location (Bangalore)" : "Based on your location"}
              • {filtered.length} places found
            </p>
          </div>
          <div className="hidden md:flex gap-1 bg-muted rounded-lg p-1">
            {(["split", "list", "map"] as const).map(m => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors ${
                  viewMode === m ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

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

      <div className="flex-1 container pb-6">
        <div className={`grid gap-4 h-full ${
          viewMode === "split" ? "lg:grid-cols-2" : ""
        }`}>
          {viewMode !== "list" && (
            <div className="rounded-xl overflow-hidden border border-border h-[400px] lg:h-[600px]">
              <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-muted"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}>
                <ExploreMap
                  places={filtered}
                  userLocation={[userLat, userLng]}
                  onSelectPlace={setSelectedPlace}
                  selectedPlace={selectedPlace}
                />
              </Suspense>
            </div>
          )}
          {viewMode !== "map" && (
            <div className="space-y-4 overflow-y-auto max-h-[600px] pr-1">
              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-4xl mb-3">🗺️</p>
                  <p className="text-muted-foreground font-medium">No places found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                </div>
              ) : (
                filtered.map(place => (
                  <PlaceCard key={place.id} place={place} onSelect={setSelectedPlace} />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <PlaceDetail place={selectedPlace} onClose={() => setSelectedPlace(null)} />
    </div>
  );
}
