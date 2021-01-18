const request = require('supertest');
const mongoose = require('mongoose');
const { User } = require('../../models/user');
const { Publication } = require('../../models/publication');
const { Species } = require('../../models/species');

describe('auth middleware', () => {
  let server;
  let userId;
  let speciesId;
  let user;
  let publication;
  let token;

  const exec = () => {
    return request(server)
      .post('/api/publications')
      .set('x-auth-token', token)
      .send({ userId, speciesId });
  };

  beforeEach(async () => {
    server = require('../../index');

    userId = mongoose.Types.ObjectId();
    speciesId = mongoose.Types.ObjectId();

    user = new User({
      _id: userId,
      name: '12345',
      email: '12345',
      password: '12345',
    });
    await user.save();

    token = user.generateAuthToken();

    species = new Species({
      _id: speciesId,
      name: '12345',
    });
    await species.save();

    publication = new Publication({
      user: {
        _id: userId,
        name: '12345',
      },
      species: {
        _id: speciesId,
        name: '12345',
      }
    });

    await publication.save();
  });

  afterEach(async () => {
    await server.close();
    await Publication.remove({});
    await User.remove({});
    await Species.remove({});
  });

  it('should return 401 if no token is provided', async () => {
    token = '';

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 400 if token is invalid', async () => {
    token = 'a';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 200 if token is valid', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});