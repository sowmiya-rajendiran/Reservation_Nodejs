const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../utils/config');
const userModel = require('../model/userModel');

const auth  = {
    protect : async (req , res ,next) => {
        try{
            const token = req.cookies.token;
            if(!token){
                return res.status(400).json({
                    success : false,
                    message : 'Token not Valid',
                    error : err.message
                })
            }
            
            // verify token
            const decoded = jwt.verify(token, SECRET_KEY);

            // get the user from token
            req.user = await userModel.findById(decoded.id);

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            if (!req.user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'User account is deactivated'
                });
            }

            req.userId = decoded.id ;

            next()

        }catch(error){
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route.'
            })
        }
        
    },
    allowRoles : (roles) =>{
        return async (req , res , next ) => {
            const userId = req.userId ;
            // find in db
            const user = await userModel.findById(userId);
            // check roll basedd
            if(roles.includes(user.role)){
                next();
            }
            else{
                res.status(400).json({message : "Access denied"})
            }

        }

    }
}

module.exports = auth ;