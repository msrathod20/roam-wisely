import { useState, useEffect } from "react";
import { getPlacePhotoUrl } from "@/lib/googleMaps";

export function useGooglePlacePhoto(
  placeName: string,
  fallbackImage: string,
  lat?: number,
  lng?: number
): string {
  const [photoUrl, setPhotoUrl] = useState(fallbackImage);

  useEffect(() => {
    let cancelled = false;

    getPlacePhotoUrl(placeName, lat, lng).then((url) => {
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
