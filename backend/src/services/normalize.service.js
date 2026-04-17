/**
 * Normalize and enrich category data to standardize across the application.
 */

const CATEGORY_MAP = {
  'tourism.attraction': 'activity',
  'tourism.museum': 'cultural',
  'tourism.sights': 'landmark',

  'catering.restaurant': 'food',
  'catering.cafe': 'food',

  'entertainment': 'activity',
  'leisure': 'leisure',
  'leisure.park': 'park',

  'commercial.shopping_mall': 'shopping',

  'natural.water': 'scenic',
  'natural.beach': 'scenic',

  'natural_feature': 'scenic',
  'beach': 'scenic',
  'waterfront': 'scenic',
  'viewpoint': 'scenic',
  'scenic': 'scenic',

  'park': 'park',
  'museum': 'cultural',
  'tourist_attraction': 'activity',
  'landmark': 'landmark',

  'point_of_interest': 'activity',
  'restaurant': 'food',
  'cafe': 'food',
  'shopping_mall': 'shopping'
};

const getNormalizedCategory = (rawCategories = [], placeName = "") => {
  if (!Array.isArray(rawCategories)) rawCategories = [rawCategories];

  const lowerCats = rawCategories.map(c => (c || "").toLowerCase());
  const name = (placeName || "").toLowerCase();

  // Smart fallback
  if (
    name.includes("beach") ||
    name.includes("sea") ||
    name.includes("drive") ||
    name.includes("view") ||
    lowerCats.some(c => c.includes('beach') || c.includes('water') || c.includes('view'))
  ) {
    return 'scenic';
  }

  for (let cat of lowerCats) {
    for (let key of Object.keys(CATEGORY_MAP)) {
      if (cat.includes(key)) {
        return CATEGORY_MAP[key];
      }
    }
  }

  return 'activity';
};

const getAvgDuration = (normalizedCategory) => {
  switch (normalizedCategory) {
    case 'cultural': return 120;
    case 'landmark': return 90;
    case 'park': return 60;
    case 'scenic': return 60;
    case 'activity': return 120;
    case 'food': return 75;
    case 'shopping': return 120;
    default: return 60;
  }
};

const getWeatherDependency = (normalizedCategory) => {
  const indoor = ['cultural', 'food', 'shopping'];
  return indoor.includes(normalizedCategory) ? 'indoor' : 'outdoor';
};

const getTags = (normalizedCategory, rating) => {
  const tags = [];
  if (rating >= 4.5) tags.push('highly_rated');
  if (['food'].includes(normalizedCategory)) tags.push('dining');
  if (['cultural', 'landmark', 'activity', 'scenic'].includes(normalizedCategory)) tags.push('sightseeing');
  return tags;
};

const normalizePlace = (placeName, rawCategories, rating) => {
  const normalizedCategory = getNormalizedCategory(rawCategories, placeName);
  return {
    normalizedCategory,
    avgVisitDuration: getAvgDuration(normalizedCategory), // in minutes
    weatherDependency: getWeatherDependency(normalizedCategory),
    tags: getTags(normalizedCategory, rating)
  };
};

// ─────────────────────────────────────────────────
// PART 2 & 3 — DYNAMIC SLOT GENERATION
// ─────────────────────────────────────────────────

/**
 * Build a dynamic slot array shaped by weather conditions.
 *
 * @param {object} opts
 * @param {{ hasRain: boolean, isExtremeHeat: boolean, main_weather: string }} opts.weather
 * @param {number} opts.startTimeMins - day start in minutes from midnight (e.g. 480 = 08:00)
 * @param {number} opts.endTimeMins  - day end   in minutes from midnight (e.g. 1260 = 21:00)
 * @returns {Array<{ type: string, category: string[], durationHint: number, time: [string, string] }>}
 */
