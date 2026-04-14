/**
 * Fetch place images from Wikipedia
 * More reliable than Google Places for common tourist destinations
 */

export async function getWikipediaImage(placeName: string): Promise<string | null> {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
      placeName
    )}&prop=pageimages&pithumbsize=600&format=json&origin=*`;

    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    const pages = data.query?.pages;
    if (!pages) return null;

    const page = Object.values(pages)[0] as any;
    return page.thumbnail?.source || null;
  } catch (error) {
    console.error('Error fetching Wikipedia image:', error);
    return null;
  }
}

/**
 * Cache for Wikipedia images
 */
const wikiImageCache = new Map<string, string | null>();

/**
 * Get Wikipedia image with caching
 */
export async function getCachedWikipediaImage(placeName: string): Promise<string | null> {
  if (wikiImageCache.has(placeName)) {
    return wikiImageCache.get(placeName) || null;
  }

  const imageUrl = await getWikipediaImage(placeName);
  wikiImageCache.set(placeName, imageUrl);
  return imageUrl;
}

/**
 * Batch fetch Wikipedia images
 */
export async function getWikipediaImagesBatch(
  placeNames: string[]
): Promise<Map<string, string | null>> {
  const results = new Map<string, string | null>();

  // Process in parallel with a limit
  const chunkSize = 5;
  for (let i = 0; i < placeNames.length; i += chunkSize) {
    const chunk = placeNames.slice(i, i + chunkSize);

    const chunkResults = await Promise.allSettled(
      chunk.map(async (name) => {
        try {
          const url = await getCachedWikipediaImage(name);
          return { name, url };
        } catch {
          return { name, url: null };
        }
      })
    );

    for (const result of chunkResults) {
      if (result.status === 'fulfilled') {
        results.set(result.value.name, result.value.url);
      }
    }
  }

  return results;
}

/**
 * Clear Wikipedia image cache
 */
export function clearWikiImageCache(): void {
  wikiImageCache.clear();
}

/**
 * Get cache statistics
 */
export function getWikiImageCacheStats() {
  return {
    size: wikiImageCache.size,
    entries: Array.from(wikiImageCache.keys()),
  };
}
