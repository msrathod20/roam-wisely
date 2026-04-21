import { Locate, MapPin, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { KARNATAKA_CITIES, KarnatakaCity } from "@/data/karnatakaCities";

interface LocationPromptProps {
  error?: string | null;
  loading: boolean;
  onRetry: () => void;
  onPickCity: (city: KarnatakaCity) => void;
}

const FEATURED = KARNATAKA_CITIES.filter((c) =>
  ["Bengaluru", "Mysuru", "Mangaluru", "Udupi", "Hubballi", "Hampi"].includes(c.name),
);

export default function LocationPrompt({
  error,
  loading,
  onRetry,
  onPickCity,
}: LocationPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto bg-card border border-border rounded-3xl p-6 sm:p-8 text-center shadow-sm"
    >
      <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <MapPin className="w-7 h-7 text-primary" />
      </div>
      <h2 className="font-display text-xl sm:text-2xl font-extrabold text-foreground">
        Where are you exploring from?
      </h2>
      <p className="text-sm text-muted-foreground mt-1.5">
        We need a starting point to show famous places near you.
      </p>

      {error && (
        <p className="mt-3 inline-flex items-start gap-1.5 text-xs text-destructive">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span className="text-left">{error}</span>
        </p>
      )}

      <button
        onClick={onRetry}
        disabled={loading}
        className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Locate className="w-4 h-4" />
        )}
        {loading ? "Detecting…" : "Use my location"}
      </button>

      <div className="mt-6">
        <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-2.5">
          Or pick a city
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {FEATURED.map((city) => (
            <button
              key={city.name}
              onClick={() => onPickCity(city)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-muted hover:bg-accent text-foreground text-sm font-semibold transition-colors"
            >
              <MapPin className="w-3 h-3 text-muted-foreground" />
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}