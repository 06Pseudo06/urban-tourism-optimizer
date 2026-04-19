const getPlaces = async (city) => {
  if (!city) return [];

  return [
    {
      name: "India Gate",
      location: { lat: 28.6129, lng: 77.2295 },
      distance: 3
    },
    {
      name: "Red Fort",
      location: { lat: 28.6562, lng: 77.2410 },
      distance: 5
    },
    {
      name: "Qutub Minar",
      location: { lat: 28.5244, lng: 77.1855 },
      distance: 8
    }
  ];
};

module.exports = { getPlaces };   