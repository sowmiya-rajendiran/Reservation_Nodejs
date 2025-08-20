const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt');
const restaurantModel = require('./restaurantModel')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required: [true, 'Please provide your name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email : {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^\d{10}$/, 'Phone number must be 10 digits']
    },
    password:{
        type: String,
        required: [true, 'Please provide your password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // Do not return password in queries
    },
    role: {
        type: String,
        enum: ['user', 'manager', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    favorites: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Restaurants'
    }],
    createdAt: {
        type: Date, 
        default: Date.now 
    }
}, {timestamps : true})

// encrypt password before save in db
userSchema.pre('save', async function(next) {
    // check password modify
    if(!this.isModified('password')){
        next()
    }
    // hash password
    const salt = await bcrypt.genSalt(10); // salt generate random string
    this.password = await bcrypt.hash(this.password , salt);

    next();
    
})

// match password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword , this.password)   
}

const userModel = mongoose.model('user',userSchema , 'Users')

module.exports = userModel;