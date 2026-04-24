const { getDetailedWeatherForecast } = require('../services/weather.service');
const { enrichPlaceWithGoogle, searchGooglePlacesText, getDistanceMatrix } = require('../services/google.service');
const { normalizePlace } = require('../services/normalize.service');
const stringSimilarity = require('string-similarity');
const ItineraryHistory = require('../models/itineraryHistory.model');
  
// ─── Constants ────────────────────────────────────────────────────────────────
const DEFAULT_START_TIME_MINS = 9 * 60;  // 09:00
const DEFAULT_END_TIME_MINS = 21 * 60; // 21:00
const BUFFER_MINS = 15;
const MIN_DAY_START = 9 * 60; // hard floor: nothing before 09:00

// ─── Time Helpers ─────────────────────────────────────────────────────────────
function normalizeDate(dateStr) {
  if (!dateStr) return null;
  if (dateStr.includes('/')) {
    const [day, month, yearRaw] = dateStr.split('/');
    const year = yearRaw.length === 2 ? `20${yearRaw}` : yearRaw;
    return `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`;
  }
  return dateStr;
}

const timeToMins = (timeStr) => {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

const minsToTime = (mins) => {
  const safeMins = Math.max(mins, MIN_DAY_START); // hard clamp — never before 09:00
  const h = Math.floor(safeMins / 60) % 24;
  const m = safeMins % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

// ─── Opening Hours ─────────────────────────────────────────────────────────────
const checkOpeningHours = (place, arrivalMins, departureMins, dayOfWeekIndex = 0) => {
  const hours = place.regularOpeningHours;
  if (!hours || !hours.periods) return true;

  const dayPeriod = hours.periods.find(p => p.open?.day === dayOfWeekIndex);
  if (!dayPeriod) return false;

  const openTime = dayPeriod.open?.time;
  const closeTime = dayPeriod.close?.time;
  if (!openTime) return true;

  const openMins = parseInt(openTime.slice(0, 2)) * 60 + parseInt(openTime.slice(2, 4));
  let closeMins = closeTime
    ? parseInt(closeTime.slice(0, 2)) * 60 + parseInt(closeTime.slice(2, 4))
    : 24 * 60;
  if (closeMins <= openMins) closeMins += 24 * 60;

  return arrivalMins >= openMins && departureMins <= closeMins;
};

// ─── Scoring Helpers ──────────────────────────────────────────────────────────
const getFoodImportanceBoost = (p) => {
  let boost = 0;
  const rating = p.rating || 0;
  const reviews = p.userRatingsTotal || 0;
  const name = (p.displayName || '').toLowerCase();

  if (reviews > 1000) boost += 10;
  else if (reviews > 500) boost += 6;
  else if (reviews > 200) boost += 3;

  if (rating >= 4.6) boost += 8;
  else if (rating >= 4.4) boost += 5;

  if (name.includes('restaurant')) boost += 5; 
  if (name.includes('cafe') && reviews < 300) boost -= 8;
  if (reviews < 100) boost -= 5;

  return boost;
};

const getSimplifiedReason = (category) => {
  if (category === 'landmark') return 'Iconic spot best visited early';
  if (category === 'scenic') return 'Perfect place to relax with evening views';
  if (category === 'food') return 'Popular local dining spot';
  if (category === 'cultural') return 'Immersive historic and cultural highlight';
  if (category === 'shopping') return 'Vibrant local market and shopping experience';
  if (category === 'activity') return 'Engaging local dynamic activity';
  return 'Noteworthy local spot';
};

// ─── Embeddings ───────────────────────────────────────────────────────────────
const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  let dotProduct = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

const generateEmbedding = async (text) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ input: text, model: 'text-embedding-3-small' })
      });
      if (response.ok) {
        const data = await response.json();
        return data.data[0].embedding;
      }
    } catch (e) { console.warn('Embedding API error, falling back locally.'); }
  }

  // Local deterministic fallback
  const vector = new Array(1536).fill(0);
  const normalized = (text || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  for (let i = 0; i < normalized.length; i++) {
    const charCode = normalized.charCodeAt(i);
    const index = (charCode * Math.pow(1.1, i % 10)) % 1536;
    vector[Math.floor(index)] += 1;
  }
  let norm = 0;
  for (let i = 0; i < 1536; i++) norm += vector[i] * vector[i];
  const mag = Math.sqrt(norm) || 1;
  for (let i = 0; i < 1536; i++) vector[i] = vector[i] / mag;
  return vector;
};

