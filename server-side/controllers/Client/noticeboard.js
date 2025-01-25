const AsyncErrorHandler = require("../../ErrorHandlers/async_error_handler");

/**
 * @desc Fetches all notices created by the admin.
 */
const Noticeboard =  AsyncErrorHandler (async (req, res, next) => {
    try {
        //fetch all notices.
        const notices = await Notices.find();

        //return the fetched data.
        return res.json({ status: true, data: notices });
    }
    catch (ex) {
        //handle error.
        next(ex);
    }

});

module.exports = Noticeboard ;