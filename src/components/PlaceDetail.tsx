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
        className="fixed inset-0 z-50 bg-foreground/40 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card w-full sm:max-w-lg sm:rounded-xl rounded-t-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="relative h-56">
            <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-card/90 flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex gap-2 mb-2">
                {place.isEcoFriendly && (
                  <span className="eco-badge"><Leaf className="w-3 h-3" /> Sustainable Choice</span>
                )}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-card/90 text-card-foreground">
                  <cat.icon className="w-3 h-3" /> {cat.label}
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold text-primary-foreground">{place.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Star className="w-4 h-4 fill-warning text-warning" />
                <span className="text-primary-foreground text-sm font-medium">{place.rating} rating</span>
                {place.distance !== undefined && (
                  <>
                    <span className="text-primary-foreground/60">·</span>
                    <MapPin className="w-3 h-3 text-primary-foreground/80" />
                    <span className="text-primary-foreground text-sm">{place.distance.toFixed(1)}km away</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="p-5 space-y-5">
            <div>
              <h3 className="font-semibold text-foreground mb-1 text-sm uppercase tracking-wide">About</h3>
              <p className="text-muted-foreground text-sm">{place.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-1 text-sm uppercase tracking-wide">Why Famous</h3>
              <p className="text-muted-foreground text-sm">{place.whyFamous}</p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2 text-sm uppercase tracking-wide">Things to Try</h3>
              <div className="flex flex-wrap gap-2">
                {place.thingsToTry.map((thing) => (
                  <span key={thing} className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                    {thing}
                  </span>
                ))}
              </div>
            </div>

            {place.culturalInsight && (
              <div className="bg-accent/50 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-1 text-sm uppercase tracking-wide">Cultural Insight</h3>
                <p className="text-muted-foreground text-sm">{place.culturalInsight}</p>
              </div>
            )}

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
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
