import { useState, useEffect } from 'react';
import { MapIcon, X } from 'lucide-react';
import { motion } from 'framer-motion';
import HeroInput from '@/features/itinerary/components/HeroInput';
import ItineraryDisplay from '@/features/itinerary/components/ItineraryDisplay';
import MapPanel from '@/features/itinerary/components/MapPanel';
import { useItinerary } from '@/features/itinerary/hooks/useItinerary';

function Itinerary() {
  const { itineraryData, isLoading, error, fetchItinerary, resetItinerary, setError } = useItinerary();
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGenerate = async (formData) => {
    setShowMap(false);
    await fetchItinerary(formData);
  };

  return (
    <div
      className="w-full relative min-h-screen overflow-hidden flex flex-col md:flex-row"
      style={{ background: "var(--cream)", fontFamily: "var(--font-body)" }}
    >
      {/* Subtle warm top gradient */}
      <div
        className="absolute top-0 inset-x-0 h-64 pointer-events-none z-0"
        style={{
          background: "linear-gradient(to bottom, rgba(22,45,88,0.05) 0%, transparent 100%)",
        }}
      />

      {/* Main content panel */}
      <div
        className={`relative w-full h-[calc(100vh-64px)] overflow-y-auto scrollbar-thin transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-10 ${
          itineraryData && showMap ? 'md:w-1/2' : 'w-full'
        }`}
        style={{
          borderRight: itineraryData && showMap ? '1px solid rgba(22,45,88,0.1)' : 'none',
        }}
      >
        {!itineraryData && !isLoading && (
          <motion.div
            className="flex justify-center items-start py-10 px-6 min-h-full"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HeroInput onSubmit={handleGenerate} />
          </motion.div>
        )}

        {isLoading && (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-6 px-6 py-32">
            {/* Gold spinner */}
            <div
              className="w-16 h-16 rounded-full"
              style={{
                border: '3px solid rgba(201,150,31,0.15)',
                borderTopColor: 'var(--gold-500)',
                animation: 'spin 0.9s linear infinite',
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <div className="text-center">
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.6rem",
                  fontWeight: 600,
                  color: "var(--navy-900)",
                }}
              >
                Engineering your optimal route
              </h3>
              <p className="mt-2" style={{ color: "var(--slate-warm-600)", fontSize: "0.9rem" }}>
                Checking distances, balancing categories, and curating your day.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center min-h-full px-6 py-20">
            <div
              className="p-8 text-center rounded-2xl max-w-md w-full"
              style={{
                background: "rgba(239,68,68,0.05)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <div className="text-3xl mb-3">✦</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--navy-900)", fontWeight: 600 }}>
                Something went wrong
              </h3>
              <p className="mt-2 mb-6 text-sm" style={{ color: "var(--slate-warm-600)" }}>{error}</p>
              <button
                onClick={() => setError(null)}
                className="btn-gold px-6 py-2.5 rounded-xl text-sm font-semibold"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {itineraryData && !isLoading && (
          <div className="pb-24 relative">
            {/* Sticky toolbar */}
            <div
              className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center"
              style={{
                background: "rgba(253,248,240,0.95)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(22,45,88,0.08)",
                boxShadow: "0 2px 12px rgba(22,45,88,0.06)",
              }}
            >
              <button
                onClick={() => { resetItinerary(); setShowMap(false); }}
                className="text-sm font-medium transition-colors"
                style={{ color: "var(--slate-warm-600)" }}
                onMouseOver={e => e.target.style.color = "var(--navy-900)"}
                onMouseOut={e => e.target.style.color = "var(--slate-warm-600)"}
              >
                ← Edit preferences
              </button>
              <button
                onClick={() => setShowMap(!showMap)}
                className="btn-gold flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold"
              >
                {showMap ? <><X size={14} /> Hide Map</> : <><MapIcon size={14} /> View Map</>}
              </button>
            </div>
            <ItineraryDisplay itineraryData={itineraryData} />
          </div>
        )}
      </div>

      {/* Map panel */}
      {itineraryData && !isLoading && (
        <div
          className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] relative ${
            showMap
              ? 'w-full md:w-1/2 md:block block h-[50vh] md:h-[calc(100vh-64px)] opacity-100'
              : 'w-0 hidden h-0 overflow-hidden opacity-0'
          }`}
          style={{ background: "var(--slate-warm-100)" }}
        >
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

export default Itinerary;
