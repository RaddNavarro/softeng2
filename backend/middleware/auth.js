const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  //Get the token from header
  const token = req.header("x-auth-token");

  //Check if no token from the header
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  //Verify token
  try {
    console.log("helo");
    //Decoding the token
    const decoded = jwt.verify(token, config.get("jwtUsersToken"));

    req.user = decoded.user;

    //go to the next middleware
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
