import { useState, useEffect } from "react";

interface LocationState {
  latitude: number;
  longitude: number;
  error: string | null;
  loading: boolean;
}

// Default: Bangalore center
const DEFAULT_LAT = 12.9716;
const DEFAULT_LNG = 77.5946;

export function useGeolocation() {
  const [location, setLocation] = useState<LocationState>({
    latitude: DEFAULT_LAT,
    longitude: DEFAULT_LNG,
    error: null,
    loading: false,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({ ...prev, error: "Geolocation not supported" }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (err) => {
        setLocation(prev => ({
          ...prev,
          error: err.message,
        }));
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  return location;
}
