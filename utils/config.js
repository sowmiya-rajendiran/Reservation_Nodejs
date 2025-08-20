require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI ;
const PORT = process.env.PORT || 3006 ;
const NODE_ENV = process.env.NODE_ENV;
const SECRET_KEY = process.env.SECRET_KEY;
const EXPIRES_IN = process.env.EXPIRES_IN; 

module.exports = {MONGODB_URI , PORT , NODE_ENV , SECRET_KEY , EXPIRES_IN}