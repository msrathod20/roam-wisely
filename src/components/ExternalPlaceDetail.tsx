import { ExternalPlace } from "@/lib/externalPlaceSearch";
import { X, Star, MapPin, Navigation, ExternalLink, Clock, Sparkles, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { categoryConfig } from "@/data/places";

interface Props {
  place: ExternalPlace | null;
  onClose: () => void;
}

export default function ExternalPlaceDetail({ place, onClose }: Props) {
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
          className="bg-card w-full sm:max-w-2xl sm:rounded-2xl rounded-t-3xl max-h-[92vh] overflow-y-auto shadow-2xl"
        >
          {/* Hero */}
          <div className="relative h-56 sm:h-64">
            <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-card/90 backdrop-blur-sm flex items-center justify-center hover:scale-105 transition-transform"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-accent text-accent-foreground backdrop-blur-sm">
                <Globe className="w-3 h-3" /> Web Result
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex gap-2 mb-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-card/90 text-card-foreground backdrop-blur-sm">
                  <cat.icon className="w-3 h-3" /> {cat.label}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary-foreground">{place.name}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <Star className="w-4 h-4 fill-warning text-warning" />
                <span className="text-primary-foreground text-sm font-semibold">{place.rating.toFixed(1)}</span>
                {place.lat !== 0 && (
                  <>
                    <span className="text-primary-foreground/40">·</span>
                    <MapPin className="w-3 h-3 text-primary-foreground/80" />
                    <span className="text-primary-foreground text-sm">{place.lat.toFixed(2)}°N, {place.lng.toFixed(2)}°E</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="font-display font-bold text-foreground text-sm uppercase tracking-wider">About</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{place.description}</p>
            </div>

            {place.history && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-secondary" />
                  <h3 className="font-display font-bold text-foreground text-sm uppercase tracking-wider">More Details</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{place.history}</p>
              </div>
            )}

            {place.thingsToTry.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="font-display font-bold text-foreground text-sm uppercase tracking-wider">Things to Try</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {place.thingsToTry.map((t) => (
                    <span key={t} className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold">{t}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {place.lat !== 0 && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                  <Navigation className="w-4 h-4" /> Get Directions
                  <ExternalLink className="w-3 h-3 ml-1 opacity-60" />
                </a>
              )}
              {place.wikiUrl && (
                <a
                  href={place.wikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-muted text-foreground font-bold hover:bg-accent transition-all"
                >
                  <Globe className="w-4 h-4" /> Read on Wikipedia
                  <ExternalLink className="w-3 h-3 ml-1 opacity-60" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
