const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
const { ObjectId } = mongoose.Schema;
const Checklist = require('./check.model');
const Note = require('./note.model');

const tripSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  place_id: {
    type: String
  },
  check_list: [
    {
      type: ObjectId,
      ref: 'Checklist'
    }
  ],
  notes: [
    {
      type: ObjectId,
      ref: 'Note'
    }
  ],
  user: {
    type: ObjectId,
    ref: "User"
  }
}, {
    timestamps: true,
  });

tripSchema.method({
  transform() {
    var obj = this.toObject({ virtuals: true });
    delete obj._id;
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;
    return obj;
  },
})

tripSchema.statics = {
  async get(id) {
    try {
      let trip;

      trip = await this.findById(id)
        .sort('start_date')
        .populate("check_list", "id name checked")
        .populate("notes", "id description")

      if (trip) {
        return trip.transform();
      }

      throw new APIError({
        message: 'Trip does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  async update(id, body) {
    let item = await this.findById(id);
    let added;
    if (body.new == "check") {
      let existing = item.check_list;
      let checkItem = new Checklist({
        name: body.check_list[0].name,
        checked: body.check_list[0].checked
      });
      added = await checkItem.save();
      existing.push(added.id);
      body.check_list = existing;
    } else if (body.new == "note") {
      let existing = item.notes;
      let noteItem = new Note({
        description: body.notes[0].description
      });
      added = await noteItem.save();
      existing.push(added.id);
      body.notes = existing;
    }
    if (item) {
      for (let b in body) {
        item[b] = body[b];
      }
      let updated = await item.save();
      if (updated) {
        return {
          ...updated,
          addedId: added ? added.id : null
        };
      }
    }
    throw new APIError({
      message: 'Trip with the provided id does not exits',
      status: httpStatus.NOT_FOUND,
    });
  },

  list({
    page = 1, perPage = 30, name, email, role,
  }) {
    const options = omitBy({ name, email, role }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  }
};

module.exports = mongoose.model('Trip', tripSchema);
