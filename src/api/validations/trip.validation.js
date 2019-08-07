const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

let checkItem = Joi.object().keys({
  name: Joi.string().required(),
  checked: Joi.boolean()
})

let notes = Joi.object().keys({
  title: Joi.string(),
  description: Joi.string()
})

module.exports = {
  // POST /v1/trip
  tripValidation: {
    body: {
      // name, location, place_id, start_date, end_date, check_list
      name: Joi.string().required(),
      location: Joi.string().required(),
      place_id: Joi.string(),
      start_date: Joi.date().required(),
      end_date: Joi.date().required(),
      check_list: Joi.array().items(checkItem),
      notes: Joi.array().items(notes),
    },
  },

  // PUT /v1/trip/:id
  tripUpdate: {
    params: {
      id: Joi.objectId().label("Not a valid id"),
    },
    body: {
      // name, location, place_id, start_date, end_date, check_list
      name: Joi.string(),
      location: Joi.string(),
      place_id: Joi.string(),
      start_date: Joi.date(),
      end_date: Joi.date(),
      check_list: Joi.array().items(checkItem)
    },
  },
  // PUT /v1/trip/checklist/:id
  checklistUpdate: {
    params: {
      id: Joi.objectId().label("Not a valid id"),
    },
    body: {
      name: Joi.string(),
      checked: Joi.boolean()
    }
  },
  // PUT /v1/trip/note/:id
  noteUpdate: {
    params: {
      id: Joi.objectId().label("Not a valid id"),
    },
    body: {
      title: Joi.string(),
      description: Joi.string()
    }
  },

  getTrip: {
    params: {
      id: Joi.objectId().label("Not a valid id"),
    },
  }
};
