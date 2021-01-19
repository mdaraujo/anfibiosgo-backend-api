const request = require('supertest');
const mongoose = require('mongoose');
const { Publication } = require('../../models/publication');
const { User } = require('../../models/user');
const { Species } = require('../../models/species');


describe('/api/publications', () => {
  let server;
  let token;

  const publication = {
    user: {
      _id: mongoose.Types.ObjectId(),
      name: '12345',
    },
    species: {
      _id: mongoose.Types.ObjectId(),
      commonName: '12345',
    }
  };

  beforeEach(async () => {
    server = require('../../index');
    token = new User().generateAuthToken();
  });

  afterEach(async () => {
    await server.close();
    await Publication.remove({});
    await User.remove({});
    await Species.remove({});
  });

  describe('GET /', () => {

    beforeEach(async () => {
      await new Publication(publication).save();
      await new Publication(publication).save();
    });

    const exec = () => {
      return request(server)
        .get('/api/publications')
        .set('x-auth-token', token);
    };

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return all publications', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(p => p.user.name === publication.user.name)).toBeTruthy();
      expect(res.body.some(p => p.species.commonName === publication.species.commonName)).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    let publicationId;

    beforeEach(async () => {
      const pub = await new Publication(publication).save();
      publicationId = pub._id;
    });

    const exec = () => {
      return request(server)
        .get('/api/publications/' + publicationId)
        .set('x-auth-token', token);
    };

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return a publication if valid id is passed', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('user.name', publication.user.name);
    });

    it('should return 404 if invalid id is passed', async () => {
      publicationId = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if no publication with the given id exists', async () => {
      publicationId = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

  });

  describe('POST /', () => {
    let speciesId;

    const exec = () => {
      return request(server)
        .post('/api/publications')
        .set('x-auth-token', token)
        .send({ speciesId });
    };

    beforeEach(async () => {
      speciesId = mongoose.Types.ObjectId();

      species = new Species({
        _id: speciesId,
        commonName: '12345',
        scientificName: '12345',
        description: '12345',
        status: '12345',
      });
      await species.save();

      const user = new User({
        _id: mongoose.Types.ObjectId(),
        name: '12345',
        email: '12345',
        password: '12345',
      });

      token = user.generateAuthToken();
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if speciesId is not provided', async () => {
      speciesId = '';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if speciesId is not valid', async () => {
      speciesId = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 200 if we have a valid request', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should return the publication if input is valid', async () => {
      const res = await exec();

      const props = ['_id', 'user', 'species', 'date'];

      expect(Object.keys(res.body)).toEqual(expect.arrayContaining(props));
    });

    it('should set the date if input is valid', async () => {
      const res = await exec();

      const publicationInDb = await Publication.findById(res.body._id);
      const diff = new Date() - publicationInDb.date;
      expect(diff).toBeLessThan(10 * 1000);
    });

  });
});