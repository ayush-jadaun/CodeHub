/**
 * @module clientRoutes
 * @fileoverview Defines the routes for all the client controllers.
 */
const router = require("express").Router();

const {
    educationCategories,
    videos,
    leaderboard,
} = require("../controllers/clientControllers");
const controller = require("../controllers/Client/controller");
const verifyCookie = require("../middleware/verifyCookie");
const verifyPasswordReq = require("../middleware/verifyPasswordReq");

// Routes that require authentication.
router.post("/education", verifyCookie, educationCategories);
router.post("/education/videos", verifyCookie, videos);
router.post("/leaderboard", verifyCookie, controller.leaderboard);
router.post("/feedback", controller.userFeedback);
router.post("/logout", verifyCookie, controller.logout);
router.get("/check/session", verifyCookie, controller.checkSession);

// Public routes (do not require authentication)
router.post("/login", controller.login);
router.post("/register", controller.register);
router.get("/noticeboard", controller.noticeboard);
router.post("/verifyEmail", controller.verifyEmail);
router.post("/verifyCfID", controller.verifyCfID);
router.post("/requestCfVerification", controller.generateCfVerificationRequestToken);


// Routes for password change functionality. Requires user authentication.

/**
 * @route POST api/forgetPassword.
 * @desc Generate an OTP and send it to the user's email.
 */
router.post("/forgetPassword",controller.ForgetPassword.ForgetPassword);

/**
 * @route POST api/verifyPasswordChangeOTP.
 * @desc verify the OTP.
 */
router.post("/verifyPasswordChangeOTP",verifyPasswordReq, controller.ForgetPassword.VerifyPasswordChangeOTP);

/**
 * @route POST api/confirmPasswordChange.
 * @desc Update the new password in the database.
 */
router.post("/confirmPasswordChange",verifyPasswordReq,controller.ForgetPassword.ConfirmPasswordChange);

module.exports = router;
