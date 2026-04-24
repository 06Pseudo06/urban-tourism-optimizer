import { useState, useEffect } from 'react';
import { MapIcon, X } from 'lucide-react';
import { motion } from 'framer-motion';
import HeroInput from '@/features/itinerary/components/HeroInput';
import ItineraryDisplay from '@/features/itinerary/components/ItineraryDisplay';
import MapPanel from '@/features/itinerary/components/MapPanel';
import { useItinerary } from '@/features/itinerary/hooks/useItinerary';
import { API_BASE_URL } from '@/config/api';

function Itinerary() {
  const { itineraryData, isLoading, error, fetchItinerary, resetItinerary, setError } = useItinerary();
  const [showMap, setShowMap] = useState(false); 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGenerate = async (formData) => {
    setShowMap(false);
    try {
      const data = await fetchItinerary(formData);
      
      // Async Save
      const token = localStorage.getItem('authToken');
      if (token && data) {
        fetch(`${API_BASE_URL}/api/itinerary/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            destination: formData.destination,
            duration: formData.days || 3,
            travel_type: formData.travel_type,
            budget: formData.budget,
            itinerary: data
          })
        }).catch(err => console.error("Silently failing save:", err));
      }
    } catch (err) {
      // Handled by hook
    }
  };

  return (
    <div className="w-full relative min-h-screen flex flex-col md:flex-row text-slate-100">
      <div className={`relative w-full h-[calc(100vh-64px)] overflow-y-auto transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-10 ${itineraryData && showMap ? 'md:w-1/2 md:border-r border-white/10' : 'w-full'}`}>

        {!itineraryData && !isLoading && (
          <motion.div
            className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HeroInput onSubmit={handleGenerate} />
          </motion.div>
        )}

        {isLoading && (
          <div className="w-full max-w-3xl mx-auto px-6 py-32 flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 border-4 border-solid border-white/10 border-t-cyan-400 rounded-full animate-spin flex-shrink-0"></div>
            <h3 className="text-xl font-bold text-white animate-pulse">Engineering your optimal route...</h3>
            <p className="text-slate-400 text-center max-w-sm">Checking API bounds, balancing categories, and measuring local distance metrics.</p>
          </div>
        )}

        {error && (
          <div className="p-8 mt-12 text-center bg-red-50 text-red-600 rounded-xl max-w-md w-full border border-red-100 mx-auto">
            <h3 className="font-bold mb-2">Oops, something went wrong</h3>
            <p>{error}</p>
            <button 
              onClick={() => setError(null)} 
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
            >
              Try Again
            </button>
          </div>
        )}

        {itineraryData && !isLoading && (
          <div className="pb-24 relative">
            <div className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center shadow-lg">
              <button 
                onClick={() => { resetItinerary(); setShowMap(false); }}
                className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                aria-label="Edit Preferences"
              >
                ← Edit Preferences
              </button>

              <button 
                onClick={() => setShowMap(!showMap)}
                className="primary-btn text-sm flex items-center justify-center gap-2 px-5 py-2"
              >
                {showMap ? <><X size={16}/> Close Map</> : <><MapIcon size={16}/> View Map</>}
              </button>
            </div>

            <ItineraryDisplay itineraryData={itineraryData} />
          </div>
        )}
      </div>

      {itineraryData && !isLoading && (
        <div className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] bg-slate-950 relative ${showMap ? 'w-full md:w-1/2 md:block block h-[50vh] md:h-[calc(100vh-64px)] opacity-100 translate-x-0' : 'w-0 hidden h-0 overflow-hidden opacity-0 translate-x-12'}`}>
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
