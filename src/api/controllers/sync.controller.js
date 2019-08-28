const httpStatus = require('http-status');
const Activity = require("../models/activity.model");
const Trip = require("../models/trip.model");

exports.home = async (req, res, next) => {
  try {
    let { user } = req;
    let { last_updated } = req.body;
    let trips = await Trip.find({
      $and: [
        { user },
        { "updatedAt": { $gt: last_updated } }
      ]
    })
      .populate("check_list", "id name checked")
      .populate("notes", "id description");

    trips = trips.map(e => e.transform());
    res.status(httpStatus.OK).send({ trips });
  } catch (error) {
    return next(error);
  }
};