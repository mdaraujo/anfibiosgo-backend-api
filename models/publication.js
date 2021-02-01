const Joi = require('joi');
const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
  user: {
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
  species: {
    type: new mongoose.Schema({
      commonName: {
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

const Publication = mongoose.model('Publication', publicationSchema);

function validatePublication(publication) {
  const schema = Joi.object({
    speciesId: Joi.objectId().required()
  });

  return schema.validate(publication);
}

exports.Publication = Publication;
exports.validatePublication = validatePublication;