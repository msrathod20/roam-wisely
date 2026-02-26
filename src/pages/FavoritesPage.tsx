import { useApp } from "@/context/AppContext";
import { BANGALORE_PLACES, Place } from "@/data/places";
import PlaceCard from "@/components/PlaceCard";
import PlaceDetail from "@/components/PlaceDetail";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function FavoritesPage() {
  const { favorites } = useApp();
  const [selected, setSelected] = useState<Place | null>(null);
  const favPlaces = BANGALORE_PLACES.filter(p => favorites.includes(p.id));

  return (
    <div className="container py-8 min-h-[60vh]">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-extrabold text-foreground mb-1">Saved Places</h1>
        <p className="text-sm text-muted-foreground mb-8">
          <span className="text-primary font-semibold">{favPlaces.length}</span> places saved
        </p>
      </motion.div>

      {favPlaces.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Heart className="w-10 h-10 text-muted-foreground/40" />
          </div>
          <p className="font-display font-bold text-foreground text-lg">No saved places yet</p>
          <p className="text-sm text-muted-foreground mt-1">Tap the heart icon on any place to save it</p>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favPlaces.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <PlaceCard place={p} onSelect={setSelected} />
            </motion.div>
          ))}
        </div>
      )}
      <PlaceDetail place={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
