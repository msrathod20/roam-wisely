import { Place } from "@/data/places";

export interface ExternalPlace extends Omit<Place, 'category' | 'whyFamous' | 'thingsToTry' | 'rating' | 'isEcoFriendly'> {
  category: Place['category'];
  whyFamous: string;
  thingsToTry: string[];
  rating: number;
  isEcoFriendly: boolean;
  isExternal: true;
  wikiUrl?: string;
}

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  class: string;
  importance: number;
}

interface WikiSearchResult {
  pageid: number;
  title: string;
  snippet: string;
}

interface WikiPageResult {
  extract: string;
  thumbnail?: { source: string };
  coordinates?: { lat: number; lon: number }[];
  fullurl: string;
}

const categoryFallbackImages: Record<string, string> = {
  food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
  cafe: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
  nature: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
  heritage: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
  nightlife: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80',
  activities: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80',
  attraction: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
  eco: 'https://images.unsplash.com/photo-1500049242364-5f500807cdd7?w=600&q=80',
};

function inferCategory(type: string, className: string, description: string): Place['category'] {
  const desc = (type + ' ' + className + ' ' + description).toLowerCase();
  if (desc.match(/restaurant|food|cafe|bakery|fast_food|bar|pub/)) return 'food';
  if (desc.match(/cafe|coffee/)) return 'cafe';
  if (desc.match(/park|garden|forest|lake|river|waterfall|nature|reserve/)) return 'nature';
  if (desc.match(/museum|temple|church|mosque|monument|palace|fort|heritage|castle|ruins|historic/)) return 'heritage';
  if (desc.match(/club|nightlife|cinema|theatre|theater/)) return 'nightlife';
  if (desc.match(/sport|adventure|trek|hike|bike|cycle|swim/)) return 'activities';
  return 'attraction';
}

async function searchNominatim(query: string): Promise<NominatimResult[]> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=8&addressdetails=1&extratags=1`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'ExplorerApp/1.0' }
  });
  if (!res.ok) return [];
  return res.json();
}

async function searchWikipedia(query: string): Promise<WikiSearchResult[]> {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + ' place tourist')}&srlimit=6&format=json&origin=*`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return data?.query?.search || [];
}

async function getWikiPage(title: string): Promise<WikiPageResult | null> {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts|pageimages|coordinates|info&exintro=true&explaintext=true&piprop=thumbnail&pithumbsize=1200&inprop=url&format=json&origin=*`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const pages = data?.query?.pages;
  if (!pages) return null;
  const page = Object.values(pages)[0] as any;
  if (page.missing !== undefined) return null;
  return {
    extract: page.extract || '',
    thumbnail: page.thumbnail,
    coordinates: page.coordinates,
    fullurl: page.fullurl,
  };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

export async function searchExternalPlaces(query: string): Promise<ExternalPlace[]> {
  if (!query || query.trim().length < 3) return [];

  try {
    const [nominatimResults, wikiResults] = await Promise.all([
      searchNominatim(query),
      searchWikipedia(query),
    ]);

    const places: ExternalPlace[] = [];
    const seenNames = new Set<string>();

    // Process Wikipedia results (richer data)
    for (const wiki of wikiResults.slice(0, 5)) {
      if (seenNames.has(wiki.title.toLowerCase())) continue;
      
      const pageData = await getWikiPage(wiki.title);
      if (!pageData || !pageData.extract || pageData.extract.length < 50) continue;

      const lat = pageData.coordinates?.[0]?.lat;
      const lon = pageData.coordinates?.[0]?.lon;
      
      // Try to get coordinates from Nominatim if Wikipedia doesn't have them
      let finalLat = lat || 0;
      let finalLon = lon || 0;
      
      if (!lat || !lon) {
        const nomMatch = nominatimResults.find(n => 
          n.display_name.toLowerCase().includes(wiki.title.toLowerCase().split(' ')[0])
        );
        if (nomMatch) {
          finalLat = parseFloat(nomMatch.lat);
          finalLon = parseFloat(nomMatch.lon);
        }
      }

      const description = pageData.extract.slice(0, 300) + (pageData.extract.length > 300 ? '...' : '');
      const snippet = stripHtml(wiki.snippet);
      
      seenNames.add(wiki.title.toLowerCase());
      places.push({
        id: `ext-wiki-${wiki.pageid}`,
        name: wiki.title,
        description,
        whyFamous: snippet || description.slice(0, 150),
        history: pageData.extract.length > 300 ? pageData.extract.slice(300, 800) : undefined,
        thingsToTry: ['Explore the area', 'Take photos', 'Learn local history'],
        foodNearby: [],
        category: inferCategory('', '', description),
        lat: finalLat,
        lng: finalLon,
        image: pageData.thumbnail?.source || `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800`,
        rating: 4.0 + Math.random() * 0.8,
        isEcoFriendly: false,
        isExternal: true,
        wikiUrl: pageData.fullurl,
      });
    }

    // Add Nominatim results not already covered
    for (const nom of nominatimResults) {
      const name = nom.display_name.split(',')[0].trim();
      if (seenNames.has(name.toLowerCase())) continue;
      if (places.length >= 8) break;

      seenNames.add(name.toLowerCase());
      places.push({
        id: `ext-nom-${nom.place_id}`,
        name,
        description: nom.display_name,
        whyFamous: `Located at ${nom.display_name.split(',').slice(0, 3).join(',')}`,
        thingsToTry: ['Visit and explore', 'Check local attractions'],
        category: inferCategory(nom.type, nom.class, nom.display_name),
        lat: parseFloat(nom.lat),
        lng: parseFloat(nom.lon),
        image: `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800`,
        rating: 3.5 + Math.random(),
        isEcoFriendly: false,
        isExternal: true,
      });
    }

    return places;
  } catch (err) {
    console.error('External search failed:', err);
    return [];
  }
}
