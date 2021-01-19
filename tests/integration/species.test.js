const request = require('supertest');
const { Species } = require('../../models/species');
const mongoose = require('mongoose');
const populateDB = require('../../startup/populate_db');

let server;

describe('/api/species', () => {

  beforeEach(() => { server = require('../../index'); })

  afterEach(async () => {
    await server.close();
    await Species.remove({});
  });

  describe('GET /', () => {
    it('should return all 17 species', async () => {

      await populateDB();

      const res = await request(server).get('/api/species');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(17);
    });
  });

  describe('GET /:id', () => {

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/species/1');

      expect(res.status).toBe(404);
    });

    it('should return 404 if no species with the given id exists', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get('/api/species/' + id);

      expect(res.status).toBe(404);
    });

    it('should return a species if valid id is passed', async () => {
      const species = new Species({
        commonName: '12345',
        scientificName: '12345',
        description: '12345',
        status: '12345'
      });

      await species.save();

      const res = await request(server).get('/api/species/' + species._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('commonName', species.commonName);
    });

  });
});