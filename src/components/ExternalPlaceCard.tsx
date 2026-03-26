import { ExternalPlace } from "@/lib/externalPlaceSearch";
import { categoryConfig } from "@/data/places";
import { MapPin, Navigation, Star, Globe } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  place: ExternalPlace;
  onSelect: (place: ExternalPlace) => void;
}

export default function ExternalPlaceCard({ place, onSelect }: Props) {
  const cat = categoryConfig[place.category];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-2xl overflow-hidden card-elevated border border-border cursor-pointer group relative"
      onClick={() => onSelect(place)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${place.name}`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-accent/90 text-accent-foreground backdrop-blur-sm">
            <Globe className="w-3 h-3" /> Web
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-card/90 text-card-foreground backdrop-blur-sm">
            <cat.icon className="w-3 h-3" /> {cat.label}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <h3 className="text-primary-foreground font-display text-lg font-bold leading-tight drop-shadow-md">
            {place.name}
          </h3>
          <div className="flex items-center gap-1 text-primary-foreground text-sm font-semibold shrink-0">
            <Star className="w-3.5 h-3.5 fill-warning text-warning" />
            {place.rating.toFixed(1)}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{place.description}</p>

        {place.lat !== 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{place.lat.toFixed(2)}°N, {place.lng.toFixed(2)}°E</span>
          </div>
        )}

        <div className="flex items-center gap-2 pt-1">
          {place.lat !== 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); window.open(`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`, '_blank', 'noopener,noreferrer'); }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:shadow-md hover:shadow-primary/20 transition-all"
            >
              <Navigation className="w-3.5 h-3.5" /> Directions
            </button>
          )}
          {place.wikiUrl && (
            <a
              href={place.wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-3 py-2.5 rounded-xl text-xs font-bold bg-muted text-muted-foreground hover:bg-accent transition-all"
            >
              Wikipedia
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
