const { getPlaces } = require("./services/places.service");
const { getRoutes } = require("./services/routes.service");

const test = async () => {
  const places = await getPlaces("Delhi");
  console.log("Places:", places);

  const routes = await getRoutes(places);
  console.log("Routes:", routes);
};

test();