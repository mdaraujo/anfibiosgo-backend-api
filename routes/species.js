const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Species } = require('../models/species');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const species = await Species.find().sort('name');
  res.send(species);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const species = await Species.findById(req.params.id);

  if (!species) return res.status(404).send('The species with the given ID was not found.');

  res.send(species);
});

module.exports = router;