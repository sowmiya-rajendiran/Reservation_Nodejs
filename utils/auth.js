const jwt = require('jsonwebtoken');
const { SECRET_KEY, EXPIRES_IN } = require('./config');

// generate token
const generateToken = (id) => {
    return jwt.sign(
        {id},
        SECRET_KEY,
        {expiresIn : EXPIRES_IN}
    )
}

// send token in cookies

const sendTokenResponse = (user , statuscode , res) =>{

    const token = generateToken(user._id);

    // set cookie options
    const options = {
        expires : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly : true,
        // secure : NODE_ENV === 'production',
        // sameSite: 'None',
        sameSite: 'none',
        secure: true
    }
    // response
    res.status(statuscode).cookie("token",token,options).json({
        success : true,
        token,
        user
    })
}

module.exports = {
    generateToken,
    sendTokenResponse
}
