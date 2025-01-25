
const AsyncErrorHandler = require("../../ErrorHandlers/async_error_handler");
const ClientSessions = require("../../model/clientSessionModel");
const Users = require("../../model/userModel");
/**
 * @desc Fetches all users in the leaderboard with their codeforces ID.
 */
const Leaderboard = AsyncErrorHandler(async  (req, res, next) => {
    try {
        const {decoded}= req;
        const {cookieID}= decoded;

        //check if the session is valid.
        const session = await ClientSessions.findOne({cookieID});
        if (!session || cookieID !== session.cookieID) {
            return res.status(401).json({ status: false, msg: "Session expired or invalid" });
        }

        //fetch all users with their codeforces ID.
        const cfID = await Users.find().select(["cfID"]);
        //return the fetched data.
        
        return res.json({ status: true, data: cfID });
    }
    catch (error) {
        //handle error.
        console.log(error)
        next(error);
    }

});


module.exports = Leaderboard;