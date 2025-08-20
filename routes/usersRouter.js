const express = require('express');
const { protect } = require('../middleware/auth');
const { getMe, updateProfile, deleteAccount, addFavorite, removeFavorite } = require('../controller/userController');


const userRouter = express.Router();


// Profile routes
userRouter.put('/me', protect, updateProfile);
userRouter.delete('/me', protect , deleteAccount);

// Favorites routes
userRouter.post('/favorites/:restaurantId', protect, addFavorite);
userRouter.delete('/favorites/:restaurantId', protect, removeFavorite);

module.exports = userRouter;
