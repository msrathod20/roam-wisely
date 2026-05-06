import { useState, useEffect } from "react";
import { getPlaceFallbackImage, getPlacePhotoUrl } from "@/lib/googleMaps";

export function useGooglePlacePhoto(
  placeName: string,
  fallbackImage: string,
  lat?: number,
  lng?: number
): string {
  // Start from the caller-provided image (already a unique per-place category fallback).
  // Avoid the generic SVG map placeholder that made every card look identical.
  const [photoUrl, setPhotoUrl] = useState(fallbackImage);

  useEffect(() => {
    setPhotoUrl(fallbackImage);
    if (!placeName) return;

    let cancelled = false;

    getPlacePhotoUrl(placeName, lat, lng, fallbackImage).then((url) => {
      if (!cancelled && url) {
        setPhotoUrl(url);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [placeName, lat, lng, fallbackImage]);

  return photoUrl;
}
