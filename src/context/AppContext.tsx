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
  authReady: boolean;
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
  const [authReady, setAuthReady] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [visitedPlaces, setVisitedPlaces] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  // 🔐 Restore session
  useEffect(() => {
    const applySession = (sessionUser: any) => {
      if (!sessionUser) {
        setUser(null);
        setFavorites([]);
        return;
      }

      const meta = sessionUser.user_metadata || {};

      const newUser: AuthUser = {
        id: sessionUser.id,
        name: meta.name || sessionUser.email?.split("@")[0] || "Explorer",
        email: sessionUser.email || "",
        interests: meta.interests || [],
      };

      setUser(newUser);
    };

    const { data: sub } = sup