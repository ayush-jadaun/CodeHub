

const EducationCategories = require("../model/educationCategoryModel");
const Notices = require("../model/noticeModel");
const Users = require("../model/userModel");
const Videos = require("../model/videoModel");
const ClientSessions = require("../model/clientSessionModel");

/**
 * @desc Fetches all education categories
 */
module.exports.educationCategories = async (req, res, next) => {
    try {
        //check if the session is valid.
        const { decoded, body: { cfID } } = req;
        const { cookieID } = decoded;

        const session = await ClientSessions.findOne({ cookieID });

        if (!session || cookieID !== session.cookieID) {
            return res.status(401).json({ status: false, msg: "Session expired or invalid" });
        }

        //fetch all education categories.
        const educationCategories = await EducationCategories.find();

        //return the fetched data.
        return res.json({ status: true, data: educationCategories });

    } catch (error) {
        //handle error.
        next(error);
    }
};

/**
 * @desc Fetches all videos for a given category.
 */
module.exports.videos = async (req, res, next) => {
    try {
        const cookie = req.decoded;
        const cfID = req.body.cfID;

        //check if the session is valid.
        const cookieID = cookie.cookieID;
        const session = await ClientSessions.findOne({cfID: cfID});
        if (cookieID == session.cookieID) {
            const {categoryID} = req.body;

            //fetch all videos for the given category.
            const videos = await Videos.find({categoryID: categoryID});

            //return the fetched data.
            return res.json({status: true, data: videos});
        } else{
            return res.json({status: false, msg: "Session expired"});
        }

    }
    catch (ex) {
        //handle error.
        next(ex);
    }
};

