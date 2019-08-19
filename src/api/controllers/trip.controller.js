const httpStatus = require('http-status');
const Trip = require('../models/trip.model');
const Checklist = require('../models/check.model');
const Note = require('../models/note.model');
const agenda = require('../../jobs/index');

exports.home = async (req, res, next) => {
  try {
    let currentDate = Date.now();
    let trips = await Trip.find({
      $and: [
        { user: req.user },
        { "end_date": { $gt: currentDate } }
      ]
    })
      .sort('start_date')
      .select('-check_list -notes');

    if (trips.length == 0) {
      res.status(httpStatus.OK).send({ trip: null });
      return;
    }
    let trip = trips[0].transform();
    trip.type = trip.start_date > currentDate ? 1 : 2;
    res.status(httpStatus.OK).send({ trip });
  } catch (error) {
    return next(error);
  }
};

exports.all = async (req, res, next) => {
  try {
    let trips = await Trip.find({ user: req.user })
      .sort('start_date')
      .select('-check_list -notes')
    trips = trips.map(e => {
      return e.transform();
    })
    res.status(httpStatus.OK).send({ trips });
  } catch (error) {
    return next(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    let trip = await Trip.get(req.params.id);
    res.status(httpStatus.OK).send({ trip });
  } catch (error) {
    return next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, location, place_id, start_date, end_date, check_list, notes, lat, lng } = req.body;
    const user = req.user;
    let checklist = await Checklist.insertMany(check_list);
    checklist = checklist.map(e => e.id);
    let notesList = [];
    if (notes != undefined) {
      notesList = await Note.insertMany(notes);
      notesList = notesList.map(e => e.id);
    }
    let trip = await Trip.create({
      name, location, place_id, start_date, end_date, check_list: checklist, notes: notesList, user, lat, lng
    });

    agenda.schedule("2019-08-19T10:55:59.999Z", 'send notification', {
      id: trip.id,
      days: 1
    });
    agenda.schedule("2019-08-19T10:56:59.999Z", 'send notification', {
      id: trip.id,
      days: 2
    });
    agenda.schedule("2019-08-19T10:57:59.999Z", 'send notification', {
      id: trip.id,
      days: 3
    });

    res.status(httpStatus.OK).send({ trip });
  } catch (error) {
    return next(error);
  }
};

exports.update = async function (req, res, next) {
  try {
    let updated = await Trip.update(req.params.id, req.body);
    res.send({ trip: updated }, httpStatus.OK);
  } catch (error) {
    return next(error);
  }
};

exports.updateChecklist = async function (req, res, next) {
  try {
    let updated = await Checklist.update(req.params.id, req.body);
    res.send({ updated: true }, httpStatus.OK);
  } catch (error) {
    return next(error);
  }
};

exports.updateNote = async function (req, res, next) {
  try {
    let updated = await Note.update(req.params.id, req.body);
    res.send({ updated: true }, httpStatus.OK);
  } catch (error) {
    return next(error);
  }
};



