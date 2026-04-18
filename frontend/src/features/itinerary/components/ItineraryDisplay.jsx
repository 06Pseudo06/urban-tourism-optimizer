import { MapPin, Clock, Star, ArrowDown, Info, Thermometer, CloudRain, Sun, Cloud } from 'lucide-react';

const WeatherBadge = ({ weather }) => {
  if (!weather) return <span className="text-sm font-semibold text-slate-400">Weather unavailable</span>;

  const icon = weather.hasRain
    ? <CloudRain size={15} className="text-blue-500" />
    : weather.isExtremeHeat
      ? '🔥'
      : weather.main_weather === 'Clear'
        ? <Sun size={15} className="text-amber-500" />
        : <Cloud size={15} className="text-slate-400" />;

  return (
    <div className="flex items-center gap-2 text-sm font-bold text-slate-200 bg-black/40 border border-white/10 px-4 py-2 rounded-xl">
      {icon}
      <span>{weather.main_weather || 'Unknown'}</span>
      <span className="text-slate-500">•</span>
      <Thermometer size={14} className="text-rose-400" />
      <span>{weather.temp_max ? Math.round(weather.temp_max) : '--'}°C</span>
    </div>
  );
};

const WeatherContextBanner = ({ weather }) => {
  if (!weather || (!weather.hasRain && !weather.isExtremeHeat)) return null;

  const message = weather.hasRain
    ? "Indoor activities prioritized due to rain."
    : "Outdoor activities minimized during peak heat hours.";

  return (
    <div className="mx-auto max-w-4xl mb-6 bg-amber-900/30 border border-amber-500/30 rounded-xl p-3.5 flex items-center gap-3 shadow-sm">
      <Info size={18} className="text-amber-400 shrink-0" />
      <p className="text-sm text-amber-200 font-semibold tracking-wide">
        {message}
      </p>
    </div>
  );
};

const PlaceCard = ({ place, index, isLast }) => {
  if (!place) return null;

  const imageUrl = place.image_url || 'https://images.unsplash.com/photo-1517840901100-81f18544d6db?q=80&w=600&auto=format&fit=crop';
  const travelMins = place.travel_time_from_previous || 0;

  const isIndoor = ['cultural', 'food', 'shopping'].includes(place.category);
  const tagLabel = isIndoor ? 'Indoor' : 'Outdoor';

  return (
    <div className="relative pl-10 sm:pl-16 group flex flex-col pt-2 pb-6">
       
       {!isLast && <div className="absolute left-7 sm:left-11 top-14 bottom-0 w-[2px] bg-white/10"></div>}
       
       {index > 0 && travelMins > 0 && (
         <div className="flex items-center gap-3 text-slate-400 mb-6 -ml-3">
           <div className="w-6 h-6 rounded-full bg-black/40 border border-white/20 flex items-center justify-center relative z-10 left-[2px]">
              <ArrowDown size={14} className="text-slate-300" />
           </div>
           <span className="text-sm font-semibold uppercase text-slate-300">{travelMins} min travel</span>
         </div>
       )}

       <div className={`absolute left-4 sm:left-8 w-6 h-6 rounded-full border-4 border-slate-900 shadow-md z-10 ${
          place.category === 'food' ? 'bg-orange-500' :
          place.category === 'cultural' ? 'bg-purple-500' :
          place.category === 'activity' ? 'bg-red-500' :
          place.category === 'shopping' ? 'bg-pink-500' :
          place.category === 'leisure' ? 'bg-green-500' : 'bg-blue-500'
       }`} style={{ top: (index === 0 || travelMins === 0) ? '1.35rem' : '4.35rem' }}></div>
       
       <div className="bg-black/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 overflow-hidden hover:border-white/30 hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col sm:flex-row w-full max-w-4xl">
         
         <div className="sm:w-60 h-48 sm:h-auto shrink-0 relative overflow-hidden">
            <img src={imageUrl} alt={place.name} className="w-full h-full object-cover opacity-90" loading="lazy" />
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-white/10 text-white rounded-lg px-3 py-1.5 flex items-center gap-2">
               <Clock size={14} />
               <span className="font-bold text-sm">
                 {place.arrival_time || '--'} — {place.departure_time || '--'}
               </span>
            </div>
         </div>
         
         <div className="p-5 flex-1">
             <div className="mb-3">
              <div className="flex justify-between items-start mb-1 gap-4">
                 <h4 className="font-semibold text-xl text-white">{place.name || 'Unknown Place'}</h4>
                 
                 {typeof place.rating === "number" && place.rating > 0 && (
                   <div className="flex items-center gap-1 text-amber-300 bg-amber-900/40 border border-amber-500/30 px-2.5 py-1 rounded-md shrink-0">
                     <Star size={14} className="fill-current" />
                     <span className="font-bold text-sm">{place.rating}</span>
                   </div>
                 )}
              </div>
              
              <div className="flex gap-2 flex-wrap"> 
                <span className="text-xs font-bold px-2 py-0.5 border border-white/10 bg-black/40 text-slate-300 rounded uppercase">
                  {place.category || 'POI'}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded uppercase border border-blue-500/30 bg-blue-900/40 text-blue-300">
                  {tagLabel}
                </span>
              </div>
            </div>
            
            {place.reason && (
              <div className="mt-2 bg-blue-900/20 border border-blue-500/20 text-blue-200 rounded-lg p-3 flex gap-2">
                <Info size={16} className="text-blue-400 mt-0.5 shrink-0" />
                <p className="text-sm italic">{place.reason}</p>
              </div>
            )}
         </div>
       </div>
    </div>
  );
};

