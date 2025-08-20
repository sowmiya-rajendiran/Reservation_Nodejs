const reservationModel = require("../model/reservationModel");
const restaurantModel = require("../model/restaurantModel");
const reviewModel = require("../model/reviewModel");

exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await restaurantModel.find();
        res.status(200).json({ success: true, data: restaurants });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewModel.find().populate('restaurant').populate('user');
        res.status(200).json({ success: true, data: reviews });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await reservationModel.find().populate('restaurant').populate('user');
        res.status(200).json({ success: true, data: reservations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteRestaurant = async (req, res) => {
    try {
        await restaurantModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Restaurant deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
