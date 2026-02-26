import { Place, categoryConfig } from "@/data/places";
import { Heart, MapPin, Navigation, Leaf, Star } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";

interface PlaceCardProps {
  place: Place;
  onSelect?: (place: Place) => void;
}

export default function PlaceCard({ place, onSelect }: PlaceCardProps) {
  const { user, favorites, toggleFavorite, visitedPlaces, markVisited } = useApp();
  const cat = categoryConfig[place.category];
  const isFav = favorites.includes(place.id);
  const visited = visitedPlaces.includes(place.id);

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-2xl overflow-hidden card-elevated border border-border cursor-pointer group"
      onClick={() => onSelect?.(place)}
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
          {place.isEcoFriendly && (
            <span className="eco-badge">
              <Leaf className="w-3 h-3" /> Eco
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-card/90 text-card-foreground backdrop-blur-sm">
            <cat.icon className="w-3 h-3" /> {cat.label}
          </span>
        </div>

        {user && (
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(place.id); }}
            className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-card/90 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`w-4 h-4 ${isFav ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
          </button>
        )}

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <h3 className="text-primary-foreground font-display text-lg font-bold leading-tight drop-shadow-md">
            {place.name}
          </h3>
          <div className="flex items-center gap-1 text-primary-foreground text-sm font-semibold shrink-0">
            <Star className="w-3.5 h-3.5 fill-warning text-warning" />
            {place.rating}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{place.description}</p>

        {place.distance !== undefined && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            {place.distance < 1 ? `${(place.distance * 1000).toFixed(0)}m away` : `${place.distance.toFixed(1)}km away`}
          </div>
        )}

        <div className="flex items-center gap-2 pt-1">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:shadow-md hover:shadow-primary/20 transition-all"
          >
            <Navigation className="w-3.5 h-3.5" /> Directions
          </a>
          {user && (
            <button
              onClick={(e) => { e.stopPropagation(); markVisited(place.id); }}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                visited ? "bg-eco text-eco-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {visited ? "✓ Visited" : "Mark Visited"}
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
