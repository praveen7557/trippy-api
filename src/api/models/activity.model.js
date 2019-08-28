const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
const { ObjectId } = mongoose.Schema;

const activitySchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  last_updated: {
    type: Date,
    required: true
  }
}, {
    timestamps: true,
  });

activitySchema.statics = {
  async update(id) {
    let item = await this.findOne({ user: id });
    if (item) {
      item.last_updated = new Date();
      await item.save();
      return item;
    }
    throw new APIError({
      message: 'Item does not exist',
      status: httpStatus.NOT_FOUND,
    });
  }
}

module.exports = mongoose.model('Activity', activitySchema);