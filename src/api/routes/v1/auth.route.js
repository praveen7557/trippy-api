const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/auth.controller');
const { oAuth, refresh } = require('../../validations/auth.validation');
const oAuthLogin = require("../../middlewares/auth/auth.middleware").oAuth;

const router = express.Router();

router.route('/refresh-token')
  .post(validate(refresh), controller.refresh);

router.route('/facebook')
  .post(validate(oAuth), oAuthLogin(), controller.oAuth);

router.route('/google')
  .post(validate(oAuth), oAuthLogin(), controller.oAuth);

router.route('/user/:id')
  .put(controller.update);

router.route('/logout')
  .post(controller.logout);

module.exports = router;
