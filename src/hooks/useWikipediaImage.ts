import { useState, useEffect } from 'react';
import { getCachedWikipediaImage } from '../lib/wikipediaImages';

/**
 * Hook to fetch place images from Wikipedia
 * More reliable than Google Places API for tourist destinations
 */
export const useWikipediaImage = (placeName: string, fallbackImage?: string) => {
  const [imageUrl, setImageUrl] = useState<string | null>(fallbackImage || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!placeName) return;

    let isMounted = true;

    const fetchImage = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const url = await getCachedWikipediaImage(placeName);

        if (isMounted) {
          if (url) {
            setImageUrl(url);
          } else if (fallbackImage) {
            setImageUrl(fallbackImage);
          }
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err : new Error(String(err));
          setError(errorMessage);
          if (fallbackImage) {
            setImageUrl(fallbackImage);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const timer = setTimeout(fetchImage, 50);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [placeName, fallbackImage]);

  return { imageUrl, isLoading, error };
};
