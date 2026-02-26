import { useApp } from "@/context/AppContext";
import { BANGALORE_PLACES } from "@/data/places";
import PlaceCard from "@/components/PlaceCard";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import PlaceDetail from "@/components/PlaceDetail";
import { Place } from "@/data/places";

export default function FavoritesPage() {
  const { favorites } = useApp();
  const [selected, setSelected] = useState<Place | null>(null);
  const favPlaces = BANGALORE_PLACES.filter(p => favorites.includes(p.id));

  return (
    <div className="container py-6 min-h-[60vh]">
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">Saved Places</h1>
      <p className="text-sm text-muted-foreground mb-6">{favPlaces.length} places saved</p>

      {favPlaces.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <Heart className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground font-medium">No saved places yet</p>
          <p className="text-sm text-muted-foreground">Tap the heart icon on any place to save it</p>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favPlaces.map(p => <PlaceCard key={p.id} place={p} onSelect={setSelected} />)}
        </div>
      )}
      <PlaceDetail place={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
