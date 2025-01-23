const AsyncErrorHandler = require("../../../ErrorHandlers/async_error_handler");
const CfVerificationRequestToken = require("../../../model/cfVerificationRequestModel")
const User = require("../../../model/userModel");
const tempUser= require("../../../model/tempUserModel")

/**
 * @desc Generate a request token for codeforces ID verification.
 */
const generateCfVerificationRequestToken = AsyncErrorHandler(async (req, res, next) => {
    const { problemID, cfID, requestTime } = req.body;

    //Input validation.
    if (!problemID || !cfID || !requestTime) {
        return res.status(400).json({ success: false, message: "Invalid request ! Missing required fields" });
    }
    

    // console.log("Request received for cfID verification", problemID, cfID);
    try {
        //Check if user already exists in database
        const user = await User.findOne({ cfID }) || await tempUser.findOne({ cfID });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        //Check if user's email is verified
        if (!user.emailVerified) {
            return res.status(400).json({ success: false, message: "Email not verified" });
        }

        //Check if cfID is already verified
        if (user.cfVerified) {
            return res.status(400).json({ success: false, message: "cfID already verified" });
        }

        //Check if user has already requested for cfID verification
        const existingRequest = await CfVerificationRequestToken.findOne({ cfID, problemID });
        if (existingRequest) {
            //check if existing request is still valid (is of less than 2 minutes).
            const timeDifference = new Date(requestTime) - new Date(existingRequest.requestTime);
            if (timeDifference < 120000) {
                return res.status(400).json({ success: false, message: "Request already exists" });
            }
            else {
                //Delete the existing request(it is expired).
                await CfVerificationRequestToken.deleteOne({ cfID, problemID });
            }
        }

        //Create new codeforces verification request token.
        const newRequest = new CfVerificationRequestToken({ cfID, problemID, requestTime });
        await newRequest.save();

        //send success response.
        res.status(200).json({ success: true, message: "Request token generated successfully" });

    } catch (error) {
        //Error response to custom Async error handler.
        next(error);
    }

})

module.exports = generateCfVerificationRequestToken;