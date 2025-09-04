const reviewModel = require("../model/reviewModel");
const reservationModel = require("../model/reservationModel");

// Helper: get filenames from uploaded files
const getFilenames = (files) => files?.map((f) => f.filename) || [];

const reviewController = {
  // Add review
  addReview: async (req, res) => {
    try {
      const { restaurantId, rating, comment } = req.body;

      // Check if user has a reservation
      const reservationExists = await reservationModel.findOne({
        user: req.user._id,
        restaurant: restaurantId,
      });

      if (!reservationExists) {
        return res.status(403).json({
          message: "You can only review restaurants you have visited.",
        });
      }

      // Get filenames from uploaded files
      const photos = getFilenames(req.files);

      const review = await reviewModel.create({
        restaurant: restaurantId,
        user: req.user._id,
        rating,
        comment,
        photos,
      });

      res.status(201).json({ success: true, review });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Edit review
  editReview: async (req, res) => {
    try {
      const review = await reviewModel.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!review) return res.status(404).json({ message: "Review not found" });

      // Update fields
      if (req.body.rating) review.rating = req.body.rating;
      if (req.body.comment) review.comment = req.body.comment;

      // If new photos uploaded, append to existing
      const newPhotos = getFilenames(req.files);
      if (newPhotos.length > 0) {
        review.photos = [...review.photos, ...newPhotos];
      }

      await review.save();
      res.json({ success: true, review });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Delete review
  deleteReview: async (req, res) => {
    try {
      const review = await reviewModel.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!review) return res.status(404).json({ message: "Review not found" });

      res.json({ success: true, message: "Review deleted" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Respond to review (owner only)
  respondToReview: async (req, res) => {
    try {
      const review = await reviewModel.findById(req.params.id).populate(
        "restaurant"
      );

      if (!review) return res.status(404).json({ message: "Review not found" });

      if (String(review.restaurant.owner) !== String(req.user._id)) {
        return res.status(403).json({ message: "Not authorized" });
      }

      review.ownerResponse = {
        text: req.body.text,
        respondedAt: new Date(),
      };

      await review.save();
      res.json({ success: true, review });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Get reviews for a restaurant
  getRestaurantReviews: async (req, res) => {
    try {
      const { restaurantId } = req.params;
      const reviews = await reviewModel
        .find({ restaurant: restaurantId })
        .populate("user", "name")
        .sort({ createdAt: -1 });

      res.json({ success: true, reviews });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error fetching reviews" });
    }
  },
};

module.exports = reviewController;