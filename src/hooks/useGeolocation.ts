import { useState, useEffect } from "react";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  isFallback: boolean;
  /** True when geolocation failed/denied AND no manual city has been chosen */
  needsLocation: boolean;
  /** Source of the current coords */
  source: "gps" | "manual" | "none";
  setManualLocation: (lat: number, lng: number, label?: string) => void;
  retry: () => void;
  /** User-friendly label of the manually chosen city (if any) */
  manualLabel: string | null;
}

// Default: Bangalore center
export const DEFAULT_LAT = 12.9716;
export const DEFAULT_LNG = 77.5946;

const STORAGE_KEY = "explorer.manualLocation.v1";

interface StoredLocation {
  lat: number;
  lng: number;
  label: string;
}

function readStored(): StoredLocation | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredLocation;
    if (typeof parsed.lat === "number" && typeof parsed.lng === "number") return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

export function useGeolocation() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"gps" | "manual" | "none">("none");
  const [manualLabel, setManualLabel] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Apply stored manual selection immediately so the user never sees a wrong city
  useEffect(() => {
    const stored = readStored();
    if (stored) {
      setLatitude(stored.lat);
      setLongitude(stored.lng);
      setManualLabel(stored.label);
      setSource("manual");
      setLoading(false);
      return;
    }
    requestGps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  function requestGps() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported on this device");
      setLoading(false);
      setSource("none");
      return;
    }
    setLoading(true);
    setError(null);

    let cancelled = false;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (cancelled) return;
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setError(null);
        setSource("gps");
        setLoading(false);
      },
      (err) => {
        if (cancelled) return;
        setError(err.message || "Could not get your location");
        setLoading(false);
        setSource((prev) => (prev === "manual" ? "manual" : "none"));
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
    );
    return () => { cancelled = true; };
  }

  const setManualLocation = (lat: number, lng: number, label?: string) => {
    const cleanLabel = label?.trim() || "Selected location";
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ lat, lng, label: cleanLabel }));
    } catch { /* ignore */ }
    setLatitude(lat);
    setLongitude(lng);
    setManualLabel(cleanLabel);
    setSource("manual");
    setError(null);
    setLoading(false);
  };

  const retry = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    setManualLabel(null);
    setAttempt((n) => n + 1);
  };

  const hasCoords = latitude !== null && longitude !== null;
  const needsLocation = !loading && !hasCoords;
  const isFallback = source !== "gps";

  return {
    latitude,
    longitude,
    error,
    loading,
    isFallback,
    needsLocation,
    source,
    setManualLocation,
    retry,
    manualLabel,
  } as LocationState;
}
