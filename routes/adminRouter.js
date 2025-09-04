const express = require('express');
const { protect, allowRoles } = require('../middleware/auth');
const { getAllRestaurants, getAllReviews, getAllReservations, deleteRestaurant, deleteReview, cancelReservation } = require('../controller/adminController');

const adminRouter = express.Router();

adminRouter.get('/restaurants', protect, allowRoles(['admin']), getAllRestaurants);
adminRouter.get('/reviews', protect, allowRoles(['admin']), getAllReviews);
adminRouter.get('/reservations', protect, allowRoles(['admin']), getAllReservations);

adminRouter.delete('/restaurant/:id', protect, allowRoles(['admin']), deleteRestaurant);
adminRouter.delete("/reviews/:id", protect, allowRoles(['admin']) ,deleteReview);
adminRouter.delete("/reservations/:id", protect, allowRoles(['admin']) , cancelReservation);

module.exports = adminRouter;
