const express = require('express');
const { register, login, getMyProfile, logout, forgetPassword, resetPassword } = require('../controller/authController');
const {body} = require('express-validator');
const { protect } = require('../middleware/auth');

const authRouter = express.Router();

// express-validation
const registerValidation = [
    body('name').notEmpty().withMessage('Name is Required'),
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password').isLength({min : 6}).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['user', 'manager' , 'admin']).withMessage('Invalid role')
]

const loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password').isLength({min : 6}).withMessage('Password must be at least 6 characters'),
]

authRouter.post('/register',registerValidation, register);
authRouter.post('/login',loginValidation, login);
authRouter.get('/myprofile',protect, getMyProfile);
authRouter.get('/logout',protect, logout);

authRouter.post('/forgetpassword' , forgetPassword );
authRouter.post('/resetpassword/:token' ,  resetPassword);

module.exports = authRouter;