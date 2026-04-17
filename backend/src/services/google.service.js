const stringSimilarity = require('string-similarity');
const PlaceCache = require('../models/placeCache.model');

const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/* BASIC GOOGLE TEXT SEARCH */

const searchGooglePlacesText = async (textQuery, lat, lon) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return [];

  const url = `https://places.googleapis.com/v1/places:searchText`;

  try {
    await delay(100);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask':
          'places.id,places.displayName,places.rating,places.userRatingCount,places.regularOpeningHours,places.photos,places.location,places.primaryType'
      },
      body: JSON.stringify({
        textQuery,
        locationBias: {
          circle: {
            center: { latitude: lat, longitude: lon },
            radius: 10000.0
          }
        }
      })
    });

    if (!response.ok) return [];

    const data = await response.json();
    const places = data.places || [];

    return places.map(p => {
      let photoUrls = [];

      if (p.photos?.length) {
        photoUrls = p.photos.slice(0, 1).map(photo =>
          `https://places.googleapis.com/v1/${photo.name}/media?maxHeightPx=400&maxWidthPx=400&key=${apiKey}`
        );
      }

      return {
        originalName: p.displayName?.text,
        googlePlaceId: p.id,
        displayName: p.displayName?.text,
        rating: p.rating || 0,
        userRatingsTotal: p.userRatingCount || 0,
        regularOpeningHours: p.regularOpeningHours || null,
        photos: photoUrls,
        location: {
          lat: p.location?.latitude,
          lng: p.location?.longitude
        },
        rawCategory: p.primaryType || 'point_of_interest'
      };
    });

  } catch {
    return [];
  }
};

/* CURATED MULTI-QUERY SEARCH (KEY UPGRADE) */

const searchCuratedPlaces = async (destination, lat, lon) => {
  const queries = [
    `top tourist attractions in ${destination}`,
    `famous landmarks in ${destination}`,
    `must visit places in ${destination}`,
    `best beaches in ${destination}`,
    `sunset points in ${destination}`,
    `popular shopping streets in ${destination}`,
    `local markets in ${destination}`
  ];

  let allResults = [];

  for (const q of queries) {
    const results = await searchGooglePlacesText(q, lat, lon);
    allResults.push(...results);
  }

  // Deduplicate
  const unique = [];
  const seen = new Set();

  for (let p of allResults) {
    const key = p.displayName?.toLowerCase();
    if (key && !seen.has(key)) {
      seen.add(key);
      unique.push(p);
    }
  }

  return unique;
};

/* QUALITY FILTER */

const filterHighQualityPlaces = (places) => {
  return places.filter(p =>
    p.rating >= 4.2 &&
    p.userRatingsTotal >= 200
  );
};

/* ENRICH GEOAPIFY WITH GOOGLE */

const enrichPlaceWithGoogle = async (geoapifyPlace) => {
  const { name, lat, lon, place_id } = geoapifyPlace;

  try {
    const cached = await PlaceCache.findOne({ geoapifyPlaceId: place_id });
    if (cached) return cached;
  } catch {}

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;

  try {
    const results = await searchGooglePlacesText(name, lat, lon);
    if (!results.length) return null;

    let bestMatch = null;
    let highest = 0;

    for (let p of results) {
      const similarity = stringSimilarity.compareTwoStrings(
        name.toLowerCase(),
        (p.displayName || '').toLowerCase()
      );

      const dist = getDistanceKm(lat, lon, p.location.lat, p.location.lng);
      if (dist > 5) continue;

      const score = similarity * 0.7 + (1 - dist / 5) * 0.3;

      if (score > highest) {
        highest = score;
        bestMatch = p;
      }
    }

    if (!bestMatch || highest < 0.4) return null;

    const enriched = {
      originalName: name,
      geoapifyPlaceId: place_id,
      googlePlaceId: bestMatch.googlePlaceId,
      displayName: bestMatch.displayName,
      rating: bestMatch.rating,
      userRatingsTotal: bestMatch.userRatingsTotal,
      regularOpeningHours: bestMatch.regularOpeningHours,
      photos: bestMatch.photos,
      location: bestMatch.location
    };

    try {
      await new PlaceCache(enriched).save();
    } catch {}

    return enriched;

  } catch {
    return null;
  }
};

/*  DISTANCE MATRIX */

const getDistanceMatrix = async (origins, destinations) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!origins.length || !destinations.length || !apiKey) return null;

  const originStr = origins.map(o => `${o.lat},${o.lng}`).join('|');
  const destStr = destinations.map(o => `${o.lat},${o.lng}`).join('|');

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originStr}&destinations=${destStr}&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "OK") return null;

    return data.rows.map(row =>
      row.elements.map(el => ({
        durationSecs: el.status === "OK" ? el.duration.value : 0,
        distanceMeters: el.status === "OK" ? el.distance.value : 0
      }))
    );

  } catch {
    return null;
  }
};

/* EXPORTS */


module.exports = { 
  searchGooglePlacesText, 
  searchCuratedPlaces,
  filterHighQualityPlaces,
  enrichPlaceWithGoogle, 
  getDistanceMatrix
}; 