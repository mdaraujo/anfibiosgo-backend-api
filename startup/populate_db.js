const winston = require('winston');
const path = require('path');
const fs = require('fs');
const { Species } = require('../models/species');

module.exports = async function () {
    const filePath = path.join(__dirname, 'initial_data.json');

    let rawdata = fs.readFileSync(filePath);
    let data = JSON.parse(rawdata);

    const existingSpecies = await Species.find();

    if (existingSpecies.length === 0) {
        winston.info('Species do not exist. Inserting all data.');
        await Species.collection.insertMany(data.species);
        return;
    }

    winston.info('Species already exist. Updating');

    for (let speciesData of data.species) {

        await Species.updateOne(
            { commonName: speciesData.commonName },
            { $set: speciesData },
            { runValidators: true });
    }
}