// ─── Haversine Distance ───────────────────────────────────────────────────────
const getProximityKm = (nodeA, nodeB) => {
  if (!nodeA || !nodeB) return 999;
  const R = 6371;
  const dLat = (nodeB.lat - nodeA.lat) * (Math.PI / 180);
  const dLon = (nodeB.lng - nodeA.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(nodeA.lat * (Math.PI / 180)) *
    Math.cos(nodeB.lat * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ─── Main Controller ──────────────────────────────────────────────────────────
exports.generateItinerary = async (req, res) => {
  try {
    const {
      destination,
      days,
      budget,
      travel_type,
      interests,
      start_time = '09:00',
      end_time = '21:00',
      start_date,
      start_location,
      end_location
    } = req.body;

    if (!destination) {
      return res.status(400).json({ success: false, message: 'Destination is required' });
    }

    const tripDuration = parseInt(days) || 3;
    const activeInterests = Array.isArray(interests) ? interests : (interests ? [interests] : []);
    const startTimeMins   = Math.max(timeToMins(start_time) || DEFAULT_START_TIME_MINS, MIN_DAY_START);
    const endTimeMins     = timeToMins(end_time) || DEFAULT_END_TIME_MINS;
    const safeStartDate   = normalizeDate(start_date);

    // ── Geocode destination ──
    const geoapifyKey = process.env.GEOAPIFY_API_KEY;
const { safeFetch } = require('../utils/safeFetch');
const { ok: geoOk, data: geocodeData } = await safeFetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(destination)}&format=json&apiKey=${geoapifyKey}`);
if (!geoOk || !geocodeData?.results?.length) {
  return res.status(404).json({ success: false, message: 'City not found or geocoding API unavailable.' });
}

    const cityData = geocodeData.results[0];
    const placeId = cityData.place_id;
    const cityLat = cityData.lat;
    const cityLon = cityData.lon;

    // ── Boundary locations (routing reference only — NOT inserted into itinerary) ──
    let sLocData = null;
    let eLocData = null;

    if (start_location) {

     const { data: sData } = await safeFetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(start_location + ' ' + destination)}&format=json&apiKey=${geoapifyKey}`
      ); 

      if (sData.results?.length > 0) {
        const sLocEmbed = await generateEmbedding(`${start_location} starting point`);
        sLocData = {
          displayName: start_location,
          geoapifyPlaceId: sData.results[0].place_id,
          location: { lat: sData.results[0].lat, lng: sData.results[0].lon },
          normData: { avgVisitDuration: 0, normalizedCategory: 'start', tags: [] },
          rating: 0,
          score: 9999,
          isBoundary: true,
          photos: [],
          embedding: sLocEmbed
        };
      }
    }

    if (end_location) {
      const eRes = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(end_location + ' ' + destination)}&format=json&apiKey=${geoapifyKey}`
      );
      const eData = await eRes.json();
      if (eData.results?.length > 0) {
        const eLocEmbed = await generateEmbedding(`${end_location} ending point`);
        eLocData = {
          displayName: end_location,
          geoapifyPlaceId: eData.results[0].place_id,
          location: { lat: eData.results[0].lat, lng: eData.results[0].lon },
          normData: { avgVisitDuration: 0, normalizedCategory: 'end', tags: [] },
          rating: 0,
          score: 9999,
          isBoundary: true,
          photos: [],
          embedding: eLocEmbed
        };
      }
    }

    // ── Weather ──
    let weatherForecast = null;
    if (safeStartDate) weatherForecast = await getDetailedWeatherForecast(cityLat, cityLon);

    // ── Fetch places (parallel) ──
    const placesLimit = Math.max(50, tripDuration * 15);
    const placesUrl = `https://api.geoapify.com/v2/places?categories=tourism.attraction,catering.restaurant,entertainment,leisure,commercial.shopping_mall,natural.beach&filter=place:${placeId}&limit=${placesLimit}&apiKey=${geoapifyKey}`;

    const queryPromises = [
      fetch(placesUrl).then(r => r.json()).catch(() => ({ features: [] })),
      searchGooglePlacesText(`top tourist attractions in ${destination}`, cityLat, cityLon),
      searchGooglePlacesText(`famous landmarks in ${destination}`, cityLat, cityLon),
      searchGooglePlacesText(`best beaches and scenic viewpoints in ${destination}`, cityLat, cityLon),
      searchGooglePlacesText(`famous shopping streets in ${destination}`, cityLat, cityLon),
      searchGooglePlacesText(`iconic food places in ${destination}`, cityLat, cityLon),
      searchGooglePlacesText(`famous restaurants in ${destination}`, cityLat, cityLon),
      searchGooglePlacesText(`best local cuisine in ${destination}`, cityLat, cityLon)
    ];

    const settled = await Promise.allSettled(queryPromises);
    const results = settled.map(r => r.status === 'fulfilled' ? r.value : null);

    const geoapifyRes = results[0];
    const googleTop = results[1] || [];
    const googleLandmarks = results[2] || [];
    const googleScenic = results[3] || [];
    const googleShopping = results[4] || [];
    const googleFood = [...(results[5] || []), ...(results[6] || []), ...(results[7] || [])];

    // ── Merge places ──
    let mergedPlacesMap = new Map();

    const allGoogleResults = [
      ...googleTop, ...googleLandmarks, ...googleScenic, ...googleShopping, ...googleFood
    ];

    allGoogleResults.forEach(gPlace => {
      if (!gPlace.displayName) return;
      const key = gPlace.displayName.toLowerCase();
      if (key.includes('station') || key.includes('airport') || key.includes('metro')) return;

      const cCat = (gPlace.rawCategory || '').toLowerCase();
      const n = key;
      const isFood = cCat.includes('restaurant') || cCat.includes('cafe') ||
        n.includes('restaurant') || n.includes('cafe');

      if (!isFood && (gPlace.rating < 4.2 || gPlace.userRatingsTotal < 200)) return;
      if (isFood && gPlace.rating < 3.8 && gPlace.userRatingsTotal < 100) return;

      if (!mergedPlacesMap.has(key)) {
        mergedPlacesMap.set(key, { ...gPlace, geoapifyPlaceId: gPlace.googlePlaceId });
      }
    });

    const rawFeatures = geoapifyRes.features || [];
    const chunkSize = 10;
    for (let i = 0; i < rawFeatures.length; i += chunkSize) {
      const chunk = rawFeatures.slice(i, i + chunkSize);
      await Promise.all(chunk.map(async (f) => {
        if (!f.properties.name) return;
        const key = f.properties.name.toLowerCase();
        if (key.includes('station') || key.includes('airport') || key.includes('metro')) return;

        if (!mergedPlacesMap.has(key)) {
          const geoPlace = {
            name: f.properties.name,
            lat: f.properties.lat,
            lon: f.properties.lon,
            place_id: f.properties.place_id
          };
          const enriched = await enrichPlaceWithGoogle(geoPlace);
          if (enriched) {
            mergedPlacesMap.set(key, { ...enriched, rawCategory: f.properties.categories?.[0] });
          }
        }
      }));
    }

    let enrichedPlaces = Array.from(mergedPlacesMap.values());

    // ── Deduplicate ──
    let unique = [];
    enrichedPlaces.forEach(p => {
      const pName = (p.displayName || p.originalName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!pName) return;
      let isDuplicate = false;
      for (const u of unique) {
        const uName = (u.displayName || u.originalName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        if (pName.length > 4 && (pName.includes(uName) || uName.includes(pName))) {
          isDuplicate = true; break;
        }
        if (stringSimilarity.compareTwoStrings(pName, uName) > 0.65) {
          isDuplicate = true; break;
        }
      }
      if (!isDuplicate) unique.push(p);
    });
    enrichedPlaces = unique;

    // ── Normalize + Embed ──
    const intentStr = `A trip focused on ${travel_type} with ${budget} budget elements in ${destination}. Highlights including: ${activeInterests.join(', ')}.`;
    const userEmbedding = await generateEmbedding(intentStr);

    const embedPromises = enrichedPlaces.map(async p => {
      const catList = p.rawCategory ? [p.rawCategory] : [];
      p.normData = normalizePlace(p.displayName, catList, p.rating);

      // Fix: ensure scenic detection using name keywords (Part 7)
      const lowerName = (p.displayName || '').toLowerCase();
      if (
        lowerName.includes('beach') ||
        lowerName.includes('sea') ||
        lowerName.includes('drive') ||
        lowerName.includes('view')
      ) {
        p.normData.normalizedCategory = 'scenic';
      }

      const descStr = `${p.displayName} is a ${p.normData.normalizedCategory} rated ${p.rating} with ${p.userRatingsTotal || 0} reviews. Tags: ${p.normData.tags.join(', ')}`;
      p.embedding = await generateEmbedding(descStr);
      return p;
    });
    const embedSettled = await Promise.allSettled(embedPromises);
    let allPlaces = embedSettled
      .filter(r => r.status === 'fulfilled' && r.value != null)
      .map(r => r.value);

    // ── Quality filter ──
    allPlaces = allPlaces.filter(p => {
      if (p.normData.normalizedCategory !== 'food' && p.rating < 4.0 && p.userRatingsTotal < 200) {
        return false;
      }
      return true;
    });

    // ── Score ──
    allPlaces = allPlaces.map(p => {
      p.semanticUserScore = cosineSimilarity(p.embedding, userEmbedding);

      let boost = 0;
      if (p.userRatingsTotal > 2000) boost += 20;

      p.baseEval = (p.rating * 2) + Math.log((p.userRatingsTotal || 0) + 1);

      if (p.normData.normalizedCategory === 'food') {
        p.baseEval += getFoodImportanceBoost(p);
      }

      p.importanceBoost = boost;
      return p;
    });

    // ── Category buckets (balanced pool) ──
    const CATEGORY_BUCKETS = {
      landmark: [], cultural: [], scenic: [],
      food: [], activity: [], shopping: []
    };

    allPlaces.forEach(p => {
      const cat = p.normData.normalizedCategory;
      if (CATEGORY_BUCKETS[cat]) CATEGORY_BUCKETS[cat].push(p);
    });

    Object.keys(CATEGORY_BUCKETS).forEach(cat => {
      CATEGORY_BUCKETS[cat].sort(
        (a, b) => (b.semanticUserScore + b.baseEval) - (a.semanticUserScore + a.baseEval)
      );
    });

    const candidates = [
      ...CATEGORY_BUCKETS.landmark.slice(0, 8),
      ...CATEGORY_BUCKETS.cultural.slice(0, 8),
      ...CATEGORY_BUCKETS.scenic.slice(0, 8),
      ...CATEGORY_BUCKETS.activity.slice(0, 6),
      ...CATEGORY_BUCKETS.shopping.slice(0, 4),
      ...CATEGORY_BUCKETS.food.slice(0, 10)
    ];

    // ═══════════════════════════════════════════════════════════════════════════
    // PART 2: SLOT-BASED PLANNER — slot.time is the ONLY time authority
    // ═══════════════════════════════════════════════════════════════════════════
    const finalItinerary = [];
    const globallyUsed = new Set();
    const mustIncludeBase = ['landmark', 'cultural', 'scenic'];

    // ── Day slot schedule DEFAULT ──
    const DEFAULT_SLOTS = [
      { type: 'breakfast', category: ['food'],                  durationHint: 60,  time: [9  * 60, 10 * 60] },
      { type: 'landmark',  category: ['landmark'],              durationHint: 120, time: [10 * 60, 12 * 60] },
      { type: 'cultural',  category: ['cultural', 'activity'],  durationHint: 120, time: [12 * 60, 14 * 60] },
      { type: 'lunch',     category: ['food'],                  durationHint: 75,  time: [13 * 60, 14 * 60] },
      { type: 'activity',  category: ['activity', 'shopping'],  durationHint: 120, time: [14 * 60, 17 * 60] },
      { type: 'scenic',    category: ['scenic'],                durationHint: 90,  time: [17 * 60, 19 * 60] },
      { type: 'dinner',    category: ['food'],                  durationHint: 90,  time: [19 * 60, 21 * 60] }
    ];

    for (let day = 1; day <= tripDuration; day++) {
      let dailyWeather = null;
      let formattedDate = null;

      if (safeStartDate) {
        const tripDate = new Date(safeStartDate);
        tripDate.setDate(tripDate.getDate() + (day - 1));
        formattedDate = tripDate.toISOString().split('T')[0];
        dailyWeather = weatherForecast?.find(w => w.date === formattedDate) || weatherForecast?.[0] || null;
      }

      const isRain = dailyWeather?.hasRain;
      const isHeat = dailyWeather?.isExtremeHeat;
      const mustInclude = isRain ? ['landmark', 'cultural'] : mustIncludeBase;
      const blockScenic = isRain;

      const currentDayPlan = [];
      let currentMins = startTimeMins; 

      const experiences = {
        landmark: 0, cultural: 0, scenic: 0,
        food: 0, shopping: 0, park: 0, activity: 0
      };

      // ── Weather-Driven Day slot schedule ──
      let slots = JSON.parse(JSON.stringify(DEFAULT_SLOTS));

      if (isRain) {
        console.log(`[DAY ${day} RESTRUCTURING]: Triggered Rain Protocol`);
        // 1. Remove scenic slot completely
        slots = slots.filter(s => s.type !== 'scenic');
        
        // 2. Convert activity to indoor bias
        slots = slots.map(s => {
          if (s.type === 'activity') {
            return { ...s, category: ['shopping', 'cultural'] }; // indoor bias
          }
          return s;
        });
      } else if (isHeat) {
        console.log(`[DAY ${day} RESTRUCTURING]: Triggered Extreme Heat Protocol`);
        // 1. Move landmark to early morning
        const landmarkIndex = slots.findIndex(s => s.type === 'landmark');
        if (landmarkIndex !== -1) {
          const landmarkSlot = slots.splice(landmarkIndex, 1)[0];
          slots.splice(1, 0, landmarkSlot); // insert right after breakfast
        }
        
        // 2. Reduce midday outdoor exposure
        slots = slots.map(s => {
          if (s.type === 'activity' || s.type === 'cultural') {
            return { ...s, category: ['shopping', 'cultural'] }; // indoor bias
          }
          return s;
        });
      }

      for (const slot of slots) {
        const [slotStart, slotEnd] = slot.time;

        if (!['breakfast', 'lunch', 'dinner'].includes(slot.type)) {
        }
        if (['breakfast', 'lunch', 'dinner'].includes(slot.type) && experiences.food >= 3) {
          continue; 
        }

        const available = candidates.filter(p => !globallyUsed.has(p.displayName));

        let slotCandidates = available.filter(p => {
          if (!['breakfast', 'lunch', 'dinner'].includes(slot.type)) {
            if (p.normData.normalizedCategory === 'food') return false;
          }
          if (blockScenic && p.normData.normalizedCategory === 'scenic') return false;
          return slot.category.includes(p.normData.normalizedCategory);
        });

        // 5. HARD FILTER (EXTREME CONDITIONS)
        if (isRain) {
          const indoorOnly = slotCandidates.filter(p => p.normData.weatherDependency === 'indoor');
          if (indoorOnly.length >= 3) {
            slotCandidates = indoorOnly;
          }
        }

        // HYBRID SAFEGUARD: revert to original categories if restrictive
        if (slotCandidates.length === 0) {
           const originalSlot = DEFAULT_SLOTS.find(s => s.type === slot.type);
           if (originalSlot) {
             slotCandidates = available.filter(p => {
               if (!['breakfast', 'lunch', 'dinner'].includes(slot.type)) {
                 if (p.normData.normalizedCategory === 'food') return false;
               }
               return originalSlot.category.includes(p.normData.normalizedCategory);
             });
           }
        }

        const lastNode = currentDayPlan.length > 0
          ? { lat: currentDayPlan[currentDayPlan.length - 1].lat, lng: currentDayPlan[currentDayPlan.length - 1].lng }
          : (sLocData ? { lat: sLocData.location.lat, lng: sLocData.location.lng } : null);

        const lastEmbedding = currentDayPlan.length > 0
          ? currentDayPlan[currentDayPlan.length - 1].embedding
          : null;

        // ── Score candidates ──
        let scoredCandidates = [];

        for (const c of slotCandidates) {
          const travelKm = getProximityKm(lastNode, { lat: c.location.lat, lng: c.location.lng });
          const travelMins = Math.ceil((travelKm / 50) * 60) + 10;

          let dynamicScore = c.baseEval
            + (c.semanticUserScore * 5)
            + c.importanceBoost
            - (travelMins * 0.5);

          if (slot.type === 'scenic') dynamicScore += 25;

          if (lastEmbedding) {
            const semanticCloseness = cosineSimilarity(c.embedding, lastEmbedding);
            if (semanticCloseness > 0.85) dynamicScore -= 20; // penalise repetition
          }

          scoredCandidates.push({ c, score: dynamicScore, travelMins });
        }

        // ── Fallback: relax category if no candidates matched ──
        if (scoredCandidates.length === 0) {
          const fallback = available
            .filter(p => {
              // Still enforce food-slot rule in fallback
              if (!['breakfast', 'lunch', 'dinner'].includes(slot.type)) {
                if (p.normData.normalizedCategory === 'food') return false;
              }
              return true;
            })
            .sort((a, b) => b.baseEval - a.baseEval)[0];

          if (fallback) {
            const travelKm = getProximityKm(lastNode, { lat: fallback.location.lat, lng: fallback.location.lng });
            const travelMins = Math.ceil((travelKm / 50) * 60) + 10;
            scoredCandidates.push({ c: fallback, score: fallback.baseEval, travelMins });
          } else {
            continue; // slot unfillable — skip
          }
        }

        scoredCandidates.sort((a, b) => b.score - a.score);

        // Routing: from top-5 scored, pick nearest to enforce geographic flow
        const topList = scoredCandidates.slice(0, 5).sort((a, b) => a.travelMins - b.travelMins);
        const bestPicked = topList[0];

        const selectedPlace = bestPicked.c;
        const assignedTravel = bestPicked.travelMins;

        // ── Part 2: arrival is computed ONLY from slot.time ──
        const arrMinsRaw = slotStart + 10;
        const arrMins = Math.max(arrMinsRaw, MIN_DAY_START);

        if (arrMins > slotEnd) {
          console.log(`  SKIP: arrival ${minsToTime(arrMins)} exceeds slot end ${minsToTime(slotEnd)}`);
          continue; // place would arrive after slot closes
        }

        const visitDuration = selectedPlace.normData.avgVisitDuration || slot.durationHint;
        const depMins = arrMins + visitDuration;

        // ── Part 2: update currentMins AFTER placement (only for guarantee guard) ──
        currentMins = depMins;

        console.log(`  ARRIVAL: ${minsToTime(arrMins)}  DEPART: ${minsToTime(depMins)}  [${selectedPlace.displayName}]`);

        currentDayPlan.push({
          name: selectedPlace.displayName,
          lat: selectedPlace.location.lat,
          lng: selectedPlace.location.lng,
          rating: selectedPlace.rating,
          image_url: selectedPlace.photos?.[0] || null,
          category: selectedPlace.normData.normalizedCategory,
          importance_level: selectedPlace.importanceBoost >= 30 ? 'MUST_VISIT' : 'GOOD',
          reason: getSimplifiedReason(selectedPlace.normData.normalizedCategory),
          arrival_time: minsToTime(arrMins),
          departure_time: minsToTime(depMins),
          travel_time_from_previous: assignedTravel,
          embedding: selectedPlace.embedding  // stripped after day loop
        });

        globallyUsed.add(selectedPlace.displayName);
        if (experiences[selectedPlace.normData.normalizedCategory] !== undefined) {
          experiences[selectedPlace.normData.normalizedCategory]++;
        }
      }

      // ════════════════════════════════════════════════════════════════════════
      // CATEGORY GUARANTEE — append missing must-haves after slots finish
      // Uses currentMins (last departure) as anchor, NOT slotStart
      // ════════════════════════════════════════════════════════════════════════
      for (const requiredCat of mustInclude) {
        if (experiences[requiredCat] === 0 && currentMins < endTimeMins) {
          const available = candidates.filter(
            p => !globallyUsed.has(p.displayName) && p.normData.normalizedCategory === requiredCat
          );
          if (available.length > 0) {
            available.sort((a, b) => b.baseEval - a.baseEval);
            const forcedPlace = available[0];

            // Part 5: realistic time window — never before 14:00 as a sensible midday floor
            const rawForcedArr = currentMins + 20;
            const forcedArrMins = Math.max(rawForcedArr, 14 * 60, MIN_DAY_START);
            const forcedDepMins = forcedArrMins + (forcedPlace.normData.avgVisitDuration || 60);

            if (forcedArrMins >= endTimeMins) continue; // no room left today

            console.log(`  GUARANTEE [${requiredCat}]: ${forcedPlace.displayName} @ ${minsToTime(forcedArrMins)}`);

            currentDayPlan.push({
              name: forcedPlace.displayName,
              lat: forcedPlace.location.lat,
              lng: forcedPlace.location.lng,
              rating: forcedPlace.rating,
              image_url: forcedPlace.photos?.[0] || null,
              category: forcedPlace.normData.normalizedCategory,
              importance_level: 'GOOD',
              reason: getSimplifiedReason(forcedPlace.normData.normalizedCategory),
              arrival_time: minsToTime(forcedArrMins),
              departure_time: minsToTime(forcedDepMins),
              travel_time_from_previous: 20
            });

            currentMins = forcedDepMins;
            globallyUsed.add(forcedPlace.displayName);
            experiences[requiredCat]++;
          }
        }
      }

      // ── Strip embeddings before sending response ──
      currentDayPlan.forEach(p => { delete p.embedding; });

      // ── Append end location if provided ──
      if (eLocData && currentDayPlan.length > 0) {
        const lastNode = currentDayPlan[currentDayPlan.length - 1];
        const travelKm = getProximityKm(
          { lat: lastNode.lat, lng: lastNode.lng },
          { lat: eLocData.location.lat, lng: eLocData.location.lng }
        );
        const travelMins = Math.ceil((travelKm / 50) * 60) + 10;
        const eArrMins = currentMins + travelMins + BUFFER_MINS;

        currentDayPlan.push({
          name: eLocData.displayName,
          lat: eLocData.location.lat,
          lng: eLocData.location.lng,
          rating: eLocData.rating,
          image_url: null,
          category: 'end',
          importance_level: 'MUST_VISIT',
          reason: 'User selected end location.',
          arrival_time: minsToTime(eArrMins),
          departure_time: minsToTime(eArrMins),
          travel_time_from_previous: travelMins
        });
      }

      finalItinerary.push({ day, weather: dailyWeather, places: currentDayPlan });
    }

    return res.status(200).json({
      success: true,
      data: {
        destination: cityData.name || destination,
        duration: tripDuration,
        travel_type,
        budget,
        itinerary: finalItinerary
      },
      message: 'Generated human-like slot-balanced semantic itinerary.'
    });

} catch (error) {
  console.error('Itinerary Error:', error);
  return res.status(500).json({
    success: false,
    message: error.message || 'Server error generating itinerary.',
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {})
  });
}

}

