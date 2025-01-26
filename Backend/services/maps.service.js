const axios = require("axios");

module.exports.getAddressCoordinate = async (address) => {
  const googleApiExist =
    process.env.GOOGLE_MAPS_API !== "null" &&
    process.env.GOOGLE_MAPS_API !== "";

  const apiKey = googleApiExist
    ? process.env.GOOGLE_MAPS_API
    : process.env.MYLOCATIONIQ_TOKEN;

  const url = googleApiExist
    ? `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`
    : `https://api.locationiq.com/v1/autocomplete?key=${apiKey}&q=${encodeURIComponent(
        address
      )}&limit=5&dedupe=1&countrycodes=IN`;

  try {
    if (googleApiExist) {
      console.log("inn");
      const response = await axios.get(url);
      if (response.data.status === "OK") {
        const location = response.data.results[0].geometry.location;
        return {
          ltd: location.lat,
          lng: location.lng,
        };
      } else {
        throw new Error("Unable to fetch coordinates");
      }
    } else {
      const response = await axios.get(url);
      if (response.statusText === "OK") {
        const location = response.data[0];
        return {
          ltd: location.lat,
          lng: location.lon,
        };
      } else {
        throw new Error("Unable to fetch coordinates");
      }
    }
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }

  const googleApiExist =
    process.env.GOOGLE_MAPS_API !== "null" &&
    process.env.GOOGLE_MAPS_API !== "";

  const apiKey = googleApiExist
    ? process.env.GOOGLE_MAPS_API
    : process.env.OPENROUTESERVICE_TOKEN;
  const url =
    googleApiExist &&
    `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
      origin
    )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {
    if (googleApiExist) {
      const response = await axios.get(url);
      if (response.data.status === "OK") {
        if (response.data.rows[0].elements[0].status === "Zero_RESULTS") {
          throw new Error("No routes found");
        }

        return response.data.rows[0].elements[0];
      } else {
        throw new Error("Unable to fetch distance and time");
      }
    } else {
      // const origin = "8.681495,49.41461";
      // const destination = "8.687872,49.420318";
      const modes = ["driving-car"]; //, 'foot-walking' , 'cycling-regular'

      //   pass apiKey to use open source
      const results = await Promise.all(
        modes.map((mode) =>
          module.exports.fetchTimeAndDistanceUsingOpenRouteService(
            mode,
            origin,
            destination
          )
        )
      );
      
      return results.length === 1 ? results[0] : results;
    }
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("Query is required");
  }

  const googleApiExist =
    process.env.GOOGLE_MAPS_API !== "null" &&
    process.env.GOOGLE_MAPS_API !== "";

  const apiKey = googleApiExist
    ? process.env.GOOGLE_MAPS_API
    : process.env.MYLOCATIONIQ_TOKEN;
  const url = googleApiExist
    ? `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&key=${apiKey}`
    : `https://api.locationiq.com/v1/autocomplete?key=${apiKey}&q={${input}}&limit=5&dedupe=1&countrycodes=IN`;

  try {
    if (googleApiExist) {
      const response = await axios.get(url);
      if (response.data.status === "OK") {
        return response.data.predications;
      } else {
        throw new Error("Unable to fetch suggestions");
      }
    } else {
      const response = await axios.get(url);
      if (response.statusText === "OK") {
        return response.data;
      } else {
        throw new Error("Unable to fetch suggestions");
      }
    }
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
  // radius in km
  const captains = await captainModel.find({
      location: {
          $geoWithin: {
              $centerSphere: [ [ ltd, lng ], radius / 6371 ]
          }
      }
  });

  return captains;
}

module.exports.fetchTimeAndDistanceUsingOpenRouteService = async (
  mode,
  origin,
  destination,
  apiKey
) => {
  if (apiKey) {
    const orsUrl = `https://api.openrouteservice.org/v2/matrix/${mode}`;
    const response = await axios.post(
      orsUrl,
      {
        locations: [
          origin.split(",").map(Number),
          destination.split(",").map(Number),
        ],
        metrics: ["distance", "duration"],
      },
      {
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    const durations = response.data.durations[0][1]; // Time in seconds
    const distances = response.data.distances[0][1]; // Distance in meters
    return {
      mode,
      time: (durations / 60).toFixed(2), // Convert to minutes
      distance: (distances / 1000).toFixed(2), // Convert to kilometers
    };
  } else {
    // Radius of the Earth in kilometers
    // const R = 6371;
    const R = 6371000;
    const [lat1, lon1] = origin.split(",").map(Number);
    const [lat2, lon2] = destination.split(",").map(Number);
    // Convert latitude and longitude from degrees to radians
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    // Haversine formula to calculate the distance between two coordinates
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distance in kilometers
    const distance = R * c;

    let time;
    if (R === 6371000) {
      // If the radius is in meters, calculate time in seconds (assume speed in m/s)
      const averageSpeedInMetersPerSecond = 13.89; 
      time = distance / averageSpeedInMetersPerSecond;
      return {
        distance: {value: distance.toFixed(2)},
        duration: {value: time.toFixed(2)},
      };
    } else if (R === 6371) {
      // If the radius is in kilometers, calculate time in minutes (assume speed in km/h)
      const averageSpeedInKilometersPerHour = 50; 
      const timeInHours = distance / averageSpeedInKilometersPerHour; 
      time = timeInHours * 60;
      return {
        distance: {value: distance.toFixed(2)},
        duration: {value: time.toFixed(2)},
      };
    }
  }
};
