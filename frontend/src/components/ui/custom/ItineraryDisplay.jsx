import { MapPin, Clock, Star, Navigation, ArrowDown, Info, Thermometer, CloudRain, Sun, Cloud } from 'lucide-react';
import { motion } from "framer-motion";

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
    <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl">
      {typeof icon === 'string' ? icon : icon}
      <span>{weather.main_weather}</span>
      <span className="text-slate-400">•</span>
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
    <div className="mx-auto max-w-4xl mb-6 bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-3.5 flex items-center gap-3 shadow-sm">
      <Info size={18} className="text-amber-600 dark:text-amber-400 shrink-0" />
      <p className="text-sm text-amber-800 dark:text-amber-300 font-semibold tracking-wide">
        {message}
      </p>
    </div>
  );
};

const PlaceCard = ({ place, index, isLast }) => {
  const imageUrl = place.image_url || 'https://images.unsplash.com/photo-1517840901100-81f18544d6db?q=80&w=600&auto=format&fit=crop';
  const travelMins = place.travel_time_from_previous;

  const isIndoor = ['cultural', 'food', 'shopping'].includes(place.category);
  const tagLabel = isIndoor ? 'Indoor' : 'Outdoor';

  return (
    <motion.div
      className="relative pl-10 sm:pl-16 group flex flex-col pt-2 pb-6"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.3) }}
    >
       {/* Timeline Background Line */}
       {!isLast && <div className="absolute left-6 sm:left-10 top-14 bottom-0 w-[2px] bg-slate-200 dark:bg-slate-700"></div>}
       
       {/* Travel Delay Arrow Segment */}
       {index > 0 && travelMins > 0 && (
         <div className="flex items-center gap-3 text-slate-500 mb-6 -ml-3">
           <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center relative z-10 left-[2px]">
              <ArrowDown size={14} className="text-slate-400" />
           </div>
           <span className="text-sm font-semibold tracking-wide uppercase">{travelMins} min travel</span>
         </div>
       )}

       {/* Timeline Node */}
       <div className={`absolute left-4 sm:left-8 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 shadow-md z-10 transition-transform group-hover:scale-125 ${
          place.category === 'food' ? 'bg-orange-500' :
          place.category === 'cultural' ? 'bg-purple-500' :
          place.category === 'activity' ? 'bg-red-500' :
          place.category === 'shopping' ? 'bg-pink-500' :
          place.category === 'leisure' ? 'bg-green-500' : 'bg-blue-500'
       }`} style={{ top: (index === 0 || travelMins === 0) ? '1.5rem' : '4.5rem' }}></div>
       
       {/* Card Geometry */}
       <div className="bg-white/85 dark:bg-slate-900/80 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-cyan-900/25 transition-all duration-300 transform group-hover:-translate-y-1 flex flex-col sm:flex-row w-full max-w-4xl backdrop-blur-lg">
         
         <div className="sm:w-60 h-48 sm:h-auto shrink-0 relative overflow-hidden bg-slate-100">
            <img src={imageUrl} alt={place.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-lg shadow-sm px-3 py-1.5 flex items-center gap-2 border border-slate-100 dark:border-slate-700">
               <Clock size={14} className="text-blue-600" />
               <span className="font-bold text-sm text-slate-900 dark:text-white">
                 {place.arrival_time} — {place.departure_time}
               </span>
            </div>
         </div>
         
         <div className="p-5 flex-1 flex flex-col justify-center">
            <div className="mb-3">
              <div className="flex justify-between items-start mb-1 gap-4">
                 <h4 className="font-extrabold text-xl leading-tight group-hover:text-blue-600 transition-colors">{place.name}</h4>
                 {place.rating > 0 && (
                   <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md mb-2 shrink-0 border border-amber-100">
                     <Star size={14} className="fill-current" />
                     <span className="font-bold text-sm">{place.rating}</span>
                   </div>
                 )}
              </div>
              
              <div className="flex items-center gap-2 flex-wrap"> 
                <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded uppercase tracking-wider">
                  {place.category || 'POI'}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${isIndoor ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'}`}>
                  {tagLabel}
                </span>
              </div>
            </div>
            
            {place.reason && (
              <div className="mt-2 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg p-3 flex items-start gap-2">
                <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">{place.reason}</p>
              </div>
            )}
         </div>
       </div>
      <div className="absolute left-7 sm:left-11 top-9 h-[calc(100%-1.2rem)] w-[1px] bg-gradient-to-b from-cyan-300/60 via-violet-400/45 to-transparent pointer-events-none" />
    </motion.div>
  );
};

const ItineraryDisplay = ({ itineraryData }) => {
  if (!itineraryData || !itineraryData.itinerary) return null;

  return (
    <div className="w-full mx-auto py-4 px-2 sm:px-6 animate-in fade-in duration-1000 slide-in-from-bottom-8">
      
      <div className="mb-12 text-center text-slate-800 dark:text-slate-200">
         <h2 className="text-4xl font-black mb-3">Your {itineraryData.duration}-Day Trip to {itineraryData.destination}</h2>
         <p className="text-slate-500 text-lg font-medium">Optimized for {itineraryData.travel_type} on a {itineraryData.budget} budget.</p>
      </div>

      <div className="space-y-16">
        {itineraryData.itinerary.map((dayPlan, dIdx) => (
          <motion.div
            key={dayPlan.day}
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, delay: Math.min(dIdx * 0.08, 0.32) }}
          >
            <div className="sticky top-4 z-20 mx-auto max-w-4xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl py-3.5 mb-8 rounded-2xl px-6 flex items-center justify-between border-2 border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20">
                <h3 className="font-black text-2xl flex items-center gap-3">
                   <span className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-inner">
                     {dayPlan.day}
                   </span>
                   Day {dayPlan.day}
                </h3>
                <WeatherBadge weather={dayPlan.weather} />
            </div>

            <WeatherContextBanner weather={dayPlan.weather} />
            
            <div className="max-w-4xl mx-auto">
              {dayPlan.places.length === 0 ? (
                <div className="text-slate-500 py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                   <p className="font-medium text-lg">No places matched constraints for this day.</p>
                   <p className="text-sm mt-1 opacity-75">Try extending your hours or loosening budget constraints.</p>
                </div>
              ) : (
                dayPlan.places.map((place, idx) => (
                  <PlaceCard key={place.googlePlaceId || place.geoapifyPlaceId || idx} place={place} index={idx} isLast={idx === dayPlan.places.length - 1} />
                ))
              )}
            </div>
            
            {/* Visual spacer ending the day block cleanly */}
            {dIdx !== itineraryData.itinerary.length - 1 && (
               <div className="max-w-4xl mx-auto mt-12 mb-4 border-b-2 border-slate-100 dark:border-slate-800/50"></div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryDisplay;
