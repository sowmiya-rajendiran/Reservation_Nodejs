const { default: mongoose } = require("mongoose");

const restaurantSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Restaurant must have an owner']
    },
    name: {
        type: String,
        required: [true, 'Restaurant name is required'],
        trim: true
    },
    location: {
        address: { type: String, required: [true, 'Address is required'] },
        city: { type: String, required: [true, 'City is required'] },
        state: { type: String, required: [true, 'State is required'] },
        postalCode: { type: String, required: [true, 'Postal code is required'] }
    },
    contact: {
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            match: [/^\d{10}$/, 'Phone number must be 10 digits']
        },
        email: {
            type: String,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
        },
        website: {
            type: String,
            match: [/^https?:\/\/.+/, 'Please enter a valid website URL']
        },
        socialLinks: {
            facebook: String,
            instagram: String,
            twitter: String
        }
    },
    tableCapacity: {
        type: Number,
        required: [true, 'Table capacity is required'],
        min: 1
    },
    cuisine: {
        type: String,
        required: [true, 'Cuisine type is required']
    },
    priceRange: {
        type: String,
        enum: ['$', '$$', '$$$', '$$$$'],
        default: '$$'
    },
    openingHours: {
        monday: String,
        tuesday: String,
        wednesday: String,
        thursday: String,
        friday: String,
        saturday: String,
        sunday: String
    },
    menu: [{
        item: { type: String, required: true },
        price: { type: Number, required: true, min: 0 }
    }], 
    photos: [String],
    dietaryRestrictions: [String],
    ambiance: {
        type : String
    }, 
    features: [String], 
    rating: { type: Number, default: 0, min: 0, max: 5 },
    createdAt: { type: Date, default: Date.now }
})

const restaurantModel = mongoose.model('restaurant' , restaurantSchema , 'Restaurants');

module.exports = restaurantModel;