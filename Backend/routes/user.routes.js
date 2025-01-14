const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const userController = require('../controllers/user.controller.js')
const authMiddleware = require('../middlewares/auth.middleware.js')

router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min: 3}).withMessage('First name must be at least 3 character long'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 charater long')
], userController.registerUser
)

router.post('/login', [
    body('email').isEmail().withMessage('invalid Email'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 charater long')
],
 userController.loginUser
)

router.get('/profile', authMiddleware.authUser,
 userController.getUserProfile
)

router.post('/logout', authMiddleware.authUser,
 userController.logoutUser
)
module.exports = router;