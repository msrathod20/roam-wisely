import { PlaceCategory, categoryConfig } from "@/data/places";
import { Search, X } from "lucide-react";

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  selectedCategories: PlaceCategory[];
  onCategoryToggle: (cat: PlaceCategory) => void;
  maxDistance: number;
  onMaxDistanceChange: (d: number) => void;
  ecoOnly: boolean;
  onEcoToggle: () => void;
}

const DISTANCES = [5, 10, 25, 50, 100];

export default function FilterBar({
  search, onSearchChange, selectedCategories, onCategoryToggle,
  maxDistance, onMaxDistanceChange, ecoOnly, onEcoToggle,
}: FilterBarProps) {
  const hasFilters = selectedCategories.length > 0 || ecoOnly || maxDistance !== 50;

  const clearAll = () => {
    onSearchChange("");
    selectedCategories.forEach(c => onCategoryToggle(c));
    onMaxDistanceChange(50);
    if (ecoOnly) onEcoToggle();
  };

  return (
    <div className="space-y-4 bg-card rounded-2xl border border-border p-5 shadow-sm">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search places, food, activities..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground transition-shadow"
          aria-label="Search places"
        />
        {search && (
          <button onClick={() => onSearchChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Interests */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider">Interests</label>
          {hasFilters && (
            <button onClick={clearAll} className="text-xs font-semibold text-primary hover:underline">
              Clear all
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(categoryConfig) as PlaceCategory[]).map((cat) => {
            const cfg = categoryConfig[cat];
            const active = selectedCategories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => onCategoryToggle(cat)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <cfg.icon className="w-3.5 h-3.5" /> {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Radius + Eco */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider mb-2.5 block">
            Radius: <span className="text-primary">{maxDistance}km</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {DISTANCES.map((d) => (
              <button
                key={d}
                onClick={() => onMaxDistanceChange(d)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  maxDistance === d
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {d}km
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onEcoToggle}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
            ecoOnly
              ? "bg-eco text-eco-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          🌿 Eco Only
        </button>
      </div>
    </div>
  );
}
