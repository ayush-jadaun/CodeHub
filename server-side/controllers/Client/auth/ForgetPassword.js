/**
 * @module ForgetPassword.js
 * @description Provides forget password related functionality.
 *              Handles OTP generation, verification, and updating the newly created password.
 */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const AsyncErrorHandler = require("../../../ErrorHandlers/async_error_handler");
const Users = require("../../../model/userModel");
const tempUser= require("../../../model/tempUserModel")
const VerificationToken = require("../../../model/verificationTokenModel");
const utils = require("../../../utils/auth/auth.utils");
const sendEmail = require("../../../utils/auth/sendEmail");

/**
 * Step 1: Forget Password.
 * @description Generates an OTP and sends it to the user's email.
 * @param {string} email - The email of the user.
 * @returns {Object} - Response object indicating the OTP generation status.
 */
const ForgetPassword = AsyncErrorHandler(async (req, res, next) => {
    const { email } = req.body;

    //Check if the user exists and email is verified in both the models tempUser and Users
    const user = await tempUser.findOne({email}) || await Users.findOne({ email });
    if (!user || !user.emailVerified) {
        return res.status(404).json({
            success: false,
            message: "User does not exist or email is not verified",
        });
    }
    // Clear any existing password cookie.
    if(res.cookies?.PASSWORD){
        res.clearCookie('PASSWORD', { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite:process.env.NODE_ENV === "production" ? "none" : "lax" });
    }
    
    
    try {
        // Remove any existing OTP for this email.
        await VerificationToken.deleteOne({ email, subject: "Password Change OTP" });

        // Generate OTP and save it
        const otp = utils.generateVerificationCode();
        const newToken = new VerificationToken({
            email,
            subject: "Password Change OTP",
            code: otp,
        });
        await newToken.save();

        // Send the OTP to the user's email.
        const emailContent = utils.createForgotPasswordEmail({
            resetCode: otp,
            subject: "Password Change OTP",
        });

        sendEmail(email, "Password Change OTP", emailContent);
        
        // Generate a temporary token for password change
        const passwordChangeToken = jwt.sign(
            { email, purpose: "Verify User" },
            process.env.COOKIE_SECRET_KEY,
            { expiresIn: "15m" } // Token expires in 15 minutes.
        );

        // Set the token in a secure cookie.
        res.cookie("PASSWORD", passwordChangeToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email for password recovery",
        });
    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate key (OTP is generated multiple times for the same email) error gracefully.
            return res.status(500).json({
                success: false,
                message: "Duplicate key error. Try again later.",
            });
        }

        return res.status(500).json({
            success: false,
            message: "An error occurred. Please try again later.",
        });
    }
});

/**
 * Step 2: Verify OTP.
 * @description Verifies the OTP and generates a temporary token for password change.
 * @param {string} email - The email of the user.
 * @param {string} otp - The OTP sent to the user's email.
 * @returns {Object} - Response object indicating OTP validity.
 */
const VerifyPasswordChangeOTP = AsyncErrorHandler(async (req, res, next) => {
    const { email, otp } = req.body;

    // Verify the OTP.
    const token = await VerificationToken.findOne({ email, subject: "Password Change OTP", code: otp });
    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Invalid or expired OTP",
        });
    }
    if(token.code!=otp){
        return res.status(400).json({
            success: false,
            message: "Invalid or expired OTP",
        });
    }

    // Generate a temporary token for password change
    const passwordChangeToken = jwt.sign({ email, purpose: "Password Change" }, process.env.COOKIE_SECRET_KEY, {
        expiresIn: "15m", // Token expires in 15 minutes
    });

    //Clear the existing password cookie and create the new one.
    res.clearCookie('PASSWORD', { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite:process.env.NODE_ENV === "production" ? "none" : "lax" });
    res.cookie("PASSWORD", passwordChangeToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 15* 60 * 1000, // 15 minutes
        });
    
    // Delete the OTP after successful verification.
    await VerificationToken.findByIdAndDelete(token._id);

    return res.status(200).json({
        success: true,
        message: "OTP verified. Use the token to reset your password.",
    });
});

/**
 * Step 3: Reset Password.
 * @description Updates the user's password using the temporary token.
 * @param {string} passwordChangeToken - The temporary token for password change.
 * @param {string} newPassword - The new password to be set.
 * @returns {Object} - response object indicating the operation's success or failure.
 */
const ConfirmPasswordChange = AsyncErrorHandler(async (req, res, next) => {
    const { passwordChangeToken, newPassword } = req.body;
    const { email, purpose } = passwordChangeToken;

    // Check if the token is for password change.
    if (purpose !== "Password Change") {
        return res.status(400).json({
            success: false,
            message: "Invalid token purpose",
        });
    }

    // Find the user in both models tempUser and Users
    const user = await tempUser.findOne({email}) || await Users.findOne({ email });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();
    //Clear the password cookie after successful password change.
    res.clearCookie('PASSWORD', { httpOnly: true, secure: true, sameSite: 'Strict' });
    return res.status(200).json({
        success: true,
        message: "Password updated successfully",
    });
});

module.exports = { ForgetPassword, VerifyPasswordChangeOTP, ConfirmPasswordChange };
