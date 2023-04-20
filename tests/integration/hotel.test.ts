import httpStatus from 'http-status';
import supertest from 'supertest';
import faker from '@faker-js/faker';
import { generateValidToken } from '../helpers';
import app, { init } from '@/app';
import { prisma } from '@/config';

beforeAll(async () => {
  await init();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 when token is not send', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 when there is no hotel', async () => {
    const token = await generateValidToken();
    prisma.ticketType.create({
      data: {
        name: faker.name.findName(),
        price: faker.datatype.number(),
        isRemote: true,
        includesHotel: false,
      },
    });

    const response = await server.get('/hotels').set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  describe('when token is invalid', () => {
    it('should respond with status 401', async () => {
      const response = await server.get('/hotels').set({
        Authorization: 'Bearer XXX',
      });

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('when token is valid', () => {
    it('should respond with status 401', async () => {
      const response = await server.get('/hotels').set({
        Authorization: 'Bearer XXX',
      });

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });
});
