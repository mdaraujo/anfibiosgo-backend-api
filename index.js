const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/prod')(app);
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

if (process.env.NODE_ENV !== 'test') {
    require('./startup/populate_db')();
}

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;