const buildSlotsForDay = ({ weather = {}, startTimeMins = 480, endTimeMins = 1260 }) => {
  const { hasRain = false, isExtremeHeat = false } = weather;

  const fmt = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  // Helper to build a slot with explicit start/duration
  const slot = (type, category, durationHint, startMins) => ({
    type,
    category: Array.isArray(category) ? category : [category],
    durationHint,
    time: [fmt(startMins), fmt(startMins + durationHint)]
  });

  // ── CASE 2: RAIN ──────────────────────────────
  if (hasRain) {
    // Fully indoor day — no scenic, no outdoor-heavy slots
    const s = startTimeMins;
    return [
      slot('breakfast',         ['food'],                         60,  s),
      slot('cultural',          ['cultural', 'museum'],           120, s + 60),
      slot('indoor_activity',   ['activity', 'cultural'],         90,  s + 60 + 120 + 15),
      slot('lunch',             ['food'],                         75,  s + 60 + 120 + 15 + 90 + 15),
      slot('shopping',          ['shopping'],                     120, s + 60 + 120 + 15 + 90 + 15 + 75 + 15),
      slot('indoor_experience', ['cultural', 'activity'],         90,  s + 60 + 120 + 15 + 90 + 15 + 75 + 15 + 120 + 15),
      slot('dinner',            ['food'],                         90,  s + 60 + 120 + 15 + 90 + 15 + 75 + 15 + 120 + 15 + 90 + 15),
    ].filter(sl => {
      const [, endStr] = sl.time;
      const [eh, em] = endStr.split(':').map(Number);
      return (eh * 60 + em) <= endTimeMins;
    });
  }

  // ── CASE 3: EXTREME HEAT ─────────────────────
  if (isExtremeHeat) {
    // Landmark early, midday indoor, scenic only evening
    const s = startTimeMins; // e.g. 480 = 08:00
    return [
      slot('breakfast',        ['food'],               60,  s),
      slot('landmark',         ['landmark'],            90,  s + 60),           // early outdoor
      slot('indoor_cultural',  ['cultural', 'museum'],  120, s + 60 + 90 + 15), // midday indoor
      slot('lunch',            ['food'],                75,  s + 60 + 90 + 15 + 120 + 15),
      slot('indoor_activity',  ['activity', 'shopping'],120, s + 60 + 90 + 15 + 120 + 15 + 75 + 15),
      slot('scenic',           ['scenic'],              60,  s + 60 + 90 + 15 + 120 + 15 + 75 + 15 + 120 + 30), // evening only
      slot('dinner',           ['food'],                90,  s + 60 + 90 + 15 + 120 + 15 + 75 + 15 + 120 + 30 + 60 + 15),
    ].filter(sl => {
      const [, endStr] = sl.time;
      const [eh, em] = endStr.split(':').map(Number);
      return (eh * 60 + em) <= endTimeMins;
    });
  }

  // ── CASE 1: CLEAR / NORMAL ───────────────────
  const s = startTimeMins;
  return [
    slot('breakfast', ['food'],              60,  s),
    slot('landmark',  ['landmark'],          90,  s + 60),
    slot('cultural',  ['cultural'],          120, s + 60 + 90 + 15),
    slot('lunch',     ['food'],              75,  s + 60 + 90 + 15 + 120 + 15),
    slot('activity',  ['activity', 'park'],  120, s + 60 + 90 + 15 + 120 + 15 + 75 + 15),
    slot('scenic',    ['scenic'],            60,  s + 60 + 90 + 15 + 120 + 15 + 75 + 15 + 120 + 15),
    slot('dinner',    ['food'],              90,  s + 60 + 90 + 15 + 120 + 15 + 75 + 15 + 120 + 15 + 60 + 15),
  ].filter(sl => {
    const [, endStr] = sl.time;
    const [eh, em] = endStr.split(':').map(Number);
    return (eh * 60 + em) <= endTimeMins;
  });
};

// ─────────────────────────────────────────────────
// PART 4 — EXPERIENCE BALANCING
// ─────────────────────────────────────────────────

const experienceLimits = {
  food:     3,
  landmark: 2,
  cultural: 2,
  scenic:   1,
  shopping: 2
};

/**
 * Apply experience-balance penalty to a dynamic score.
 * @param {string} category
 * @param {object} experienceCount  - running tally { food: n, landmark: n, ... }
 * @param {number} baseScore
 * @returns {number}
 */
const applyExperienceBalance = (category, experienceCount, baseScore) => {
  const limit = experienceLimits[category];
  if (limit !== undefined && (experienceCount[category] || 0) >= limit) {
    return baseScore - 30;
  }
  return baseScore;
};

// ─────────────────────────────────────────────────
// PART 5 — WEATHER PRIORITY BOOST
// ─────────────────────────────────────────────────

/**
 * Apply weather-driven score adjustments.
 * @param {string} weatherDependency  - 'indoor' | 'outdoor'
 * @param {{ hasRain: boolean, isExtremeHeat: boolean }} weather
 * @param {number} score
 * @param {boolean} [isMidday=false]  - true when slot falls between 11:00–15:00
 * @returns {number}
 */
const applyWeatherBoost = (weatherDependency, weather, score, isMidday = false) => {
  const { hasRain = false, isExtremeHeat = false } = weather;

  if (hasRain) {
    if (weatherDependency === 'indoor')  return score + 25;
    if (weatherDependency === 'outdoor') return score - 60;
  }

  if (isExtremeHeat) {
    if (weatherDependency === 'outdoor' && isMidday) return score - 40;
    if (weatherDependency === 'indoor')               return score + 15;
  }

  return score;
};

// ─────────────────────────────────────────────────
// PART 6 — TRAVEL-AWARE SCORE ADJUSTMENT
// ─────────────────────────────────────────────────

/**
 * Adjust score based on travel time from previous place.
 * @param {number} travelMins
 * @param {number} score
 * @returns {number}
 */
const applyTravelPenalty = (travelMins, score) => {
  if (travelMins > 40) return score - 25;
  if (travelMins < 15) return score + 10;
  return score;
};

// ─────────────────────────────────────────────────
// PART 7 — GUARANTEE / mustInclude SYSTEM
// ─────────────────────────────────────────────────

/**
 * Returns mandatory category list based on weather.
 * @param {{ hasRain: boolean, isExtremeHeat: boolean }} weather
 * @returns {string[]}
 */
const getMustInclude = (weather = {}) => {
  const { hasRain = false } = weather;
  if (hasRain) return ['landmark', 'cultural'];
  return ['landmark', 'cultural', 'scenic'];
};

module.exports = {
  normalizePlace,
  getNormalizedCategory,
  getAvgDuration,
  getWeatherDependency,

  // New dynamic planning exports
  buildSlotsForDay,
  experienceLimits,
  applyExperienceBalance,
  applyWeatherBoost,
  applyTravelPenalty,
  getMustInclude
};
