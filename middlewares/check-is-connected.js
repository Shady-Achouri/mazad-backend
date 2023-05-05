const Admin = require('../models/Admin');
const ENV = require("../static");
const jwt = require("jsonwebtoken")

/**
 * @function checkToken - check if token is valid
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
const checkToken = async (req, res, next) => {
  try {
    const token =
      req.body?.token ||
      req.query?.token ||
      req.headers["x-access-token"] ||
      req.headers?.authorization?.split(" ")[1];

    let decodedToken = jwt.verify(token, ENV.JWT.KEY);
    decodedToken = decodedToken[Object.keys(decodedToken)[0]];
    if (decodedToken.role.includes("admin") || decodedToken.role.includes("superAdmin")) {
      const admin = await Admin.findOne({ token });
      if (admin) {
        // req.body.obAdmin = admin;
        next();
      }
      return res.status(403).send({
        error: true,
        message: "No admin token provided.",
      });
    }
  } catch (e) {
    return res.status(e.code >= 100 && e.code < 500 ? e.code : 500).json({
      error: true,
      message: e.message,
    });
  }
};

module.exports = {
  checkToken: checkToken,
};
