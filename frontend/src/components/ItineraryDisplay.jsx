import React from 'react';
import { MapPin, Clock, CalendarDays, Utensils, Camera, PartyPopper } from 'lucide-react';

function ItineraryDisplay({ tripData }) {
  if (!tripData || !tripData.data) return null;

  const { city, duration, interests, places, routes } = tripData.data;

  // Group paths (routes) by day
  const groupedRoutes = routes.reduce((acc, route) => {
    if (!acc[route.day]) acc[route.day] = [];
    acc[route.day].push(route.place);
    return acc;
  }, {});

  // Map Place Name to Place Object for easy category lookup
  const placeMap = {};
  places.forEach((p) => {
    placeMap[p.name] = p;
  });

  const getCategoryIcon = (category) => {
    if (!category) return <MapPin className="text-gray-500 w-5 h-5" />;
    const cat = category.toLowerCase();
    if (cat.includes('catering') || cat.includes('restaurant') || cat.includes('food')) {
      return <Utensils className="text-orange-500 w-5 h-5" />;
    }
    if (cat.includes('tourism') || cat.includes('attraction')) {
      return <Camera className="text-blue-500 w-5 h-5" />;
    }
    if (cat.includes('entertainment') || cat.includes('leisure')) {
      return <PartyPopper className="text-purple-500 w-5 h-5" />;
    }
    return <MapPin className="text-gray-500 w-5 h-5" />;
  };

  return (
    <div className="mt-12 bg-white p-6 md:p-10 border rounded-2xl shadow-xl w-full">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-xl shadow-md mb-10">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Your trip to {city}</h2>
        <div className="flex flex-wrap gap-4 mt-6">
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full font-medium">
            <Clock className="w-5 h-5" />
            <span>{duration} Days</span>
          </div>
          {interests && interests.map((interest, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full font-medium">
              <span>{interest}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TIMELINE SECTION */}
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Your Daily Itinerary</h3>
      <div className="space-y-10">
        {Object.entries(groupedRoutes).map(([dayString, dayPlaces]) => (
          <div key={dayString} className="relative">
            {/* Day Header */}
            <div className="flex items-center mb-6">
              <div className="bg-black text-white p-3 rounded-full mr-4 z-10 relative shadow-md">
                <CalendarDays className="w-6 h-6" />
              </div>
              <h4 className="text-2xl font-bold bg-gray-100 px-6 py-2 rounded-full">Day {dayString}</h4>
            </div>

            {/* Vertical Line */}
            <div className="absolute left-6 top-16 bottom-0 w-1 bg-gray-200 -z-0"></div>

            {/* Cards for each place */}
            <div className="ml-[60px] flex flex-col gap-6">
              {dayPlaces.map((placeName, index) => {
                const placeData = placeMap[placeName];
                const category = placeData?.category || "Place of Interest";

                return (
                  <div key={index} className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-3 rounded-full">
                          {getCategoryIcon(category)}
                        </div>
                        <div>
                          <h5 className="font-bold text-xl text-gray-900">{placeName}</h5>
                          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{category.split('.')[0]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ItineraryDisplay;
