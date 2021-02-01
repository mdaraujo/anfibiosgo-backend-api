const winston = require('winston');
const config = require('config');
require('winston-mongodb');
require('express-async-errors');

module.exports = function () {
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }), // TODO update to latest version
    new winston.transports.File({ filename: 'uncaughtExceptions.log' }));

  process.on('unhandledRejection', (ex) => {
    throw ex;
  });

  winston.add(new winston.transports.Console({
    format: winston.format.simple(),
    level: 'debug'
  }));

  if (process.env.NODE_ENV !== 'test') {
    winston.add(new winston.transports.File({
      filename: 'logfile.log'
    }));

    winston.add(new winston.transports.MongoDB({
      db: config.get('db'),
      level: 'info'
    }));
  }

}