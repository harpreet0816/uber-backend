const { validationResult } = require("express-validator");
const captainModel = require("../Models/captain.model.js");
const captainService = require("../services/captain.service.js");


module.exports.registerCaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password, vehicle, } = req.body;

        const isCaptainAlreadyExist = await captainModel.findOne({ email });

        if (isCaptainAlreadyExist) {
            return res.status(400).json({ message: "Captain already exist" });
        }

        const hashedPassword = await captainModel.hashPassword(password);
        const captain = await captainService.createCaptain({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword,
            color: vehicle.color,
            plate: vehicle.plate,
            capacity: vehicle.capacity,
            vehicleType: vehicle.vehicleType,
        });

        const token = captain.generateAuthToken();

        // Creating a shallow copy of the user's raw document data (_doc) from Mongoose,
        // to exclude additional metadata or methods. This allows us to safely modify
        // or remove sensitive fields (e.g., password) before sending the response,
        // without affecting the original object.

        const userWithoutPassword = { ...captain._doc };
        delete userWithoutPassword.password;

        res.status(201).json({ token, captain: userWithoutPassword });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};