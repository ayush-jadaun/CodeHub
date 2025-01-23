const ClientSessions = require("../../../model/clientSessionModel");
const AsyncErrorHandler = require("../../../ErrorHandlers/async_error_handler");

/**
 * Logout controller
 * @description Logout client by deleting active session and client side cookies.
 */
const Logout = AsyncErrorHandler(async (req, res, next) => {
    const { cookieID, userId } = req.decoded;

    // Validate input.
    if (!cookieID || !userId) {
        return res.status(400).json({
            success: false,
            message: "Invalid logout request.",
        });
    }

    // Find and delete the active session
    const session = await ClientSessions.findOne({ userId, cookieID });
    if (session) {
        await ClientSessions.deleteOne({ _id: session._id });
    } else {
        return res.status(200).json({
            success: true,
            message: "No active session found. Logout successful.",
        });
    }

    // Clear the client side cookie.
    //console.log("hello line 31 logout.js");
    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    // Success response
    return res.status(200).json({
        success: true,
        message: "Logout successful.",
    });
});

module.exports = Logout;
