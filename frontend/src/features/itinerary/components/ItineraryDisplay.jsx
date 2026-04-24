import { MapPin, Clock, Star, ArrowDown, Info, Thermometer, CloudRain, Sun, Cloud, Download } from 'lucide-react';

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
       
       {!isLast && <div className="absolute left-[1.65rem] sm:left-[2.65rem] top-12 bottom-0 w-[1px] bg-white/10"></div>}
       
       {index > 0 && travelMins > 0 && (
         <div className="flex items-center gap-3 text-slate-400 mb-8 -ml-4">
           <div className="w-5 h-5 rounded-full glass-1 flex items-center justify-center relative z-10 left-[4px]">
              <ArrowDown size={11} className="text-slate-400" />
           </div>
           <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{travelMins} min travel</span>
         </div>
       )}

       <div className={`absolute left-5 sm:left-9 w-3.5 h-3.5 rounded-full ring-4 ring-slate-950 shadow-md z-10 ${
          place.category === 'food' ? 'bg-orange-400' :
          place.category === 'cultural' ? 'bg-purple-400' :
          place.category === 'activity' ? 'bg-red-400' :
          place.category === 'shopping' ? 'bg-pink-400' :
          place.category === 'leisure' ? 'bg-green-400' : 'bg-blue-400'
       }`} style={{ top: (index === 0 || travelMins === 0) ? '1.45rem' : '4.45rem' }}></div>
       
       <div className="glass-1 overflow-hidden flex flex-col sm:flex-row w-full max-w-4xl">
         
         <div className="sm:w-64 h-48 sm:h-auto shrink-0 relative overflow-hidden">
            <img src={imageUrl} alt={place.name} className="w-full h-full object-cover opacity-80 mix-blend-screen" loading="lazy" />
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-white/10 text-white rounded-lg px-3 py-1.5 flex items-center gap-2">
               <Clock size={14} />
               <span className="font-bold text-sm">
                 {place.arrival_time || '--'} — {place.departure_time || '--'}
               </span>
            </div>
         </div>
         
         <div className="p-6 flex-1">
             <div className="mb-4">
              <div className="flex justify-between items-start mb-2 gap-4">
                 <h4 className="font-semibold text-xl text-white tracking-tight leading-tight">{place.name || 'Unknown Place'}</h4>
                 
                 {typeof place.rating === "number" && place.rating > 0 && (
                   <div className="flex items-center gap-1 text-amber-300 glass-2 px-2.5 py-1 rounded-md shrink-0">
                     <Star size={12} className="fill-current" />
                     <span className="font-bold text-xs">{place.rating}</span>
                   </div>
                 )}
              </div>
              
              <div className="flex gap-2 flex-wrap"> 
                <span className={`text-[10px] tracking-wider font-semibold px-2 py-0.5 border border-white/10 bg-white/5 text-slate-300 rounded uppercase`}>
                  {place.category || 'POI'}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase border ${
                  tagLabel === 'Outdoor' 
                    ? 'border-green-500/30 bg-green-900/40 text-green-300' 
                    : 'border-blue-500/30 bg-blue-900/40 text-blue-300'
                }`}>
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

  const handleDownload = () => {
    let content = `# Your ${duration}-Day Trip to ${destination}\n`;
    content += `Optimized for ${travelType} on a ${budget} budget.\n\n`;

    itinerary.forEach((dayPlan, dIdx) => {
      content += `## Day ${dayPlan.day || dIdx + 1}\n\n`;
      const places = Array.isArray(dayPlan.places) ? dayPlan.places : [];

      if (places.length === 0) {
        content += `(No places planned for this day)\n\n`;
      } else {
        places.forEach((place) => {
          content += `### ${place.name || 'Unknown Place'}\n`;
          content += `- **Time:** ${place.arrival_time || '--'} to ${place.departure_time || '--'}\n`;
          if (place.category) content += `- **Category:** ${place.category}\n`;
          if (place.reason) content += `- **Note:** ${place.reason}\n`;
          if (place.rating) content += `- **Rating:** ${place.rating} / 5\n`;
          if (place.travel_time_from_previous > 0) content += `- *Travel from previous:* ${place.travel_time_from_previous} mins\n`;
          content += `\n`;
        });
      }
      content += `---\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${destination.replace(/\\s+/g, '_')}_Itinerary.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full mx-auto py-4 px-2 sm:px-6">

      <div className="mb-12 text-center text-white relative">
         <h2 className="text-4xl font-black mb-3">
           Your {duration}-Day Trip to {destination}
         </h2>
         <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
           <p className="text-slate-300">
             Optimized for {travelType} on a {budget} budget.
           </p>
           <button 
             onClick={handleDownload}
             className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/40 hover:text-white transition-all shadow-lg"
             title="Download as Markdown"
           >
             <Download size={14} /> Download (.md)
           </button>
         </div>
      </div>

      <div className="space-y-16">
        {itinerary.map((dayPlan, dIdx) => {
          const places = Array.isArray(dayPlan?.places) ? dayPlan.places : [];

          return (
            <div key={dayPlan?.day || dIdx}>

              <div className="sticky top-4 z-20 mx-auto max-w-4xl glass-2 py-4 mb-6 sm:mb-10 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white">
                <h3 className="font-semibold text-2xl tracking-tight flex items-center gap-3">
                   <span className="bg-indigo-500 text-white w-8 h-8 text-sm rounded-lg flex items-center justify-center">
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