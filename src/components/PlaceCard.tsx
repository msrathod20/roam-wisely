import { Place, categoryConfig } from "@/data/places";
import { Heart, MapPin, Navigation, Leaf, Star, ExternalLink } from "lucide-react";
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

  const openDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`, "_blank");
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-card rounded-lg overflow-hidden card-elevated cursor-pointer group"
      onClick={() => onSelect?.(place)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${place.name}`}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />

        <div className="absolute top-3 left-3 flex gap-1.5">
          {place.isEcoFriendly && (
            <span className="eco-badge">
              <Leaf className="w-3 h-3" /> Sustainable
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-card/90 text-card-foreground">
            <cat.icon className="w-3 h-3" /> {cat.label}
          </span>
        </div>

        {user && (
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(place.id); }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/90 flex items-center justify-center transition-transform hover:scale-110"
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`w-4 h-4 ${isFav ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
          </button>
        )}

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <h3 className="text-primary-foreground font-display text-lg font-semibold leading-tight drop-shadow-sm">
            {place.name}
          </h3>
          <div className="flex items-center gap-1 text-primary-foreground text-sm font-medium">
            <Star className="w-3.5 h-3.5 fill-warning text-warning" />
            {place.rating}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{place.description}</p>

        {place.distance !== undefined && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            {place.distance < 1 ? `${(place.distance * 1000).toFixed(0)}m away` : `${place.distance.toFixed(1)}km away`}
          </div>
        )}

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={openDirections}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Navigation className="w-3 h-3" /> Directions
          </button>
          {user && (
            <button
              onClick={(e) => { e.stopPropagation(); markVisited(place.id); }}
              className={`px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
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
