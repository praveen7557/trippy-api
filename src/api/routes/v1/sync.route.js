const express = require('express');
// const validate = require('express-validation');
const controller = require('../../controllers/sync.controller');

const router = express.Router();

router.route('/')
  .get(controller.home);

// router.route('/')
//   .post(validate(tripValidation), controller.create);

// router.route('/:id')
//   .get(validate(getTrip), controller.get);

// router.route('/notes/:id')
//   .put(validate(noteUpdate), controller.updateNote);

module.exports = router;
