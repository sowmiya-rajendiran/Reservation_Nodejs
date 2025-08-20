const express = require('express');
const { getRecommendations, getTrendingRestaurants } = require('../controller/recommendationController');
const { protect } = require('../middleware/auth');

const recommendationsRouter = express.Router();

recommendationsRouter.get('/personalized', protect , getRecommendations);
recommendationsRouter.get('/trending', getTrendingRestaurants);

module.exports = recommendationsRouter;