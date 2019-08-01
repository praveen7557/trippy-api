const Joi = require('joi');

module.exports = {

  // POST /v1/auth/facebook
  // POST /v1/auth/google
  oAuth: {
    body: {
      service: Joi.string().required(),
      refresh_token: Joi.string(),
      service_id: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string().required(),
      picture: Joi.string()
    },
  },

  // POST /v1/auth/refresh
  refresh: {
    body: {
      email: Joi.string().email().required(),
      refreshToken: Joi.string().required(),
    },
  },
};
