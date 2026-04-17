import { useState, useEffect } from "react";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  isFallback: boolean;
}

// Default: Bangalore center
export const DEFAULT_LAT = 12.9716;
export const DEFAULT_LNG = 77.5946;

export function useGeolocation() {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
    isFallback: false,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("[Geolocation] Not supported, falling back to Bangalore");
      setLocation({
        latitude: DEFAULT_LAT,
        longitude: DEFAULT_LNG,
        error: "Geolocation not supported on this device",
        loading: false,
        isFallback: true,
      });
      return;
    }

    let cancelled = false;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (cancelled) return;
        console.log("[Geolocation] User location:", pos.coords.latitude, pos.coords.longitude);
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          error: null,
          loading: false,
          isFallback: false,
        });
      },
      (err) => {
        if (cancelled) return;
        console.warn("[Geolocation] Error, using fallback (Bangalore):", err.message);
        setLocation({
          latitude: DEFAULT_LAT,
          longitude: DEFAULT_LNG,
          error: err.message,
          loading: false,
          isFallback: true,
        });
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return location;
}
