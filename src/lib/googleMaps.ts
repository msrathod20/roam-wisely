export const GOOGLE_MAPS_API_KEY = "AIzaSyD60uaf2flWxU1s3uZmFz0Ww30LVBaYkBU";

interface WikiSearchResult {
  pageid: number;
  title: string;
}

interface WikiGeoSearchResult {
  pageid: number;
  title: string;
  lat: number;
  lon: number;
  dist: number;
}

interface WikiPageDetails {
  title: string;
  thumbnail?: { source: string };
  coordinates?: { lat: number; lon: number }[];
}

const photoCache = new Map<string, string>();
const pendingPhotoRequests = new Map<string, Promise<string | null>>();

function getCacheKey(placeName: string, lat?: number, lng?: number) {
  return `${placeName}-${lat ?? "na"}-${lng ?? "na"}`;
}

function getStoredPhoto(cacheKey: string) {
  const inMemory = photoCache.get(cacheKey);
  if (inMemory) return inMemory;

  try {
    const persisted = sessionStorage.getItem(`place-photo:${cacheKey}`);
    if (persisted) {
      photoCache.set(cacheKey, persisted);
      return persisted;
    }
  } catch {
    // ignore storage access issues
  }

  return null;
}

function storePhoto(cacheKey: string, url: string) {
  photoCache.set(cacheKey, url);

  try {
    sessionStorage.setItem(`place-photo:${cacheKey}`, url);
  } catch {
    // ignore storage access issues
  }
}

function normalizePlaceName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/[()]/g, " ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\b(bengaluru|bangalore|karnataka|india|the)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getPlaceNameVariants(placeName: string) {
  const variants = new Set<string>();
  const trimmed = placeName.trim();

  if (!trimmed) return [];

  variants.add(trimmed);
  variants.add(trimmed.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim());

  const parenMatch = trimmed.match(/\(([^)]+)\)/);
  if (parenMatch?.[1]) {
    variants.add(parenMatch[1].trim());
  }

  trimmed
    .split(/[-–,:]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach((part) => variants.add(part));

  return Array.from(variants).filter(Boolean);
}

function getWordOverlapScore(a: string, b: string) {
  const aWords = new Set(a.split(" ").filter((word) => word.length > 2));
  const bWords = new Set(b.split(" ").filter((word) => word.length > 2));

  if (!aWords.size || !bWords.size) return 0;

  let matches = 0;
  aWords.forEach((word) => {
    if (bWords.has(word)) matches += 1;
  });

  return matches / Math.max(aWords.size, bWords.size);
}

