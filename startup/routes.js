const express = require('express');
const users = require('../routes/users');
const login = require('../routes/login');
const species = require('../routes/species');
const publications = require('../routes/publications');

const error = require('../middleware/error');

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/users', users);
  app.use('/api/login', login);
  app.use('/api/species', species);
  app.use('/api/publications', publications);
  app.use(error);
}