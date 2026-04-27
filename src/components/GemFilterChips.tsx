import { GEM_CATEGORY_META, GemCategory } from "@/lib/userGems";

export type GemFilter = "all" | GemCategory;

interface GemFilterChipsProps {
  value: GemFilter;
  onChange: (v: GemFilter) => void;
  counts?: Partial<Record<GemFilter, number>>;
}

const ORDER: GemFilter[] = ["all", "hidden_gem", "food_spot", "sunset_point", "local_favorite"];

export default function GemFilterChips({ value, onChange, counts }: GemFilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Community gem filters">
      {ORDER.map((key) => {
        const meta = key === "all" ? null : GEM_CATEGORY_META[key as GemCategory];
        const label = key === "all" ? "All" : meta!.label;
        const emoji = key === "all" ? "✨" : meta!.emoji;
        const active = value === key;
        const count = counts?.[key];
        return (
          <button
            key={key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              active
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <span aria-hidden>{emoji}</span>
            {label}
            {typeof count === "number" && count > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  active ? "bg-primary-foreground/20" : "bg-background/60"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}