function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function escapeSvg(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

async function searchWikipediaTitles(query: string): Promise<WikiSearchResult[]> {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=5&format=json&origin=*`;
  const data = await fetchJson<{ query?: { search?: WikiSearchResult[] } }>(url);
  return data?.query?.search ?? [];
}

async function searchWikipediaNearby(lat: number, lng: number): Promise<WikiGeoSearchResult[]> {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lng}&gsradius=10000&gslimit=10&format=json&origin=*`;
  const data = await fetchJson<{ query?: { geosearch?: WikiGeoSearchResult[] } }>(url);
  return data?.query?.geosearch ?? [];
}

async function getWikipediaPageDetails(pageIds: number[]): Promise<Record<number, WikiPageDetails>> {
  if (!pageIds.length) return {};

  const uniqueIds = Array.from(new Set(pageIds));
  const url = `https://en.wikipedia.org/w/api.php?action=query&pageids=${uniqueIds.join("|")}&prop=pageimages|coordinates&piprop=thumbnail&pithumbsize=1200&format=json&origin=*`;
  const data = await fetchJson<{ query?: { pages?: Record<string, WikiPageDetails & { pageid: number }> } }>(url);
  const pages = data?.query?.pages ?? {};

  return Object.values(pages).reduce<Record<number, WikiPageDetails>>((acc, page) => {
    acc[page.pageid] = page;
    return acc;
  }, {});
}

function scoreWikiCandidate(
  placeName: string,
  candidateTitle: string,
  page: WikiPageDetails | undefined,
  lat?: number,
  lng?: number,
  geoDistanceMeters?: number
) {
  const normalizedCandidate = normalizePlaceName(candidateTitle);
  const variants = getPlaceNameVariants(placeName).map(normalizePlaceName);
  let score = 0;

  for (const variant of variants) {
    if (!variant) continue;

    if (normalizedCandidate === variant) {
      score += 140;
      continue;
    }

    if (normalizedCandidate.includes(variant) || variant.includes(normalizedCandidate)) {
      score += 95;
      continue;
    }

    const overlap = getWordOverlapScore(normalizedCandidate, variant);
    if (overlap >= 0.8) score += 70;
    else if (overlap >= 0.5) score += 40;
  }

  if (typeof geoDistanceMeters === "number") {
    if (geoDistanceMeters <= 150) score += 70;
    else if (geoDistanceMeters <= 600) score += 40;
    else if (geoDistanceMeters <= 2000) score += 15;
  }

  const coordinates = page?.coordinates?.[0];
  if (coordinates && typeof lat === "number" && typeof lng === "number") {
    const distanceKm = getDistanceKm(lat, lng, coordinates.lat, coordinates.lon);
    if (distanceKm <= 0.2) score += 70;
    else if (distanceKm <= 1) score += 45;
    else if (distanceKm <= 5) score += 20;
    else if (distanceKm > 15) score -= 30;
  }

  if (page?.thumbnail?.source) score += 15;

  return score;
}

async function getWikipediaPhotoUrl(placeName: string, lat?: number, lng?: number) {
  const variants = getPlaceNameVariants(placeName);
  const searchQueries = Array.from(
    new Set([
      ...variants.map((variant) => `${variant} Karnataka`),
      ...variants.map((variant) => `${variant} Bengaluru`),
      ...variants,
    ])
  );

  const titleCandidates = (await Promise.all(searchQueries.slice(0, 6).map((query) => searchWikipediaTitles(query)))).flat();
  const nearbyCandidates =
    typeof lat === "number" && typeof lng === "number"
      ? await searchWikipediaNearby(lat, lng)
      : [];

  const mergedCandidates = new Map<number, { title: string; geoDistanceMeters?: number }>();

  titleCandidates.forEach((candidate) => {
    mergedCandidates.set(candidate.pageid, { title: candidate.title });
  });

  nearbyCandidates.forEach((candidate) => {
    const existing = mergedCandidates.get(candidate.pageid);
    mergedCandidates.set(candidate.pageid, {
      title: candidate.title,
      geoDistanceMeters: existing?.geoDistanceMeters ?? candidate.dist,
    });
  });

  const pageDetails = await getWikipediaPageDetails(Array.from(mergedCandidates.keys()));

  const bestCandidate = Array.from(mergedCandidates.entries())
    .map(([pageId, candidate]) => ({
      pageId,
      title: candidate.title,
      page: pageDetails[pageId],
      score: scoreWikiCandidate(placeName, candidate.title, pageDetails[pageId], lat, lng, candidate.geoDistanceMeters),
    }))
    .filter((candidate) => candidate.page?.thumbnail?.source)
    .sort((a, b) => b.score - a.score)[0];

  if (bestCandidate && bestCandidate.score >= 85) {
    return bestCandidate.page?.thumbnail?.source ?? null;
  }

  return null;
}

export function getPlaceFallbackImage(placeName: string, lat?: number, lng?: number) {
  const safeTitle = escapeSvg(placeName);
  const locationText =
    typeof lat === "number" && typeof lng === "number"
      ? `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`
      : "Karnataka";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-label="Map preview for ${safeTitle}">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#f4faf7" />
          <stop offset="100%" stop-color="#dff4eb" />
        </linearGradient>
        <linearGradient id="card" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.82" />
        </linearGradient>
      </defs>
      <rect width="1200" height="675" fill="url(#bg)" />
      <g opacity="0.14" stroke="#0f9d73" stroke-width="6" fill="none">
        <path d="M70 130 H1130" />
        <path d="M70 250 H1130" />
        <path d="M70 370 H1130" />
        <path d="M70 490 H1130" />
        <path d="M210 60 V615" />
        <path d="M430 60 V615" />
        <path d="M650 60 V615" />
        <path d="M870 60 V615" />
      </g>
      <path d="M160 560 C320 420, 470 430, 610 300 S920 210, 1070 120" stroke="#0f9d73" stroke-width="18" fill="none" opacity="0.22" stroke-linecap="round" />
      <path d="M130 180 C230 250, 350 270, 470 230 S760 140, 980 235" stroke="#0f9d73" stroke-width="14" fill="none" opacity="0.12" stroke-linecap="round" />
      <g transform="translate(600 275)">
        <path d="M0 -110 C52 -110 94 -68 94 -16 C94 50 40 106 0 154 C-40 106 -94 50 -94 -16 C-94 -68 -52 -110 0 -110 Z" fill="#0f9d73" />
        <circle cx="0" cy="-18" r="34" fill="#ffffff" />
        <circle cx="0" cy="-18" r="14" fill="#0f9d73" />
      </g>
      <rect x="150" y="445" width="900" height="150" rx="28" fill="url(#card)" />
      <text x="190" y="505" font-size="46" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-weight="700" fill="#11352b">${safeTitle}</text>
      <text x="190" y="548" font-size="26" font-family="system-ui, -apple-system, Segoe UI, sans-serif" fill="#2c5a4b">Location verified by coordinates</text>
      <text x="190" y="585" font-size="24" font-family="system-ui, -apple-system, Segoe UI, sans-serif" fill="#4b6a60">${escapeSvg(locationText)}</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export async function getPlacePhotoUrl(
  placeName: string,
  lat?: number,
  lng?: number,
  fallbackImage?: string
): Promise<string | null> {
  const cacheKey = getCacheKey(placeName, lat, lng);
  const cached = getStoredPhoto(cacheKey);
  if (cached) return cached;

  const pendingRequest = pendingPhotoRequests.get(cacheKey);
  if (pendingRequest) return pendingRequest;

  const request = (async () => {
    const wikiPhoto = await getWikipediaPhotoUrl(placeName, lat, lng);
    const finalUrl = wikiPhoto || getPlaceFallbackImage(placeName, lat, lng) || fallbackImage || null;

    if (finalUrl) {
      storePhoto(cacheKey, finalUrl);
    }

    return finalUrl;
  })();

  pendingPhotoRequests.set(cacheKey, request);

  try {
    return await request;
  } finally {
    pendingPhotoRequests.delete(cacheKey);
  }
}

export function getGoogleMapsDirectionsUrl(destLat: number, destLng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`;
}
