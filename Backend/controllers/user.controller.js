const userModel = require("../Models/user.model.js");
const userService = require("../services/user.service.js");
const { validationResult } = require("express-validator");

module.exports.registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

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
    res.status(400).json({ errors: error.message });
  }
};
