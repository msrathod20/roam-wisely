import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { PlaceCategory, Place } from "@/data/places";
import { supabase } from "@/integrations/supabase/client";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  interests: PlaceCategory[];
}

interface AppContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, interests: PlaceCategory[]) => void;
  logout: () => void;
  favorites: string[];
  toggleFavorite: (placeId: string, place?: Place) => void;
  visitedPlaces: string[];
  markVisited: (placeId: string) => void;
  ratings: Record<string, number>;
  ratePlaceFn: (placeId: string, rating: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const db = supabase as any;

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [visitedPlaces, setVisitedPlaces] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  // Restore session + listen for auth changes
  useEffect(() => {
    const applySession = (sessionUser: any) => {
      if (!sessionUser) { setUser(null); setFavorites([]); return; }
      const meta = (sessionUser.user_metadata || {}) as { name?: string; interests?: PlaceCategory[] };
      const fallbackUser = {
        id: sessionUser.id,
        name: meta.name || sessionUser.email?.split("@")[0] || "Explorer",
        email: sessionUser.email || "",
        interests: meta.interests || [],
      };
      setUser(fallbackUser);
      db.from("profiles")
        .select("name,interests")
        .eq("user_id", sessionUser.id)
        .maybeSingle()
        .then(({ data }: { data: { name?: string; interests?: PlaceCategory[] } | null }) => {
          if (data) setUser({ ...fallbackUser, name: data.name || fallbackUser.name, interests: data.interests || [] });
        });
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      applySession(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => applySession(data.session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Load favorites whenever the user changes
  useEffect(() => {
    if (!user?.id) { setFavorites([]); return; }
    let cancelled = false;
    (async () => {
      const { data } = await db
        .from("saved_places")
        .select("place_id")
        .eq("user_id", user.id);
      if (!cancelled) {
        setFavorites((data || []).map((r: { place_id: string }) => r.place_id));
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      throw new Error(
        error?.message?.toLowerCase().includes("invalid")
          ? "No account found with these credentials. Please sign up first."
          : error?.message || "Login failed"
      );
    }
    const meta = (data.user.user_metadata || {}) as { name?: string; interests?: PlaceCategory[] };
    setUser({
      id: data.user.id,
      name: meta.name || data.user.email?.split("@")[0] || "Explorer",
      email: data.user.email || email,
      interests: meta.interests || [],
    });
  };

  const register = (name: string, email: string, _password: string, interests: PlaceCategory[]) => {
    setUser({ id: "user-1", name, email, interests });
  };

  const logout = () => {
    supabase.auth.signOut();
    setUser(null);
    setFavorites([]);
  };

  const toggleFavorite = async (placeId: string, place?: Place) => {
    if (!user) return;
    const isFav = favorites.includes(placeId);
    const savedPlace = place
      ? {
          user_id: user.id,
          place_id: placeId,
          name: place.name,
          description: place.description,
          category: place.category,
          latitude: place.lat,
          longitude: place.lng,
          image: place.image,
          rating: place.rating,
          is_eco_friendly: place.isEcoFriendly,
          why_famous: place.whyFamous,
          things_to_try: place.thingsToTry,
        }
      : { user_id: user.id, place_id: placeId };
    // Optimistic update
    setFavorites(prev => isFav ? prev.filter(id => id !== placeId) : [...prev, placeId]);
    if (isFav) {
      const { error } = await db
        .from("saved_places")
        .delete()
        .eq("user_id", user.id)
        .eq("place_id", placeId);
      if (error) setFavorites(prev => [...prev, placeId]); // revert
    } else {
      const { error } = await db
        .from("saved_places")
        .upsert(savedPlace, { onConflict: "user_id,place_id" });
      if (error) setFavorites(prev => prev.filter(id => id !== placeId)); // revert
    }
  };

  const markVisited = (placeId: string) => {
    setVisitedPlaces(prev => prev.includes(placeId) ? prev : [...prev, placeId]);
  };

  const ratePlaceFn = (placeId: string, rating: number) => {
    setRatings(prev => ({ ...prev, [placeId]: rating }));
  };

  return (
    <AppContext.Provider value={{ user, login, register, logout, favorites, toggleFavorite, visitedPlaces, markVisited, ratings, ratePlaceFn }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
