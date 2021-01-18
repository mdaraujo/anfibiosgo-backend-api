const Joi = require('joi');
const mongoose = require('mongoose');
const moment = require('moment');

const publicationSchema = new mongoose.Schema({
  user: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
    }),
    required: true
  },
  species: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 50
      },
    }),
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
});

publicationSchema.statics.lookup = function (userId, speciesId) {
  return this.findOne({
    'user._id': userId,
    'species._id': speciesId,
  });
}

const Publication = mongoose.model('Publication', publicationSchema);

function validatePublication(publication) {
  const schema = {
    userId: Joi.objectId().required(),
    speciesId: Joi.objectId().required()
  };

  return Joi.validate(publication, schema);
}

exports.Publication = Publication;
exports.validatePublication = validatePublication;