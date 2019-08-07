const jwt = require("jwt-simple");
const httpStatus = require("http-status");
const User = require('../../models/user.model');
const { jwtSecret } = require("../../../config/vars");

exports.oAuth = () => async (req, res, next) => {
  const { name, service, service_id, email, refresh_token, picture } = req.body;
  const userData = { name, service, service_id, email, refresh_token, picture };
  const user = await User.oAuthLogin(userData);
  req.user = user;
  next()
}

exports.isAuthorized = () => async (req, res, next) => {

  //get the token from the header if present
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  //if no token found, return response (without going to the next middelware)
  if (!token) return res.status(httpStatus.UNAUTHORIZED).send("Access denied. No token provided.");

  try {
    //if can verify the token, set req.user and pass to next middleware
    const decoded = jwt.decode(token, jwtSecret);
    req.user = decoded.id;
    next();
  } catch (ex) {
    //if invalid token
    res.status(httpStatus.UNAUTHORIZED).send("Invalid token.");
  }
}