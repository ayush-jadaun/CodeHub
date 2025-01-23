const Joi = require("joi");
const { randomUUID } = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Users = require("../../../model/userModel");
const tempUser= require("../../../model/tempUserModel")
const ClientSessions = require("../../../model/clientSessionModel");
const VerificationToken = require("../../../model/verificationTokenModel");
const utils = require("../../../utils/auth/auth.utils")
const sendEmail = require("../../../utils/auth/sendEmail")
const AsyncErrorHandler = require("../../../ErrorHandlers/async_error_handler");

/**
 * @desc Login controller for client.
 * @purpose  - To authenticate client and create a new session and cookie for user whose email is verified.
 *           - sends a verification email if email is not verified.
 */
const Login = AsyncErrorHandler(async (req, res, next) => {
    // Input schema defined using Joi(validation library).
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    

    // check if the input is valid.
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid input",
            error: error.details[0].message,
        });
    }


    const { email, password } = req.body;
    
    try {

        //Check if user exists in tempUser or in Users model
        const user = await tempUser.findOne({email}) || await Users.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        
        // Compare password.
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        //Check if user email is verified.
        if (!user.emailVerified) {
            //Check if verification code exists.
            let token = await VerificationToken.findOne({ email: user.email });
            if (!token) {
                //Create a new verification code (OTP) for email verification.
                const verificationCode = await utils.generateVerificationCode();
                token = await VerificationToken.create({
                    email: user.email,
                    code: verificationCode
                });
                await token.save();
            }

            //create email content for verification email.
            const subject = "Verification Email";
            const text = utils.createVerificationEmail({ verificationCode: token.code, subject });

            //Send email
            await sendEmail(user.email, subject, text);

            //Error response for unverified email.
            return res.status(401).json({
                success: false, message: "Email not verified. Verification email sent."
                , isVerifiedEmail: false
            });
        }

        //Creating new session for client.
        const cookieID = randomUUID();

        const existingSession = await ClientSessions.findOne({ userId: user._id });
        if (existingSession) {
            await ClientSessions.deleteOne({ userId: user._id }); //Delete previous session.
        }
        await ClientSessions.create({ userId: user._id, cookieID });

        //Create a new token for new client session.
        const token = jwt.sign({ cookieID, userId: user._id }, process.env.COOKIE_SECRET_KEY, {
            expiresIn: "1d",
        });

        // set token in cookie to manage client session.
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        //Success response.
        return res.status(200).json({
            success: true,
            data: { userId: user._id },
        });
    } catch (error) {
        //Error response to custom Async error handler.
        next(error);
    }
});

module.exports = Login;
