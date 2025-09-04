require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI ;
const PORT = process.env.PORT || 3006 ;
const NODE_ENV = process.env.NODE_ENV;
const SECRET_KEY = process.env.SECRET_KEY;
const EXPIRES_IN = process.env.EXPIRES_IN; 

const EMAIL = process.env.EMAIL;
const PASS = process.env.PASS;

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

module.exports = {MONGODB_URI , PORT , NODE_ENV , SECRET_KEY , EXPIRES_IN , EMAIL , PASS , STRIPE_SECRET_KEY , STRIPE_WEBHOOK_SECRET}