const User = require('../../models/user.model');

exports.oAuth = () => async (req, res, next) => {
  const { name, service, service_id, email, refresh_token, picture } = req.body;
  const userData = { name, service, service_id, email, refresh_token, picture };
  const user = await User.oAuthLogin(userData);
  req.user = user;
  next()
}