const jwt = require("jsonwebtoken")

const ClientSession = require("../../../model/clientSessionModel")
const User = require("../../../model/userModel")
const tempUser= require("../../../model/tempUserModel")
const AsyncErrorHandler = require("../../../ErrorHandlers/async_error_handler");

/**
 * @description Checks if the user's session is valid.
 * @returns {Object} - Response object with session status and user data if valid.
 */
const checkSession = AsyncErrorHandler(async (req, res, next) => {
    //Extract token from user's cookie
    const token = req.decoded;
    
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    try {
        //Verify the JWT token.
        const userId = token.userId;
        const storedToken = await ClientSession.findOne({ userId });
        if (!storedToken) {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }

        //extracting user information from database from both the models tempUser and User model
        const user = await tempUser.findById(userId) || await User.findById(userId);
        const sanitizedUser = {
            userID: user._id,
            email: user.email,
            username: user.username,
            emailVerified: user.emailVerified,
            cfVerified: user.cfVerified,
            cfID: user.cfID
        }

        //Success response with data.
        res.status(200).json({
            data: sanitizedUser,
            success: true,
            message: "Session verified"
        });

    } catch (error) {
        //Error response to custom Async error handler.
        next(error);
    }
})

module.exports = checkSession;