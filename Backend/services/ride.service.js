const crypto = require('crypto');
const rideModel = require("../Models/ride.model.js");
const mapService = require("./maps.service.js");

async function getFare (pickup, destination) {
    if(!pickup || !destination){
        throw new Error("Pickup and destination are reqruired");
    }

    
    let pickupLatLong, destinationLatLong;
    const googleApiExist =
    process.env.GOOGLE_MAPS_API !== "null" &&
    process.env.GOOGLE_MAPS_API !== "";

    let distanceTime
    if(googleApiExist){
        distanceTime = await mapService.getDistanceTime(pickup, destination);

    }else{
        if (isLatLong(pickup)) {
            pickupLatLong = pickup;
        } else {
            pickupLatLong = await getLatLongFromAddress(pickup); 
            if (!pickupLatLong) {
                throw new Error("Invalid pickup address");
            }
        }
    
        // Check if destination is in lat-long, if not, fetch lat-long
        if (isLatLong(destination)) {
            destinationLatLong = destination;
        } else {
            destinationLatLong = await getLatLongFromAddress(destination); 
            if (!destinationLatLong) {
                throw new Error("Invalid destination address");
            }
        }

        distanceTime = await mapService.getDistanceTime(pickupLatLong, destinationLatLong);
    }



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
    // const min = Math.pow(10, num - 1);
    //const max = Math.pow(10, num);
    //const otp = Math.floor(Math.random() * (max - min) + min);
    //return otp.toString();
    const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
    return otp;
}


const isLatLong = (value) => {
    const latLongPattern = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
    return latLongPattern.test(value);
};

const getLatLongFromAddress = async (address) => {
    try {
        const result = await mapService.getAddressCoordinate(address);
        return `${result.ltd},${result.lng}`
    } catch (error) {
        throw new Error(error);
    }
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

