const { default: mongoose } = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'Review must be linked to a user']
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurants',
        required: [true, 'Review must be linked to a restaurant']
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
        required: [true, 'Rating is required']
    },
    comment: {
        type: String,
        trim: true,
        maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    photos: [String],
    ownerReply: {
        text: {
            type: String,
            trim: true,
            maxlength: [300, 'Reply cannot exceed 300 characters']
        },
        repliedAt: Date
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date
});

// Auto-update updatedAt on edit
reviewSchema.pre('save', function(next) {
    if (this.isModified('comment') || this.isModified('rating') || this.isModified('photos') || this.isModified('ownerReply')) {
        this.updatedAt = Date.now();
    }
    next();
});

const reviewModel = mongoose.model('Review', reviewSchema , 'Reviews');
module.exports = reviewModel;