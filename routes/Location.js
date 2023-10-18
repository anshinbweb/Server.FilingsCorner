const express = require("express");

const router = express.Router();

const {
  createLocation,
  getLocation,
  listCountry,
  createCountry,
  removeCountry,
  removeAndUpdateCountry,
  updateCountry,
  getCountry,
  listCountryByParams,

  listState,
  listStateByParams,
  createState,
  removeAndUpdateState,
  getState,
  updateState,
  removeState,

  listCity,
  removeCity,
  listCityByParams,
  createCity,
  getCity,
  removeAndUpdateCity,
  updateCity,
  getCountryCode,
  getCountryName,
  listByStatus,
} = require("../controllers/Location");
const catchAsync = require("../utils/catchAsync");

// router.get("/auth/location", catchAsync(getLocation));
// router.post("/auth/location", catchAsync(createLocation));

//location setup ---> country
router.get("/auth/location/country", catchAsync(listCountry));
router.post("/auth/location/countries", catchAsync(listCountryByParams));
router.post("/auth/location/country", catchAsync(createCountry));
router.delete("/auth/location/country/:_id", catchAsync(removeCountry));
router.put("/auth/location/countryupdate/:_id", catchAsync(updateCountry));
router.get("/auth/location/country/:_id", catchAsync(getCountry));

//location setup ---> state
router.get("/auth/location/state", catchAsync(listState));
router.post("/auth/location/states", catchAsync(listStateByParams));
router.delete("/auth/location/state/:_id", catchAsync(removeState));
router.post("/auth/location/state", catchAsync(createState));
// router.put("/auth/location/state/:_id", removeAndUpdateState);
router.put("/auth/location/stateupdate/:_id", catchAsync(updateState));
router.get("/auth/location/state/:_id", catchAsync(getState));

//location setup ---> city
router.get("/auth/location/city", catchAsync(listCity));
router.post("/auth/location/cities", catchAsync(listCityByParams));
router.delete("/auth/location/city/:_id", catchAsync(removeCity));
router.get("/auth/location/city/:_id", catchAsync(getCity));

router.post("/auth/location/city", catchAsync(createCity));
router.put("/auth/location/city/:_id", catchAsync(updateCity));

module.exports = router;