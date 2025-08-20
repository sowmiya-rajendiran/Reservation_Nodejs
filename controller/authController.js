const { validationResult } = require("express-validator");
const userModel = require("../model/userModel");
const { sendTokenResponse } = require("../utils/auth");


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

            const {name , email , password , phone} = req.body;

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
                phone
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
    }
}

module.exports =  authController ;