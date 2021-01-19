const express = require('express');
const users = require('../routes/users');
const auth = require('../routes/login');
const species = require('../routes/species');
const publications = require('../routes/publications');

const error = require('../middleware/error');

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/api/species', species);
  app.use('/api/publications', publications);
  app.use(error);
}