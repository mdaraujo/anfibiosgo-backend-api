const { Publication, validatePublication } = require('../models/publication');
const { Species } = require('../models/species');
const { User } = require('../models/user');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const publications = await Publication.find().sort('-date');
  res.send(publications);
});

router.post('/', auth, async (req, res) => {
  const { error } = validatePublication(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send('Invalid user.');

  const species = await Species.findById(req.body.speciesId);
  if (!species) return res.status(400).send('Invalid species.');

  let publication = new Publication({
    user: {
      _id: user._id,
      name: user.name,
    },
    species: {
      _id: species._id,
      name: species.name,
    }
  });

  await publication.save();
  res.send(publication);

});

router.get('/:id', async (req, res) => {
  const publication = await Publication.findById(req.params.id);

  if (!publication) return res.status(404).send('The publication with the given ID was not found.');

  res.send(publication);
});

module.exports = router;
