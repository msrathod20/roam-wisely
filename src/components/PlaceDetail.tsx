import { Place, categoryConfig } from "@/data/places";
import { X, Star, MapPin, Navigation, Leaf, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PlaceDetailProps {
  place: Place | null;
  onClose: () => void;
}

export default function PlaceDetail({ place, onClose }: PlaceDetailProps) {
  if (!place) return null;
  const cat = categoryConfig[place.category];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          <div className="relative h-60">
            <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-card/90 backdrop-blur-sm flex items-center justify-center hover:scale-105 transition-transform"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex gap-2 mb-2.5">
                {place.isEcoFriendly && (
                  <span className="eco-badge"><Leaf className="w-3 h-3" /> Sustainable</span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-card/90 text-card-foreground backdrop-blur-sm">
                  <cat.icon className="w-3 h-3" /> {cat.label}
                </span>
              </div>
              <h2 className="font-display text-2xl font-extrabold text-primary-foreground">{place.name}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <Star className="w-4 h-4 fill-warning text-warning" />
                <span className="text-primary-foreground text-sm font-semibold">{place.rating} rating</span>
                {place.distance !== undefined && (
                  <>
                    <span className="text-primary-foreground/40">·</span>
                    <MapPin className="w-3 h-3 text-primary-foreground/80" />
                    <span className="text-primary-foreground text-sm">{place.distance.toFixed(1)}km away</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <h3 className="font-display font-bold text-foreground mb-1.5 text-sm uppercase tracking-wider">About</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{place.description}</p>
            </div>

            <div>
              <h3 className="font-display font-bold text-foreground mb-1.5 text-sm uppercase tracking-wider">Why Famous</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{place.whyFamous}</p>
            </div>

            <div>
              <h3 className="font-display font-bold text-foreground mb-2.5 text-sm uppercase tracking-wider">Things to Try</h3>
              <div className="flex flex-wrap gap-2">
                {place.thingsToTry.map((thing) => (
                  <span key={thing} className="px-3 py-1.5 rounded-xl bg-accent text-accent-foreground text-xs font-semibold">
                    {thing}
                  </span>
                ))}
              </div>
            </div>

            {place.culturalInsight && (
              <div className="bg-accent/60 rounded-2xl p-5 border border-accent-foreground/10">
                <h3 className="font-display font-bold text-foreground mb-1.5 text-sm uppercase tracking-wider">🏛️ Cultural Insight</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{place.culturalInsight}</p>
              </div>
            )}

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
            >
              <Navigation className="w-4 h-4" /> Get Directions
              <ExternalLink className="w-3 h-3 ml-1 opacity-60" />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
