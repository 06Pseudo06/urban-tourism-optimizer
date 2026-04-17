import { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import { MapIcon, X } from 'lucide-react';
import { motion } from "framer-motion";
import HeroInput from '../components/ui/custom/HeroInput';
import ItineraryDisplay from '../components/ui/custom/ItineraryDisplay';
import MapPanel from '../components/ui/custom/MapPanel';
import Page3DBackground from '@/components/custom/Page3DBackground';

const GlobeCanvas = lazy(() => import("@/components/custom/GlobeCanvas"));

function Createtrip() {
  const [itineraryData, setItineraryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Toggle for right side map panel
  const [showMap, setShowMap] = useState(false);

  const routeCoordinates = useMemo(() => {
    if (!itineraryData?.itinerary) return [];
    return itineraryData.itinerary.flatMap((day) => {
      const places = day.places || [];
      return places.slice(1).map((place, idx) => {
        const prev = places[idx];
        if (
          typeof prev?.latitude !== "number" ||
          typeof prev?.longitude !== "number" ||
          typeof place?.latitude !== "number" ||
          typeof place?.longitude !== "number"
        ) {
          return null;
        }
        return {
          from: [prev.latitude, prev.longitude],
          to: [place.latitude, place.longitude],
        };
      }).filter(Boolean);
    });
  }, [itineraryData]);

  const globeFocus = useMemo(() => {
    const firstPlace = itineraryData?.itinerary?.[0]?.places?.[0];
    if (
      typeof firstPlace?.latitude === "number" &&
      typeof firstPlace?.longitude === "number"
    ) {
      return [firstPlace.latitude, firstPlace.longitude];
    }
    return undefined;
  }, [itineraryData]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGenerate = async (formData) => {
    setIsLoading(true);
    setError(null);
    setShowMap(false); // Reset map
    try {
      const cleanData = Object.fromEntries(
        Object.entries(formData).filter(([k, v]) => v != null && v !== '')
      );

      const toISO = (dateStr) => {
        if (!dateStr || !dateStr.includes('/')) return dateStr;
        const [d, m, y] = dateStr.split('/');
        return `20${y}-${m}-${d}`;
      };

      if (cleanData.start_date) cleanData.start_date = toISO(cleanData.start_date);
      if (cleanData.end_date) cleanData.end_date = toISO(cleanData.end_date);

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/itinerary/generate-itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData)
      });
      
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to generate itinerary');
      
      setItineraryData(data.data);
    } catch (err) {
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
        
      {/* Primary Left Data Panel (Expands to full width when map hidden) */}
      <div className={`relative w-full h-[calc(100vh-64px)] overflow-y-auto transition-all duration-500 ease-in-out ${itineraryData && showMap ? 'md:w-1/2' : 'w-full'}`}>
        
        {/* State 1: Input Form */}
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

        {/* State 2: Loading State */}
        {isLoading && (
            <div className="w-full max-w-3xl mx-auto px-6 py-20 flex flex-col items-center justify-center space-y-6">
              <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
              <h3 className="text-xl font-bold text-slate-700 animate-pulse">Engineering your optimal route...</h3>
              <p className="text-slate-500">Checking API bounds, balancing categories, and measuring local distance metrics.</p>
              
              <div className="w-full space-y-8 mt-12 opacity-40">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-300 animate-pulse"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-6 w-3/4 bg-slate-300 rounded animate-pulse"></div>
                        <div className="h-24 w-full bg-slate-300 rounded-lg animate-pulse"></div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
        )}

        {/* State 3: Error */}
        {error && (
          <div className="p-8 mt-12 text-center bg-red-50 text-red-600 rounded-xl max-w-md w-full border border-red-100 mx-auto">
              <h3 className="font-bold mb-2">Oops, something went wrong</h3>
              <p>{error}</p>
              <button onClick={() => setError(null)} className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Try Again</button>
          </div>
        )}

        {/* State 4: Data Active */}
        {itineraryData && !isLoading && (
          <div className="pb-24 relative">
            
            {/* Context Toolbars */}
            <div className="sticky top-0 z-50 bg-white/85 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800 px-6 py-4 flex justify-between items-center shadow-sm">
              <button 
                onClick={() => { setItineraryData(null); setShowMap(false); }}
                className="text-sm font-bold text-slate-600 hover:text-black dark:text-slate-400 dark:hover:text-white transition"
              >
                ← Edit Preferences
              </button>

              {/* Map Toggle Button */}
              <button 
                onClick={() => setShowMap(!showMap)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
                  showMap 
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
                    : 'hero-gradient-btn text-white shadow-md hover:shadow-lg'
                }`}
              >
                {showMap ? (
                   <><X size={16} /> Close Map</>
                ) : (
                   <><MapIcon size={16} /> View Map</>
                )}
              </button>
            </div>

            <ItineraryDisplay itineraryData={itineraryData} />
          </div>
        )}
      </div>

      {/* Dynamic Right Panel (Map Sidebar) */}
      {itineraryData && !isLoading && (
        <div className={`fixed inset-y-0 right-0 md:relative h-screen md:h-auto bg-slate-200 border-l border-slate-300 dark:border-slate-800 transition-all duration-300 z-40 ${
          showMap ? 'w-full md:w-1/2 translate-x-0 opacity-100' : 'w-0 translate-x-full md:translate-x-0 flex-none opacity-0 invisible overflow-hidden'
        }`}>
            {showMap && <MapPanel places={itineraryData.itinerary.flatMap(day => day.places)} />}
        </div>
      )}

    </div>
  );
}

export default Createtrip;