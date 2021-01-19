const Joi = require('joi');
const mongoose = require('mongoose');

const speciesSchema = new mongoose.Schema({
  commonName: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 100
  },
  scientificName: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 1200
  },
  status: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 50
  }
});

const Species = mongoose.model('Species', speciesSchema);

exports.speciesSchema = speciesSchema;
exports.Species = Species;