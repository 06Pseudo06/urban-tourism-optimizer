const NodeCache = require('node-cache');
const { safeFetch } = require('../utils/safeFetch');

// Cache weather responses for 3 hours
const weatherCache = new NodeCache({ stdTTL: 10800 });

/**
 * Fetch 5-day forecast from OpenWeatherMap
 * Requires OPENWEATHER_API_KEY in .env
 */
const getOpenWeatherForecast = async (lat, lon) => {
  // Fix: Math.round only takes one argument. Using precision for cache key.
  const cacheKey = `weather_${Number(lat).toFixed(2)}_${Number(lon).toFixed(2)}`;
  const cached = weatherCache.get(cacheKey);
  
  if (cached) return cached;

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    console.warn("OPENWEATHER_API_KEY not found.");
    return null;
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  
  // Using the requested safeFetch pattern
  const { ok, data } = await safeFetch(url);

  if (!ok || !data || !Array.isArray(data.list)) {
    console.warn('[WeatherService] OpenWeather returned invalid data.');
    return null;
  }

  try {
    // Group forecast by day
    const dailyForecast = {};
    
    data.list.forEach(item => {
      // Extract yyyy-mm-dd from dt_txt
      const date = item.dt_txt.split(' ')[0];
      
      if (!dailyForecast[date]) {
        dailyForecast[date] = {
          temp_max: item.main.temp_max,
          temp_min: item.main.temp_min,
          weather: item.weather[0].main, 
          conditions: []
        };
      }
      
      dailyForecast[date].conditions.push(item.weather[0].main);
      
      // Keep track of the highest temperature recorded for that day
      if (item.main.temp_max > dailyForecast[date].temp_max) {
        dailyForecast[date].temp_max = item.main.temp_max;
      }
    });

    // Simplify daily forecast into final structure
    const simplifiedForecast = Object.keys(dailyForecast).map(date => {
      const dayData = dailyForecast[date];
      
      // If any 3-hour window has rain/storms, flag the whole day
      const hasRain = dayData.conditions.some(c => ['Rain', 'Thunderstorm', 'Drizzle'].includes(c));
      const isExtremeHeat = dayData.temp_max > 35;

      return {
        date,
        temp_max: dayData.temp_max,
        main_weather: hasRain ? 'Rain' : dayData.weather,
        hasRain,
        isExtremeHeat
      };
    });

    weatherCache.set(cacheKey, simplifiedForecast);
    return simplifiedForecast;
    
  } catch (error) {
    console.error("Weather Service Processing Error:", error.message);
    return null; 
  }
};

const getGoogleWeatherForecast = async (lat, lon) => {
  // Placeholder for future Google integrations
  return null; 
};

const getDetailedWeatherForecast = async (lat, lon) => {
  // PRIORITY 1: OpenWeather
  if (process.env.OPENWEATHER_API_KEY) {
    const res = await getOpenWeatherForecast(lat, lon);
    if (res) return res;
  }

  // PRIORITY 2: Google/custom API
  if (process.env.GOOGLE_WEATHER_API_KEY) {
    const res = await getGoogleWeatherForecast(lat, lon);
    if (res) return res;
  }

  console.warn("Weather API not configured properly or failed to respond.");

  // SAFE FALLBACK (Ensures UI doesn't break)
  return [{
    date: new Date().toISOString().split('T')[0],
    temp_max: 30,
    main_weather: 'Clear',
    hasRain: false,
    isExtremeHeat: false
  }];
};

module.exports = {
  getDetailedWeatherForecast
}; 