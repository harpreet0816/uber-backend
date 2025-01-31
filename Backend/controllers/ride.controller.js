const rideService = require("../services/ride.service");
const mapService = require("../services/maps.service");
const { validationResult } = require("express-validator");
const rideModel = require("../models/ride.model.js");
const { sendMessageToSocketId } = require("../socket.js");

module.exports.createRide = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, vehicleType } = req.body;

  try {
    const ride = await rideService.createRide({
      user: req.user._id,
      pickup: pickup.split(":")[1],
      fullPickup: pickup,
      fullDestination: destination,
      destination: destination.split(":")[1],
      vehicleType,
    });
    res.status(200).json(ride);

    // const pickupCoordinates = await mapService.getAddressCoordinate(pickup.split(":")[0]);

    // const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);
    // Process the rest asynchronously
    (async () => {
      try {
        const captainsInRadius = await mapService.getCaptainsInTheRadius(
          pickup.split(":")[1].split(",")[0], // Latitude
          pickup.split(":")[1].split(",")[1], // Longitude
          25
        );

        const rideWithUser = await rideModel
          .findOne({ _id: ride._id })
          .populate("user");

        captainsInRadius.forEach((captain) => {
          sendMessageToSocketId(captain.socketId, {
            event: "new-ride",
            data: rideWithUser,
          });
        });
      } catch (error) {
        console.error("Error in background processing:", error.message);
      }
    })();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getFare = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.body;

  try {
    const {fare} = await rideService.getFare({
      pickup: pickup.split(":")[1],
      destination: destination.split(":")[1],
    });
    return res.status(200).json(fare);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.acceptRide = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId} = req.body;

  try {
    const ride = await rideService.acceptRide({
      rideId,
      captain: req.captain,
    });

    sendMessageToSocketId(ride.user.socketId, {event: "ride-confirmed", data: ride});
    
    const rideCopy = JSON.parse(JSON.stringify(ride));

    delete rideCopy.otp;

    return res.status(200).json(rideCopy);
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: error.message });
  }
};

module.exports.startRide = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, otp} = req.body;

  try {

    const ride = await rideService.startRide({
      rideId,
      otp,
      captain: req.captain,
    });
   
    sendMessageToSocketId(ride.user.socketId, {event: "ride-started", data: ride});

    return res.status(200).json(ride);
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: error.message });
  }
};

module.exports.endRide = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, otp} = req.body;

  try {

    const ride = await rideService.endRide({
      rideId,
      captain: req.captain,
    });
   
    sendMessageToSocketId(ride.user.socketId, {event: "end-ride", data: ride});

    return res.status(200).json(ride);
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: error.message });
  }
};
