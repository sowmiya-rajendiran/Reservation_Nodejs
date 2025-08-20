const reviewModel = require("../model/reviewModel");

const reviewController = {
 
    addReview : async (req, res) => {
        try {
            const { restaurantId, rating, comment, photos } = req.body;

            const review = await reviewModel.create({
                restaurant: restaurantId,
                user: req.user._id,
                rating,
                comment,
                photos
            });

            res.status(201).json(review);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    editReview  : async (req, res) => {
        try {
            const review = await reviewModel.findOne({
                _id: req.params.id,
                user: req.user._id
            });

            if (!review) return res.status(404).json({ message: 'Review not found' });

            review.rating = req.body.rating || review.rating;
            review.comment = req.body.comment || review.comment;
            review.photos = req.body.photos || review.photos;

            await review.save();
            res.json(review);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },


    deleteReview : async (req, res) => {
        try {
            const review = await reviewModel.findOneAndDelete({
                _id: req.params.id,
                user: req.user._id
            });

            if (!review) return res.status(404).json({ message: 'Review not found' });

            res.json({ message: 'Review deleted' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },


    respondToReview : async (req, res) => {
        try {
            const review = await reviewModel.findById(req.params.id)
                .populate('restaurant');

            if (!review) return res.status(404).json({ message: 'Review not found' });

            // Only owner of the restaurant can respond
            if (String(review.restaurant.owner) !== String(req.user._id)) {
                return res.status(403).json({ message: 'Not authorized' });
            }

            review.ownerResponse = {
                text: req.body.text,
                respondedAt: new Date()
            };

            await review.save();
            res.json(review);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }


}

module.exports = reviewController;