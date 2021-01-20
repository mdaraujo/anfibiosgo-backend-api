const express = require('express');
const router = express.Router();
const validateObjectId = require('../middleware/validateObjectId');
const { Species } = require('../models/species');

router.get('/', async (req, res) => {
  const species = await Species.find();
  res.send(species);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const species = await Species.findById(req.params.id);

  if (!species) return res.status(404).send('The species with the given ID was not found.');

  res.send(species);
});

module.exports = router;