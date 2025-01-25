const jwt = require("jsonwebtoken");
/**
 *  @desc verifies the user's authentication status using a JWT stored in a cookie.
 *  @requires jwt - The library used to generate and verify JSON Web Tokens.
 *  @returns {Object} - user authentication status.
 */
const verifyCookie = (req, res, next) => {
      const token = req.cookies.jwt;
      
      if (!token) {
          return res.status(401).json({
              success: false,
              message: "Authentication cookie not found. Please log in.",
          });
      }
  
      jwt.verify(token, process.env.COOKIE_SECRET_KEY, (err, decoded) => {
          if (err) {
              return res.status(403).json({
                  success: false,
                  message: "Invalid or expired authentication cookie.",
              });
          }
          req.decoded = decoded; // assign the decoded payload from token to the request object.
          next();
      });
  };
  
  module.exports = verifyCookie;
  