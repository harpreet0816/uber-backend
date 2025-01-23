const express = require("express");
const {body} =require("express-validator");
const router = express.Router();
const rideController = require("../controllers/ride.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js"); 

router.post("/create", 
    authMiddleware.authUser,
    body("pickup").isString().isLength({min:3}).withMessage("Invalid pickup address"),
    body("destination").isString().isLength({min:3}).withMessage("Invalid destination address"),
    body("vehicleType").isString().isIn(["auto", "car", "moto"]).withMessage("Invalid vehicleType"),
    rideController.createRide
)

router.post("/get-fare", 
    authMiddleware.authUser,
    body("pickup").isString().isLength({min:3}).withMessage("Invalid pickup address"),
    body("destination").isString().isLength({min:3}).withMessage("Invalid destination address"),
    rideController.getFare
)


module.exports = router;