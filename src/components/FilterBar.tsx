import { PlaceCategory, categoryConfig } from "@/data/places";
import { Search } from "lucide-react";

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

const DISTANCES = [1, 5, 10, 25, 50, 100];

export default function FilterBar({
  search, onSearchChange, selectedCategories, onCategoryToggle,
  maxDistance, onMaxDistanceChange, ecoOnly, onEcoToggle,
}: FilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search places..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
          aria-label="Search places"
        />
      </div>

      {/* Interests / Categories - always visible */}
      <div>
        <label className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2 block">Interests</label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(categoryConfig) as PlaceCategory[]).map((cat) => {
            const cfg = categoryConfig[cat];
            const active = selectedCategories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => onCategoryToggle(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                <cfg.icon className="w-3 h-3" /> {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Radius / Distance - always visible */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-0">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2 block">
            Radius: {maxDistance}km
          </label>
          <div className="flex flex-wrap gap-1.5">
            {DISTANCES.map((d) => (
              <button
                key={d}
                onClick={() => onMaxDistanceChange(d)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  maxDistance === d ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {d}km
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onEcoToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors mt-5 ${
            ecoOnly ? "bg-eco text-eco-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
        >
          🌿 Eco Only
        </button>
      </div>
    </div>
  );
}
