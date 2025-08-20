const express = require('express');
const { protect, allowRoles } = require('../middleware/auth');
const { addReview, editReview, deleteReview, respondToReview } = require('../controller/reviewController');

const reviewRouter = express.Router();

// User actions
reviewRouter.post('/', protect, allowRoles(['user']), addReview);
reviewRouter.put('/:id', protect, allowRoles(['user']), editReview);
reviewRouter.delete('/:id', protect, allowRoles(['user']), deleteReview);

// Owner action
reviewRouter.post('/:id/respond', protect, allowRoles(['manager']), respondToReview);

module.exports = reviewRouter;