const { default: mongoose } = require("mongoose");

const reservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'Reservation must belong to a user']
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true, 'Reservation must be for a restaurant']
    },
    date: {
        type: Date,
        required: [true, 'Reservation date is required'],
        validate: {
            validator: (value) => value > Date.now(),
            message: 'Reservation date must be in the future'
        }
    },
    time: {
        type: String,
        required: [true, 'Reservation time is required'],
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format']
    },
    guests: {
        type: [String],
        default: [],
        // required: [true, 'Number of guests is required'],
        min: [1, 'At least 1 guest is required'],
        max: [20, 'Maximum 20 guests allowed']
    },
    partySize: {
        type: Number,
        required: true,
        min: 1
    },
    tableType: {
        type: String,
        enum: ['indoor', 'outdoor', 'window'],
        default: 'indoor'
    },
    specialRequest: {
        type: String,
        maxlength: [200, 'Special request cannot exceed 200 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid'],
        default: 'unpaid'
    },
    createdAt: { type: Date, default: Date.now }
})

const reservationModel = mongoose.model('Reservation' , reservationSchema , 'Reservations');

module.exports = reservationModel;