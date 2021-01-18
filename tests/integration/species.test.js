const request = require('supertest');
const { Species } = require('../../models/species');
const mongoose = require('mongoose');

let server;

describe('/api/species', () => {
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => {
    await server.close();
    await Species.remove({});
  });

  describe('GET /', () => {
    it('should return all species', async () => {
      const species = [
        { name: 'species1' },
        { name: 'species2' },
      ];

      await Species.collection.insertMany(species);

      const res = await request(server).get('/api/species');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === 'species1')).toBeTruthy();
      expect(res.body.some(g => g.name === 'species2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return a species if valid id is passed', async () => {
      const species = new Species({ name: 'species1' });
      await species.save();

      const res = await request(server).get('/api/species/' + species._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', species.name);
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/species/1');

      expect(res.status).toBe(404);
    });

    it('should return 404 if no species with the given id exists', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get('/api/species/' + id);

      expect(res.status).toBe(404);
    });
  });

});