// ─── Save Itinerary ───────────────────────────────────────────────────────────
exports.saveItinerary = async (req, res) => {
  try {
    const { destination, duration, travel_type, budget, itinerary } = req.body;

    if (!destination || !itinerary) {
      return res.status(400).json({ success: false, message: 'Missing required payload data' });
    }
    
    // Size check
    const payloadSize = Buffer.byteLength(JSON.stringify(req.body));
    if (payloadSize > 5 * 1024 * 1024) { // 5MB limit
      return res.status(413).json({ success: false, message: 'Payload too large' });
    }

    const title = `${duration} Days in ${destination}`;

    const newItinerary = new ItineraryHistory({
      userId: req.user._id,
      title,
      destination,
      duration,
      travelType: travel_type || 'Unknown',
      budget: budget || 'Unknown',
      itineraryData: itinerary
    });

    const saved = await newItinerary.save();
    console.log(`[SYS] Itinerary saved for User:${req.user._id} Dest:${destination}`);

    return res.status(201).json({
      success: true,
      message: 'Itinerary saved successfully',
      data: { id: saved._id }
    });
  } catch (error) {
    console.error('Save Itinerary Error:', error);
    return res.status(500).json({ success: false, message: 'Server error saving itinerary.' });
  }
};

// ─── Get Itinerary History (Paginated) ────────────────────────────────────────
exports.getItineraryHistory = async (req, res) => {
  try {
    let { page = 1, limit = 10, destination } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const query = { userId: req.user._id };
    if (destination) {
      query.destination = { $regex: destination, $options: 'i' };
    }

    const total = await ItineraryHistory.countDocuments(query);
    const itineraries = await ItineraryHistory.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-itineraryData'); // Exclude heavy payload in listing

    return res.status(200).json({
      success: true,
      data: itineraries,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get Itinerary History Error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching history.' });
  }
};

// ─── Get Single Saved Itinerary ───────────────────────────────────────────────
exports.getItineraryById = async (req, res) => {
  try {
    const { id } = req.params;
    const itinerary = await ItineraryHistory.findOne({ _id: id, userId: req.user._id });

    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Itinerary not found' });
    }

    return res.status(200).json({
      success: true,
      data: itinerary
    });
  } catch (error) {
    console.error('Get Itinerary By Id Error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching itinerary.' });
  }
};