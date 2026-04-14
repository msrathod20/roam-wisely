import { useState, useEffect } from "react";
import { getPlaceFallbackImage, getPlacePhotoUrl } from "@/lib/googleMaps";

export function useGooglePlacePhoto(
  placeName: string,
  fallbackImage: string,
  lat?: number,
  lng?: number
): string {
  const [photoUrl, setPhotoUrl] = useState(() => getPlaceFallbackImage(placeName, lat, lng) || fallbackImage);

  useEffect(() => {
    const baseImage = getPlaceFallbackImage(placeName, lat, lng) || fallbackImage;
    setPhotoUrl(baseImage);

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
