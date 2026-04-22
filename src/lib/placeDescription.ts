export type DescriptionCategory =
  | "food"
  | "heritage"
  | "nature"
  | "nightlife"
  | "eco"
  | "activities"
  | "attraction"
  | "cafe";

type CuratedPlaceLike = {
  name: string;
  description: string;
  whyFamous: string;
  history?: string;
  culturalInsight?: string;
  thingsToTry?: string[];
  bestTime?: string;
  category: string;
};

function normalizeSentence(text?: string | null): string {
  const value = text?.replace(/\s+/g, " ").trim();
  if (!value) return "";
  return /[.!?]$/.test(value) ? value : `${value}.`;
}

function firstSentence(text?: string | null): string {
  const value = text?.replace(/\s+/g, " ").trim();
  if (!value) return "";

  const parts = value.match(/[^.!?]+[.!?]?/g) ?? [];
  const first = parts[0]?.trim() ?? value;
  return normalizeSentence(first);
}

function uniqueSentences(sentences: Array<string | null | undefined>): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const sentence of sentences) {
    const normalized = normalizeSentence(sentence);
    if (!normalized) continue;

    const key = normalized.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (seen.has(key)) continue;

    seen.add(key);
    result.push(normalized);
  }

  return result;
}

function formatList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function normalizeExperience(items?: string[]): string[] {
  return (items ?? [])
    .map((item) => item.replace(/\s*\([^)]*\)/g, "").trim())
    .filter(Boolean)
    .slice(0, 3);
}

function genericExperience(category: string): string {
  switch (category) {
    case "heritage":
      return "You can explore the architecture, walk through the site, and get a clear sense of its history.";
    case "nature":
    case "eco":
      return "Visitors usually come for the views, fresh air, and a more relaxed outdoor experience.";
    case "food":
      return "It is best experienced slowly, with time to enjoy the local flavors and the busy atmosphere around it.";
    case "cafe":
      return "It is a comfortable place to pause, enjoy the setting, and spend time over coffee or a light meal.";
    case "nightlife":
      return "The mood is best in the evening, when the place feels lively, social, and full of energy.";
    case "activities":
      return "It works well for a day outing, with enough to do for both casual visitors and groups.";
    default:
      return "Visitors can explore the surroundings, take in the atmosphere, and spend unhurried time at the site.";
  }
}

function buildCuratedExperienceSentence(place: CuratedPlaceLike): string {
  const experiences = normalizeExperience(place.thingsToTry);
  if (experiences.length > 0) {
    return `You can enjoy ${formatList(experiences.map((item) => item.toLowerCase()))}${place.bestTime ? `, especially during ${place.bestTime.toLowerCase()}` : ""}.`;
  }

  return genericExperience(place.category);
}

export function enrichCuratedPlaceDescription<T extends CuratedPlaceLike>(place: T): T {
  const sentences = uniqueSentences([
    place.description,
    place.whyFamous,
    buildCuratedExperienceSentence(place),
    firstSentence(place.history),
    firstSentence(place.culturalInsight),
  ]);

  return {
    ...place,
    description: sentences.slice(0, 4).join(" "),
  };
}

function getOsmPlaceType(tags: Record<string, string>, category: DescriptionCategory): string {
  const rawType =
    tags.tourism ||
    tags.historic ||
    tags.amenity ||
    tags.leisure ||
    tags.natural ||
    tags.waterway ||
    "";

  if (rawType) return rawType.replace(/_/g, " ");

  switch (category) {
    case "heritage":
      return "heritage site";
    case "nature":
    case "eco":
      return "natural attraction";
    case "food":
      return "restaurant";
    case "cafe":
      return "cafe";
    case "nightlife":
      return "nightlife spot";
    case "activities":
      return "activity destination";
    default:
      return "local landmark";
  }
}

function buildOsmSignificanceSentence(tags: Record<string, string>, category: DescriptionCategory): string {
  if (tags["heritage:operator"] === "unesco") {
    return "It is recognized for its heritage value and stands out as one of the more important cultural sites in the region.";
  }

  if (tags.heritage || tags.wikidata || tags.wikipedia) {
    return category === "heritage"
      ? "It is known locally for its historical or religious importance and is one of the better documented landmarks nearby."
      : "It is a known local landmark with clear cultural or historical value, not just a routine point on the map.";
  }

  if (category === "nature" || category === "eco") {
    return "People usually come here for the landscape, the calmer setting, and the break it offers from busier urban areas.";
  }

  if (category === "food" || category === "cafe") {
    return "It is a useful stop if you want a familiar local place rather than a generic listing with no real identity.";
  }

  return "It stands out in the area as a place people are likely to visit for more than a quick stop.";
}

function buildOsmExperienceSentence(tags: Record<string, string>, category: DescriptionCategory): string {
  if (tags.tourism === "viewpoint") return "Expect open views, photo spots, and a short stop that works well around sunrise or sunset.";
  if (tags.waterway === "waterfall") return "Visitors usually spend time at the viewpoints, enjoy the sound and spray of the falls, and take photos in the surrounding greenery.";
  if (tags.natural === "beach") return "You can walk along the shore, enjoy the sea breeze, and spend time here during the softer light in the morning or evening.";
  if (tags.amenity === "place_of_worship") return "The experience is usually peaceful, with time for prayer, quiet observation, and noticing local rituals or devotional practices.";
  if (tags.tourism === "museum" || tags.tourism === "gallery") return "You can explore the displays at a steady pace and come away with a better sense of the place and its background.";
  if (category === "activities") return "It suits short outings well, whether you want light adventure, a group plan, or simply a more active stop.";
  if (category === "nightlife") return "The place is best appreciated later in the day, when the atmosphere becomes more social and energetic.";
  return genericExperience(category);
}

function buildOsmCultureSentence(tags: Record<string, string>): string {
  const religion = tags.religion?.replace(/_/g, " ");
  const denomination = tags.denomination?.replace(/_/g, " ");

  if (religion || denomination) {
    const parts = [denomination, religion].filter(Boolean) as string[];
    return `It also has ongoing local significance through ${formatList(parts)}, which shapes the traditions and atmosphere visitors notice on site.`;
  }

  if (tags.historic || tags.heritage) {
    return "Its continued presence also reflects the local history of the area, which is part of why it remains meaningful to residents and repeat visitors.";
  }

  return "";
}

export function buildOsmDescription(
  name: string,
  tags: Record<string, string>,
  category: DescriptionCategory,
  fallbackDescription?: string,
): string {
  const placeType = getOsmPlaceType(tags, category);
  const intro = fallbackDescription
    ? normalizeSentence(fallbackDescription)
    : `${name} is a ${/^[aeiou]/i.test(placeType) ? "an" : "a"} ${placeType} that stands out as a notable ${category === "eco" ? "nature" : category} stop in the area.`;

  const sentences = uniqueSentences([
    intro,
    buildOsmSignificanceSentence(tags, category),
    buildOsmExperienceSentence(tags, category),
    buildOsmCultureSentence(tags),
  ]);

  return sentences.slice(0, 4).join(" ");
}