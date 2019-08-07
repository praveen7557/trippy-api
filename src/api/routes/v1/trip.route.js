const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/trip.controller');
const { tripValidation, tripUpdate, checklistUpdate, getTrip, noteUpdate } = require('../../validations/trip.validation');

const router = express.Router();

router.route('/')
  .get(controller.home);

router.route('/all')
  .get(controller.all);

router.route('/')
  .post(validate(tripValidation), controller.create);

router.route('/:id')
  .get(validate(getTrip), controller.get);

router.route('/:id')
  .put(validate(tripUpdate), controller.update);

router.route('/checklist/:id')
  .put(validate(checklistUpdate), controller.updateChecklist);

router.route('/notes/:id')
  .put(validate(noteUpdate), controller.updateNote);

module.exports = router;
