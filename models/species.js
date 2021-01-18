const Joi = require('joi');
const mongoose = require('mongoose');

const speciesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

const Species = mongoose.model('Species', speciesSchema);

exports.speciesSchema = speciesSchema;
exports.Species = Species;