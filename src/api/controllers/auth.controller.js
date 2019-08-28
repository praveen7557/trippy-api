const httpStatus = require('http-status');
const User = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const moment = require('moment-timezone');
const { jwtExpirationInterval } = require('../../config/vars');

function generateTokenResponse(user, accessToken) {
  const tokenType = 'Bearer';
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
  return {
    tokenType, accessToken, refreshToken, expiresIn,
  };
}

exports.oAuth = async (req, res, next) => {
  try {
    const { user } = req;
    user.tokens.addToSet(req.body.token);
    user.save();
    const accessToken = user.token();
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    res.send({ token, user: userTransformed }, httpStatus.OK);
  } catch (error) {
    return next(error);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const { email, refreshToken } = req.body;
    const refreshObject = await RefreshToken.findOneAndRemove({
      userEmail: email,
      token: refreshToken,
    });
    const { user, accessToken } = await User.findAndGenerateToken({ email, refreshObject });
    const response = generateTokenResponse(user, accessToken);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

exports.update = async function (req, res, next) {
  try {
    let updated = await User.update(req.params.id, req.body);
    res.send({ user: updated }, httpStatus.OK);
  } catch (error) {
    return next(error);
  }
};

exports.logout = async function (req, res, next) {
  try {
    let updated = await User.update(req.body.id, {
      logout: true,
      ...req.body
    });
    res.status(httpStatus.OK).send({ success: true });
  } catch (error) {
    return next(error);
  }
};