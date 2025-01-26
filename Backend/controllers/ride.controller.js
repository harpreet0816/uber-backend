const rideService = require("../services/ride.service");
const mapService = require("../services/maps.service");
const { validationResult } = require("express-validator");

module.exports.createRide = async (req, res, next ) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {pickup, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide({user: req.user._id, pickup: pickup.split(":")[1], destination: destination.split(":")[1], vehicleType});
        res.status(200).json(ride);

        const pickupCoordinates = await mapService.getAddressCoordinate(pickup.split(":")[0]);

        const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);

        ride.otp = ""

        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

        captainsInRadius.map(captain => {

            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser
            })

        })

    } catch (error) {
        return res.status(500).json({message: error.message})
    }


}

module.exports.getFare = async (req, res, next ) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const { pickup, destination } = req.body;

    try {
        const ride = await rideService.getFare({pickup, destination});
        return res.status(200).json(ride);
    } catch (error) {
        return res.status(500).json({message: error.message})
    }


}