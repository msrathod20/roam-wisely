import { supabase } from "@/integrations/supabase/client";
import type { Place, PlaceCategory } from "@/data/places";

export type GemCategory = "hidden_gem" | "food_spot" | "sunset_point" | "local_favorite";

export const GEM_CATEGORY_META: Record<
  GemCategory,
  { label: string; emoji: string; placeCategory: PlaceCategory }
> = {
  hidden_gem: { label: "Hidden Gem", emoji: "👀", placeCategory: "attraction" },
  food_spot: { label: "Food Spot", emoji: "🍜", placeCategory: "food" },
  sunset_point: { label: "Sunset Point", emoji: "🌅", placeCategory: "nature" },
  local_favorite: { label: "Local Favorite", emoji: "⭐", placeCategory: "attraction" },
};

export interface UserGemRow {
  id: string;
  name: string;
  description: string;
  category: GemCategory;
  latitude: number;
  longitude: number;
  image_url: string | null;
  submitter_name: string | null;
  rating: number;
  likes_count: number;
  created_at: string;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=80";

/** Convert a DB row into a Place so the existing card pipeline renders it. */
export function gemToPlace(g: UserGemRow): Place & { isUserGem: true; gemCategory: GemCategory; submitterName: string | null } {
  const meta = GEM_CATEGORY_META[g.category] ?? GEM_CATEGORY_META.hidden_gem;
  return {
    id: `gem-${g.id}`,
    name: g.name,
    description: g.description,
    whyFamous: `Community-shared ${meta.label.toLowerCase()} added by a local explorer.`,
    thingsToTry: ["Visit and explore", "Take photos", "Share your experience"],
    category: meta.placeCategory,
    lat: g.latitude,
    lng: g.longitude,
    image: g.image_url || FALLBACK_IMAGE,
    rating: Number(g.rating) || 4.5,
    isEcoFriendly: false,
    isUserGem: true,
    gemCategory: g.category,
    submitterName: g.submitter_name,
  };
}

export async function fetchApprovedGems(): Promise<UserGemRow[]> {
  const { data, error } = await supabase
    .from("user_gems")
    .select("id,name,description,category,latitude,longitude,image_url,submitter_name,rating,likes_count,created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) {
    console.error("[userGems] fetch failed", error);
    return [];
  }
  return (data || []) as UserGemRow[];
}

export interface SubmitGemInput {
  name: string;
  description: string;
  category: GemCategory;
  latitude: number;
  longitude: number;
  imageFile?: File | null;
  submitterName?: string | null;
  userId?: string | null;
}

export async function submitGem(input: SubmitGemInput): Promise<{ ok: true } | { ok: false; error: string }> {
  let imageUrl: string | null = null;

  if (input.imageFile) {
    if (input.imageFile.size > 5 * 1024 * 1024) {
      return { ok: false, error: "Image must be smaller than 5MB" };
    }
    const ext = input.imageFile.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("gem-images")
      .upload(path, input.imageFile, { contentType: input.imageFile.type, upsert: false });
    if (upErr) {
      console.error("[userGems] image upload failed", upErr);
      return { ok: false, error: "Image upload failed. Try a smaller file." };
    }
    const { data: pub } = supabase.storage.from("gem-images").getPublicUrl(path);
    imageUrl = pub.publicUrl;
  }

  const { error } = await supabase.from("user_gems").insert({
    name: input.name.trim(),
    description: input.description.trim(),
    category: input.category,
    latitude: input.latitude,
    longitude: input.longitude,
    image_url: imageUrl,
    submitter_name: input.submitterName?.trim() || null,
    user_id: input.userId || null,
  });

  if (error) {
    console.error("[userGems] insert failed", error);
    return { ok: false, error: error.message || "Could not submit gem" };
  }
  return { ok: true };
}