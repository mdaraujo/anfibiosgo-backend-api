const request = require('supertest');
const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('../../models/user');

describe('api/login', () => {
  let server;
  let name;
  let email;
  let password;

  beforeEach(async () => {
    server = require('../../index');

    name = "12345";
    email = "12345@test.com";
    password = "12345";

    await request(server).post('/api/users').send({
      name, email, password
    });
  });

  afterEach(async () => {
    await server.close();
    await User.remove({});
  });

  const exec = () => {
    return request(server)
      .post('/api/login')
      .send({ email, password });
  };

  it('should return 400 if email is not provided', async () => {
    email = '';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 400 if password is not provided', async () => {
    password = '';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 400 if email is not valid', async () => {
    email = '123123@test.com';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 400 if password is not valid', async () => {
    password = '123123';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 200 if we have a valid request', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it('should return token if we have a valid request', async () => {
    const res = await exec();

    let decoded;
    try {
      decoded = jwt.verify(res.text, config.get('jwtPrivateKey'));
      expect(decoded).toHaveProperty('name', name);
    }
    catch (ex) {
      throw ex;
    }

  });

});