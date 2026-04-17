import { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import { MapIcon, X } from 'lucide-react';
import { motion } from "framer-motion";
import HeroInput from '../components/ui/custom/HeroInput';
import ItineraryDisplay from '../components/ui/custom/ItineraryDisplay';
import MapPanel from '../components/ui/custom/MapPanel';
import Page3DBackground from '@/components/custom/Page3DBackground';
import { safeApiFetch } from '../config/api';

const GlobeCanvas = lazy(() => import("@/components/custom/GlobeCanvas"));

function Createtrip() {
  const [itineraryData, setItineraryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false); 

  const routeCoordinates = useMemo(() => { 
    if (!itineraryData?.itinerary) return [];
    return itineraryData.itinerary.flatMap((day) => {
      const places = day.places || [];
      return places.slice(1).map((place, idx) => {
        const prev = places[idx];
        if (
          typeof prev?.lat !== "number" ||
          typeof prev?.lng !== "number" ||
          typeof place?.lat !== "number" ||
          typeof place?.lng !== "number"
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
      typeof firstPlace?.lat === "number" &&
      typeof firstPlace?.lng === "number"
    ) {
      return [firstPlace.lat, firstPlace.lng];
    }
    return undefined;
  }, [itineraryData]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGenerate = async (formData) => {
    setIsLoading(true);
    setError(null);
    setShowMap(false);

    try {
      const cleanData = Object.fromEntries(
        Object.entries(formData).filter((entry) => entry[1] != null && entry[1] !== '')
      );

      const toISO = (dateStr) => {
        if (!dateStr || !dateStr.includes('/')) return dateStr;
        const [d, m, y] = dateStr.split('/');
        return `20${y}-${m}-${d}`;
      };

      if (cleanData.start_date) cleanData.start_date = toISO(cleanData.start_date);
      if (cleanData.end_date) cleanData.end_date = toISO(cleanData.end_date);

      const data = await safeApiFetch('/api/itinerary/generate-itinerary', {
        method: 'POST',
        body: JSON.stringify(cleanData),
      });

      if (!data?.success || !data?.data) {
        throw new Error(data?.message || 'Failed to generate itinerary');
      }

      setItineraryData(data.data);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full relative min-h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-900 dark:text-slate-100 flex">
      
      <Page3DBackground particleCount={500} globeClassName="absolute inset-0 opacity-30" />

      <div className="absolute right-4 top-4 h-52 w-52 md:h-64 md:w-64 rounded-2xl border border-cyan-400/20 bg-slate-900/40 backdrop-blur-lg overflow-hidden shadow-2xl shadow-cyan-900/30 z-20">
        <Suspense fallback={null}>
          <GlobeCanvas
            className="h-full w-full opacity-80"
            particleCount={itineraryData ? 700 : 500}
            focusLatLng={globeFocus}
            routeCoordinates={routeCoordinates}
            interactive={false}
          />
        </Suspense>
      </div>

      <div className={`relative w-full h-[calc(100vh-64px)] overflow-y-auto transition-all duration-500 ease-in-out ${itineraryData && showMap ? 'md:w-1/2' : 'w-full'}`}>

        {!itineraryData && !isLoading && (
          <motion.div
            className="flex justify-center items-center py-12 px-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HeroInput onSubmit={handleGenerate} />
          </motion.div>
        )}

        {isLoading && (
          <div className="w-full max-w-3xl mx-auto px-6 py-20 flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            <h3 className="text-xl font-bold text-slate-700 animate-pulse">Engineering your optimal route...</h3>
            <p className="text-slate-500">Checking API bounds, balancing categories, and measuring local distance metrics.</p>
          </div>
        )}

        {error && (
          <div className="p-8 mt-12 text-center bg-red-50 text-red-600 rounded-xl max-w-md w-full border border-red-100 mx-auto">
            <h3 className="font-bold mb-2">Oops, something went wrong</h3>
            <p>{error}</p>
            <button 
              onClick={() => setError(null)} 
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {itineraryData && !isLoading && (
          <div className="pb-24 relative">
            <div className="sticky top-0 z-50 bg-white/85 dark:bg-slate-950/80 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center shadow-sm">
              
              <button 
                onClick={() => { setItineraryData(null); setShowMap(false); }}
                className="text-sm font-bold"
              >
                ← Edit Preferences
              </button>

              <button 
                onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-2 px-4 py-2 rounded-full font-bold"
              >
                {showMap ? <><X size={16}/> Close Map</> : <><MapIcon size={16}/> View Map</>}
              </button>
            </div>

            <ItineraryDisplay itineraryData={itineraryData} />
          </div>
        )}
      </div>

      {itineraryData && !isLoading && (
        <div className={`${showMap ? 'w-full md:w-1/2' : 'w-0 hidden'}`}>
          {showMap && (
                <MapPanel 
                    places={
                      itineraryData?.itinerary
                      ?.flatMap(day => Array.isArray(day.places) ? day.places : [])
                      .filter(Boolean) || []
                    } 
                />
          )}
        </div>
      )}

    </div>
  );
} 

export default Createtrip;  