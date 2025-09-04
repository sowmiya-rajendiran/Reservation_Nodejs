const nodemailer = require('nodemailer');
const { EMAIL, PASS } = require('./config');

// Sender email details
const sendResetEmail = async (email , token ) => {
    const resetLink = `https://reservationsyst.netlify.app/resetpassword/${token}`;
    // const resetLink = `http://localhost:5173/resetpassword/${token}`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: PASS
            }
    });
    const mailOptions = {
        from : `"Support" <${EMAIL}>`,
        to: email ,
        subject : "Password Reset Link",
        html : `
            <p>You requested a password reset.</p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>This link will expire in 1 hour.</p>
        `
    };

    await transporter.sendMail(mailOptions);

}

module.exports = sendResetEmail;