const restaurantModel = require("../model/restaurantModel");
const reviewModel = require("../model/reviewModel");

exports.getRecommendations = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get cuisines & price ranges user likes from reviews
        const userReviews = await reviewModel.find({ user: userId }).populate('restaurant');
        const preferredCuisines = [...new Set(userReviews.map(r => r.restaurant.cuisine))];
        const preferredPriceRanges = [...new Set(userReviews.map(r => r.restaurant.priceRange))];

        // Find similar restaurants
        const recommendedRestaurants = await restaurantModel.find({
            cuisine: { $in: preferredCuisines },
            priceRange: { $in: preferredPriceRanges }
        }).limit(10);

        res.status(200).json({ success: true, recommendations: recommendedRestaurants });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getTrendingRestaurants = async (req, res) => {
    try {
        const trending = await restaurantModel.find()
            .sort({ rating: -1, createdAt: -1 })
            .limit(5);

        res.status(200).json({ success: true, trending });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
