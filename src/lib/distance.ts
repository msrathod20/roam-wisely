export function formatDistance(distanceKm: number): string {
  if (!Number.isFinite(distanceKm)) return "";
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)}m`;
  if (distanceKm < 10) return `${distanceKm.toFixed(1)}km`;
  return `${Math.round(distanceKm)}km`;
}

export function formatDistanceSummary(distanceKm: number, usesPreciseLocation: boolean): string {
  const formattedDistance = formatDistance(distanceKm);
  return usesPreciseLocation ? formattedDistance : `${formattedDistance} from center`;
}

export function formatDistanceDetail(distanceKm: number, usesPreciseLocation: boolean): string {
  const formattedDistance = formatDistance(distanceKm);
  return usesPreciseLocation ? `${formattedDistance} away` : `${formattedDistance} from Bangalore center`;
}