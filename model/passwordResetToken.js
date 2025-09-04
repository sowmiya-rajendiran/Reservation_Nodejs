const { default: mongoose } = require("mongoose");
const userModel = require("./userModel");

const tokenSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : userModel,
        required : true
    },
    token: { 
        type: String, 
        required: true 
    },
    expiresAt: { 
        type: Date, 
        required: true 
    },
})

const tokenModel = mongoose.model("tokenModel", tokenSchema ,"Tokens");
module.exports = tokenModel;