import React, { createContext, useContext, useState, ReactNode } from "react";
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
  toggleFavorite: (placeId: string) => void;
  visitedPlaces: string[];
  markVisited: (placeId: string) => void;
  ratings: Record<string, number>;
  ratePlaceFn: (placeId: string, rating: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [visitedPlaces, setVisitedPlaces] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});

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
  };

  const toggleFavorite = (placeId: string) => {
    setFavorites(prev =>
      prev.includes(placeId) ? prev.filter(id => id !== placeId) : [...prev, placeId]
    );
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
