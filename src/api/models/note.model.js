const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

const note = new mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String
  }
}, {
    timestamps: true,
  });

note.statics = {
  async update(id, body) {
    let item = await this.findById(id);
    if (item) {
      for (let b in body) {
        item[b] = body[b];
      }
      await item.save();
      return item;
    }
    throw new APIError({
      message: 'Item does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  async deleteItem(id) {
    await this.findByIdAndRemove(id);
  }
}

module.exports = mongoose.model('Note', note);