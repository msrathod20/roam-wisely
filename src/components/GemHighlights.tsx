import { motion } from "framer-motion";
import { Sparkles, MapPin, User } from "lucide-react";
import type { Place } from "@/data/places";
import { GEM_CATEGORY_META, GemCategory } from "@/lib/userGems";
import { formatDistanceSummary } from "@/lib/distance";
import { useGooglePlacePhoto } from "@/hooks/useGooglePlacePhoto";

interface GemHighlightsProps {
  gems: Array<Place & { isUserGem?: true; gemCategory?: GemCategory; submitterName?: string | null }>;
  onSelect: (place: Place) => void;
  usesPreciseLocation: boolean;
}

function GemTile({
  gem,
  onSelect,
  usesPreciseLocation,
}: {
  gem: Place & { gemCategory?: GemCategory; submitterName?: string | null };
  onSelect: (place: Place) => void;
  usesPreciseLocation: boolean;
}) {
  const photoUrl = useGooglePlacePhoto(gem.name, gem.image, gem.lat, gem.lng);
  const meta = gem.gemCategory ? GEM_CATEGORY_META[gem.gemCategory] : null;
  return (
    <motion.button
      whileHover={{ y: -3 }}
      onClick={() => onSelect(gem)}
      className="snap-start shrink-0 w-[230px] text-left bg-card rounded-2xl overflow-hidden border border-primary/30 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative h-28 overflow-hidden">
        <img
          src={photoUrl}
          alt={gem.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        {meta && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent text-accent-foreground backdrop-blur-sm">
            {meta.emoji} {meta.label}
          </span>
        )}
      </div>
      <div className="p-3 space-y-1.5">
        <h3 className="font-display text-sm font-bold text-foreground line-clamp-1">{gem.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-snug">{gem.description}</p>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
          {gem.distance !== undefined && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {formatDistanceSummary(gem.distance, usesPreciseLocation)}
            </span>
          )}
          <span className="flex items-center gap-1 text-primary font-semibold truncate max-w-[110px]">
            <User className="w-3 h-3" />
            {gem.submitterName || "local"}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

export default function GemHighlights({ gems, onSelect, usesPreciseLocation }: GemHighlightsProps) {
  if (gems.length === 0) return null;
  const top = gems.slice(0, 5);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-primary/5 via-accent/30 to-background rounded-2xl border border-primary/20 p-4 sm:p-5"
      aria-label="Hidden Gems Near You"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          🔥 Hidden Gems Near You
        </h2>
        <span className="text-[11px] text-muted-foreground font-medium">
          {gems.length} community {gems.length === 1 ? "find" : "finds"}
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 scrollbar-thin">
        {top.map((gem) => (
          <GemTile
            key={gem.id}
            gem={gem}
            onSelect={onSelect}
            usesPreciseLocation={usesPreciseLocation}
          />
        ))}
      </div>
    </motion.section>
  );
}