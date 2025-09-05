import { useState, useCallback, useEffect } from 'react';
import { useAppStore } from '@/store';
import { getCurrentLocation } from '@/lib/utils';
import type { LocationData } from '@/types';
import toast from 'react-hot-toast';

export interface UseLocationReturn {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
  clearLocation: () => void;
}

export function useLocation(): UseLocationReturn {
  const { location, setLocation } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const coords = await getCurrentLocation();
      
      // Try to get address from coordinates using reverse geocoding
      let address: string | undefined;
      let state: string | undefined;
      
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.lat}&longitude=${coords.lon}&localityLanguage=en`
        );
        
        if (response.ok) {
          const data = await response.json();
          address = data.locality ? `${data.locality}, ${data.principalSubdivision}` : undefined;
          state = data.principalSubdivisionCode || undefined;
        }
      } catch (geocodeError) {
        console.warn('Geocoding failed:', geocodeError);
        // Continue without address - we still have coordinates
      }

      const locationData: LocationData = {
        lat: coords.lat,
        lon: coords.lon,
        address,
        state,
      };

      setLocation(locationData);
      toast.success('Location updated');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [setLocation]);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
  }, [setLocation]);

  // Auto-request location on mount if not already available
  useEffect(() => {
    if (!location && 'geolocation' in navigator) {
      // Don't auto-request - let user explicitly request for privacy
      // requestLocation();
    }
  }, [location]);

  return {
    location,
    isLoading,
    error,
    requestLocation,
    clearLocation,
  };
}
