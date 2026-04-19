const getRoutes = async (places) => {
  if (!Array.isArray(places)) return [];

  return places.map((place, index) => ({
    from: index === 0 ? "Start" : places[index - 1].name,
    to: place.name,
    distance: place.distance
  }));
};

module.exports = { getRoutes };   