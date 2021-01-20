const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const validateObjectId = require('../middleware/validateObjectId');
const { Publication, validatePublication } = require('../models/publication');
const { Species } = require('../models/species');

router.get('/', auth, async (req, res) => {
  const publications = await Publication.find().sort('-date');
  res.send(publications);
});

router.post('/', [auth, validate(validatePublication)], async (req, res) => {

  const species = await Species.findById(req.body.speciesId);
  if (!species) return res.status(400).send('Invalid species.');

  const publication = new Publication({
    user: {
      _id: req.user._id,
      name: req.user.name,
    },
    species: {
      _id: species._id,
      commonName: species.commonName,
    }
  });

  await publication.save();
  res.send(publication);

});

router.get('/:id', [auth, validateObjectId], async (req, res) => {
  const publication = await Publication.findById(req.params.id);

  if (!publication) return res.status(404).send('The publication with the given ID was not found.');

  res.send(publication);
});

module.exports = router;
