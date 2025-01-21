const rideModel = require("../Models/ride.model.js");
const mapService = require("./maps.service.js");

async function getFare (pickup, destination) {
    if(!pickup || !destination){
        throw new Error("Pickup and destination are reqruired");
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination);

    const baseFare = {
        auto: 30, 
        car: 50, 
        moto: 20
    }

    const perKmRate = {
        auto: 10, 
        car: 15, 
        moto: 8
    }

    const perMinuteRate = {
        auto: 2, 
        car: 3, 
        moto: 1.5
    }

    const fare = {
        "auto": baseFare.auto + ((distanceTime.distance.value/1000) * perKmRate.auto) + ((distanceTime.duration.value/60) * perMinuteRate.auto),

        "car": baseFare.car + ((distanceTime.distance.value/1000) * perKmRate.car) + ((distanceTime.duration.value/60) * perMinuteRate.car),

        "moto": baseFare.moto + ((distanceTime.distance.value/1000) * perKmRate.moto) + ((distanceTime.duration.value/60) * perMinuteRate.moto),
    }

    return fare;
}

function getOtp(num) {
    const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
    return otp;
}

module.exports.createRide = async ({user, pickup, destination, vehicleType}) => {

    if(!user || !pickup || !destination || !vehicleType){
        throw new Error("All feilds are required");
    }

    const fare = await getFare(pickup, destination);

    const ride = await rideModel.create({
        user,
        pickup, 
        destination,
        fare: fare[vehicleType],
        otp: getOtp(6)
    })

    return ride;
};

