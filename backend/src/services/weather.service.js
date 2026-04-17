const NodeCache = require('node-cache');
// Cache weather responses for 3 hours
const weatherCache = new NodeCache({ stdTTL: 10800 });

/**
 * Fetch 5-day forecast from OpenWeatherMap
 * Requires OPENWEATHER_API_KEY in .env
 */
const getOpenWeatherForecast = async (lat, lon) => {
  const cacheKey = `weather_${Math.round(lat, 2)}_${Math.round(lon, 2)}`;
  const cached = weatherCache.get(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    console.warn("OPENWEATHER_API_KEY not found.");
    return null;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`OpenWeather API failed: ${res.statusText}`);
    }
    const data = await res.json();
    
    // Group forecast by day
    const dailyForecast = {};
    data.list.forEach(item => {
      // yyyy-mm-dd
      const date = item.dt_txt.split(' ')[0];
      if (!dailyForecast[date]) {
        dailyForecast[date] = {
          temp_max: item.main.temp_max,
          temp_min: item.main.temp_min,
          weather: item.weather[0].main, // e.g. Rain, Clear, Clouds
          conditions: []
        };
      }
      
      dailyForecast[date].conditions.push(item.weather[0].main);
      if (item.main.temp_max > dailyForecast[date].temp_max) {
        dailyForecast[date].temp_max = item.main.temp_max;
      }
    });

    // Simplify daily forecast
    const simplifiedForecast = Object.keys(dailyForecast).map(date => {
      const dayData = dailyForecast[date];
      // If any of the 3-hour periods has Rain, count as rainy
      const hasRain = dayData.conditions.includes('Rain') || dayData.conditions.includes('Thunderstorm');
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
    console.error("Weather Service Error:", error.message);
    return null; // Graceful fallback
  }
};

const getGoogleWeatherForecast = async (lat, lon) => {
   // Placeholder for Google integrations
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

  console.warn("Weather API not configured properly");

  // SAFE FALLBACK (NEVER RETURN NULL)
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
