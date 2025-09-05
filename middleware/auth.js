const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../utils/config');
const userModel = require('../model/userModel');

const auth = {
    protect: async (req, res, next) => {
        try {
            let token;

            // Get token from "Authorization: Bearer <token>"
            if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
                token = req.headers.authorization.split(" ")[1];
            }

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'No token provided'
                });
            }

            // Verify token
            const decoded = jwt.verify(token, SECRET_KEY);

            // Get user from DB
            req.user = await userModel.findById(decoded.id);

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            if (!req.user.isActive) {
                return res.status(403).json({
                    success: false,
                    message: 'User account is deactivated'
                });
            }

            req.userId = decoded.id;
            next();

        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route',
                error: error.message
            });
        }
    },

    allowRoles: (roles) => {
        return async (req, res, next) => {
            const userId = req.userId;
            const user = await userModel.findById(userId);

            if (user && roles.includes(user.role)) {
                next();
            } else {
                res.status(403).json({ message: "Access denied" });
            }
        };
    }
};

module.exports = auth;