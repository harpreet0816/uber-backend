const userModel = require("../Models/user.model.js");
const blacklistTokenModel = require('../Models/blacklistToken.model.js')
const userService = require("../services/user.service.js");
const { validationResult } = require("express-validator");

module.exports.registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    const isUserAlreadyExist = await userModel.findOne({ email });

    if (isUserAlreadyExist) {
      return res.status(400).json({ message: "User already exist" });
    }

    const hashedPassword = await userModel.hashPassword(password);
    const user = await userService.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
    });
    
    const token = user.generateAuthToken();

    // Creating a shallow copy of the user's raw document data (_doc) from Mongoose,
    // to exclude additional metadata or methods. This allows us to safely modify
    // or remove sensitive fields (e.g., password) before sending the response,
    // without affecting the original object.

    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;

    res.status(201).json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = user.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.getUserProfile = async (req, res, next) => {
  try {
    res.status(200).json(req.user)
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.logoutUser = async (req, res, next) => {
  try {
    res.clearCookie('token');

    const token = req.cookies.token || req.headers.authorization.split(" ")[1];

    await blacklistTokenModel.create({ token });

    res.status(200).json({ message: "Logged out" })
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
