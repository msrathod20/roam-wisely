import { useState, useMemo } from "react";
import { BANGALORE_PLACES, getDistance, PlaceCategory, Place } from "@/data/places";
import { useGeolocation } from "@/hooks/useGeolocation";
import PlaceCard from "@/components/PlaceCard";
import PlaceDetail from "@/components/PlaceDetail";
import FilterBar from "@/components/FilterBar";
import { useApp } from "@/context/AppContext";
import { Loader2, MapPin, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function ExplorePage() {
  const { latitude, longitude, loading, error } = useGeolocation();
  const { user } = useApp();
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<PlaceCategory[]>([]);
  const [maxDistance, setMaxDistance] = useState(100);
  const [ecoOnly, setEcoOnly] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

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

  return (
    <div className="flex-1 flex flex-col">
      <div className="container py-6 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="font-display text-3xl font-extrabold text-foreground">Explore</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              {error ? "Using default location (Bangalore)" : "Based on your location"}
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
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
              <span className="text-4xl">🗺️</span>
            </div>
            <p className="font-display font-bold text-foreground text-lg">No places found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or increasing the radius</p>
          </motion.div>
        ) : (
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
        )}
      </div>

      <PlaceDetail place={selectedPlace} onClose={() => setSelectedPlace(null)} />
    </div>
  );
}
