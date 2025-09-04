const { validationResult } = require("express-validator");
const userModel = require("../model/userModel");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { sendTokenResponse } = require("../utils/auth");
const tokenModel = require("../model/passwordResetToken");
const sendResetEmail = require("../utils/sendEmail");


const authController = {
    register : async (req , res) => {
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({
                    success : false,
                    message : 'Validation failed',
                    errors : errors.array()
                })
            }

            const {name , email , password , phone , role} = req.body;

            const existingUser = await userModel.findOne({email});

            // user alredy exist
            if(existingUser){
                return res.status(400).json({
                    success : false,
                    message : 'User already exists with this email'
                })
            }

            // new user
            const user = await userModel.create({
                name,
                email,
                password,
                phone,
                role
            })

            user.save();
            // register success generate token

            sendTokenResponse(user , 200 , res);

        }catch(error){
            res.status(500).json({
                success: false,
                message: 'Server error during registration'
            })
        }
    },
    login : async (req , res) => {
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({
                    success : false,
                    message : 'Validation failed',
                    errors : errors.array()
                })
            }

            const {email , password} = req.body;

            // check email exist
            const user = await userModel.findOne({email}).select('+password');
            if(!user){
                return res.status(400).json({
                    success : false ,
                    message : 'User Not registed'
                })
            }
            if(!user.isActive){
                return res.status(400).json({
                    success : false,
                    message : 'user account in not active ',
                })
            }
            const isMatch = await user.matchPassword(password);
            if(!isMatch){
                return res.status(400).json({
                    success : false ,
                    message : 'user Password is not match'
                })
            }
            await user.save();
            // send token in login
            sendTokenResponse(user,200,res);
            
        }catch(error){
            res.status(500).json({
                success: false,
                message: 'Server error during login'
            });
        }
    },
    getMyProfile : async (req , res) => {
        try{
            const userId = req.userId;
            // find user
            const user = await userModel.findById(userId);
            if(!user){
                return res.status(400).json({message :"user not available"})
            }

            res.status(200).json({
                success: true,
                user
            });

        }catch(error){
            res.status(500).json({
                success: false,
                message: 'Server error while fetching user details'
            });
        }
    },
    logout : async (req , res) => {
        try{
            await res.clearCookie('token');
            res.status(200).json({
                success: true,
                message: 'Logged out successfully'
            })
        }catch(error){
            res.status(500).json({message : "logout error"})
        }
    },
    forgetPassword : async (req , res) => {
        try{
            const {email} = req.body;
            // check exist user
            const user = await userModel.findOne({ email });
            if (!user) return res.status(404).json({ message: "Email Id not found in Database" });
            
            // generate random string token
            const token =  crypto.randomBytes(32).toString("hex");

            // Save new token in DB
            await tokenModel.create({
                userId: user._id,
                token,
                expiresAt: new Date(Date.now() + 60 * 60 * 1000),
            });
            
            await sendResetEmail(email , token);
            return res.status(200).json({message : "Email Send Successfully" , token : token})

        }
        catch(err){
            res.status(500).json({message : "Error forgetPassword Contoller" , Error : err.message})
        }
    },
    resetPassword : async (req , res) =>{
        try{
            const {token} = req.params ;
            const {password} = req.body ;
            // find token
            const resetToken = await tokenModel.findOne({token});
            // check valid token 
            if(!resetToken || resetToken.expiresAt < Date.now()){  
                return res.status(400).json({ message: "Invalid or expired token" });
            }

            const user = await userModel.findById(resetToken.userId);
            if(!user) return res.status(404).json({ message: "User not found" });

            user.password = password;

            await user.save();

            await tokenModel.deleteOne({ _id: resetToken._id });

            res.status(200).json({ message: "Password reset successful" });

        }catch(err){
            res.status(500).json({message : "Error reset password controller" , Error : err.message})
        }
    }
}

module.exports =  authController ;