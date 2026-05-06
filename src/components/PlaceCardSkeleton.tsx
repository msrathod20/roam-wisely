export default function PlaceCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border animate-pulse">
      <div className="w-full aspect-[16/10] sm:aspect-[16/9] bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-3/4 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
        <div className="flex gap-2 pt-2">
          <div className="h-9 flex-1 rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  );
}