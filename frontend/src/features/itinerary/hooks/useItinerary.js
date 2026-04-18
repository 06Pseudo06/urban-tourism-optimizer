import { useState, useMemo } from 'react';
import { generateItinerary } from '../services/itinerary.service';

export const useItinerary = () => {
  const [itineraryData, setItineraryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItinerary = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await generateItinerary(formData);
      setItineraryData(data);
      return data;
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unknown error occurred.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetItinerary = () => {
    setItineraryData(null);
    setError(null);
  };

  const routeCoordinates = useMemo(() => {
    if (!itineraryData?.itinerary) return [];
    return itineraryData.itinerary.flatMap((day) => {
      const places = day.places || [];
      return places.slice(1).map((place, idx) => {
        const prev = places[idx];
        if (
          typeof prev?.lat !== 'number' ||
          typeof prev?.lng !== 'number' ||
          typeof place?.lat !== 'number' ||
          typeof place?.lng !== 'number'
        ) {
          return null;
        }
        return {
          from: [prev.lat, prev.lng],
          to: [place.lat, place.lng],
        };
      }).filter(Boolean);
    });
  }, [itineraryData]);

  const globeFocus = useMemo(() => {
    const firstPlace = itineraryData?.itinerary?.[0]?.places?.[0];
    if (
      typeof firstPlace?.lat === 'number' &&
      typeof firstPlace?.lng === 'number'
    ) {
      return [firstPlace.lat, firstPlace.lng];
    }
    return undefined;
  }, [itineraryData]);

  return {
    itineraryData,
    isLoading,
    error,
    fetchItinerary,
    resetItinerary,
    routeCoordinates,
    globeFocus,
    setError
  };
};
