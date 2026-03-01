import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "studyura_user_city";
const PROMPTED_KEY = "studyura_location_prompted";

interface UseUserLocationReturn {
  city: string | null;
  loading: boolean;
  error: string | null;
  prompted: boolean;
  requestLocation: () => Promise<string | null>;
  clearLocation: () => void;
  setPrompted: () => void;
}

async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    return (
      data?.address?.city ||
      data?.address?.town ||
      data?.address?.village ||
      data?.address?.state_district ||
      null
    );
  } catch {
    return null;
  }
}

function getPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000,
    });
  });
}

export function useUserLocation(): UseUserLocationReturn {
  const [city, setCity] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompted, setPromptedState] = useState(() =>
    localStorage.getItem(PROMPTED_KEY) === "true"
  );

  const setPrompted = useCallback(() => {
    localStorage.setItem(PROMPTED_KEY, "true");
    setPromptedState(true);
  }, []);

  const clearLocation = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCity(null);
  }, []);

  const requestLocation = useCallback(async (): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const position = await getPosition();
      const detectedCity = await reverseGeocode(
        position.coords.latitude,
        position.coords.longitude
      );
      if (detectedCity) {
        localStorage.setItem(STORAGE_KEY, detectedCity);
        setCity(detectedCity);
      }
      setPrompted();
      return detectedCity;
    } catch (err: any) {
      setError(err?.message || "Location access denied");
      setPrompted();
      return null;
    } finally {
      setLoading(false);
    }
  }, [setPrompted]);

  return { city, loading, error, prompted, requestLocation, clearLocation, setPrompted };
}
