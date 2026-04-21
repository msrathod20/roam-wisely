export function formatDistance(distanceKm: number | undefined | null): string {
  if (distanceKm === undefined || distanceKm === null || !Number.isFinite(distanceKm)) return "";
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)}m`;
  if (distanceKm < 10) return `${distanceKm.toFixed(1)}km`;
  return `${Math.round(distanceKm)}km`;
}

// Compact label shown on cards — always user-centric
export function formatDistanceSummary(distanceKm: number | undefined | null, usesPreciseLocation: boolean): string {
  if (distanceKm === undefined || distanceKm === null || !Number.isFinite(distanceKm)) {
    return "Distance unavailable";
  }
  const formattedDistance = formatDistance(distanceKm);
  return usesPreciseLocation ? `${formattedDistance} away` : `~${formattedDistance} away`;
}

// Detailed label shown on the place detail panel
export function formatDistanceDetail(distanceKm: number | undefined | null, usesPreciseLocation: boolean): string {
  if (distanceKm === undefined || distanceKm === null || !Number.isFinite(distanceKm)) {
    return "Distance unavailable";
  }
  const formattedDistance = formatDistance(distanceKm);
  return usesPreciseLocation
    ? `${formattedDistance} from you`
    : `~${formattedDistance} from you (approx. location)`;
}