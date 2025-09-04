const express = require('express');
const { protect, allowRoles } = require('../middleware/auth');
const { addReview, editReview, deleteReview, respondToReview, getRestaurantReviews } = require('../controller/reviewController');
const upload = require('../middleware/upload');

const reviewRouter = express.Router();

// User actions
reviewRouter.post('/', protect, allowRoles(['user']),upload.array("photos", 5), addReview);
reviewRouter.put('/:id', protect, allowRoles(['user']),upload.array("photos", 5), editReview);
reviewRouter.delete('/:id', protect, allowRoles(['user', 'admin']), deleteReview);
reviewRouter.get('/:restaurantId'  , getRestaurantReviews);

// Owner action
reviewRouter.post('/:id/respond', protect, allowRoles(['manager']), respondToReview);

module.exports = reviewRouter;