const ItineraryDisplay = ({ itineraryData }) => {
  if (!itineraryData) return null;

  // ✅ normalize ONCE
  const itinerary = Array.isArray(itineraryData?.itinerary)
    ? itineraryData.itinerary
    : [];

  const destination = itineraryData?.destination ?? 'Unknown';
  const duration = itineraryData?.duration ?? itinerary.length;
  const travelType = itineraryData?.travel_type ?? 'travel';
  const budget = itineraryData?.budget ?? 'mid';

  // ✅ empty guard
  if (itinerary.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500">
        <p className="text-lg font-semibold">No itinerary data available.</p>
        <p className="text-sm mt-2">Try adjusting your destination or dates.</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto py-4 px-2 sm:px-6">

      <div className="mb-12 text-center text-white">
         <h2 className="text-4xl font-black mb-3">
           Your {duration}-Day Trip to {destination}
         </h2>
         <p className="text-slate-300">
           Optimized for {travelType} on a {budget} budget.
         </p>
      </div>

      <div className="space-y-16">
        {itinerary.map((dayPlan, dIdx) => {
          const places = Array.isArray(dayPlan?.places) ? dayPlan.places : [];

          return (
            <div key={dayPlan?.day || dIdx}>

              <div className="sticky top-4 z-20 mx-auto max-w-4xl bg-black/40 backdrop-blur-xl border border-white/10 text-white py-3.5 mb-8 rounded-2xl px-6 flex justify-between items-center shadow-lg">
                <h3 className="font-black text-2xl flex items-center gap-3">
                   <span className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center">
                     {dayPlan?.day || dIdx + 1}
                   </span>
                   Day {dayPlan?.day || dIdx + 1}
                </h3>
                <WeatherBadge weather={dayPlan?.weather} />
              </div>

              <WeatherContextBanner weather={dayPlan?.weather} />
              
              <div className="max-w-4xl mx-auto">
                {places.length === 0 ? (
                  <div className="text-slate-500 py-12 text-center border-dashed border-2 rounded-2xl">
                    No places found for this day
                  </div>
                ) : (
                  places.map((place, idx) => (
                    <PlaceCard
                      key={place?.googlePlaceId || place?.geoapifyPlaceId || idx}
                      place={place}
                      index={idx}
                      isLast={idx === places.length - 1}
                    />
                  ))
                )}
              </div>

              {dIdx !== itinerary.length - 1 && (
                <div className="max-w-4xl mx-auto mt-12 mb-4 border-b border-white/10"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItineraryDisplay; 