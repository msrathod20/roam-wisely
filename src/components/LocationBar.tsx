import { useState, useMemo } from "react";
import { MapPin, ChevronDown, Search, Loader2, Locate, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { KARNATAKA_CITIES, KarnatakaCity } from "@/data/karnatakaCities";

interface LocationBarProps {
  cityLabel: string;
  source: "gps" | "manual" | "none";
  loading: boolean;
  onPickCity: (city: KarnatakaCity) => void;
  onUseMyLocation: () => void;
  hasError?: boolean;
}

export default function LocationBar({
  cityLabel,
  source,
  loading,
  onPickCity,
  onUseMyLocation,
  hasError,
}: LocationBarProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return KARNATAKA_CITIES;
    return KARNATAKA_CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q),
    );
  }, [query]);

  const sourceBadge =
    source === "gps"
      ? { text: "GPS", className: "bg-primary/10 text-primary" }
      : source === "manual"
        ? { text: "Selected", className: "bg-secondary/10 text-secondary-foreground" }
        : { text: "Not set", className: "bg-destructive/10 text-destructive" };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-sm transition-all max-w-full"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-primary/10 shrink-0">
          <MapPin className="w-3.5 h-3.5 text-primary" />
        </span>
        <span className="flex flex-col items-start min-w-0">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold leading-none">
            Showing places near
          </span>
          <span className="font-display font-bold text-foreground text-sm leading-tight truncate max-w-[180px] sm:max-w-[260px]">
            {loading ? "Detecting…" : cityLabel}
          </span>
        </span>
        <span
          className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${sourceBadge.className}`}
        >
          {sourceBadge.text}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 mt-2 left-0 w-[320px] sm:w-[360px] bg-card rounded-2xl border border-border shadow-xl overflow-hidden"
              role="listbox"
            >
              <div className="p-3 border-b border-border space-y-2">
                <button
                  onClick={() => {
                    onUseMyLocation();
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:shadow-md transition-all"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Locate className="w-4 h-4" />
                  )}
                  Use my current location
                </button>
                {hasError && (
                  <p className="flex items-center gap-1.5 text-[11px] text-destructive">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    Location access denied. Pick a city below or retry above.
                  </p>
                )}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Karnataka cities…"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-muted text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
              <div className="max-h-[280px] overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No matching cities.
                  </p>
                ) : (
                  filtered.map((city) => (
                    <button
                      key={`${city.name}-${city.district}`}
                      onClick={() => {
                        onPickCity(city);
                        setOpen(false);
                        setQuery("");
                      }}
                      className="w-full flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-accent text-left transition-colors"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="font-semibold text-foreground text-sm truncate">
                          {city.name}
                        </span>
                      </span>
                      <span className="text-[11px] text-muted-foreground truncate">
                        {city.district}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}