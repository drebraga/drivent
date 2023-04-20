import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import supertest from 'supertest';
import { createHotel, createRoom } from '../factories/hotels-factory';
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';
import { prisma } from '@/config';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  describe('should respond with status 401', () => {
    it('when token is not send', async () => {
      const response = await server.get('/hotels');

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('when token is invalid', async () => {
      const token = faker.lorem.word();

      const response = await server.get('/hotels').set({
        Authorization: `Bearer ${token}`,
      });

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when there is no enrollment', async () => {
      const token = await generateValidToken();

      const response = await server.get('/hotels').set({
        Authorization: `Bearer ${token}`,
      });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when there is no ticket', async () => {
      const user = await createUser();
      await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);

      const response = await server.get('/hotels').set({
        Authorization: `Bearer ${token}`,
      });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200', async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: false,
          includesHotel: true,
        },
      });
      await createTicket(enrollment.id, ticketType.id, 'PAID');
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      await createRoom(hotel.id);

      const response = await server.get('/hotels').set({
        Authorization: `Bearer ${token}`,
      });
      expect(response.status).toBe(httpStatus.OK);
    });

    describe('should respond with status 402', () => {
      it('when there is a ticket but is not PAID', async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType();
        await createTicket(enrollment.id, ticketType.id, 'RESERVED');
        const token = await generateValidToken(user);

        const response = await server.get('/hotels').set({
          Authorization: `Bearer ${token}`,
        });

        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
      });

      it('when the ticket is remote', async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await prisma.ticketType.create({
          data: {
            name: faker.name.findName(),
            price: faker.datatype.number(),
            isRemote: true,
            includesHotel: true,
          },
        });
        await createTicket(enrollment.id, ticketType.id, 'PAID');
        const token = await generateValidToken(user);

        const response = await server.get('/hotels').set({
          Authorization: `Bearer ${token}`,
        });

        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
      });

      it('when the ticket do not include hotel', async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await prisma.ticketType.create({
          data: {
            name: faker.name.findName(),
            price: faker.datatype.number(),
            isRemote: false,
            includesHotel: false,
          },
        });
        await createTicket(enrollment.id, ticketType.id, 'PAID');
        const token = await generateValidToken(user);

        const response = await server.get('/hotels').set({
          Authorization: `Bearer ${token}`,
        });

        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
      });
    });
  });
});

describe('GET /hotels/:id', () => {
  describe('should respond with status 401', () => {
    it('when token is not send', async () => {
      const response = await server.get('/hotels/1');

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('when token is invalid', async () => {
      const token = faker.lorem.word();

      const response = await server.get('/hotels/1').set({
        Authorization: `Bearer ${token}`,
      });

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when there is no enrollment', async () => {
      const token = await generateValidToken();

      const response = await server.get('/hotels/1').set({
        Authorization: `Bearer ${token}`,
      });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when there is no ticket', async () => {
      const user = await createUser();
      await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);

      const response = await server.get('/hotels/1').set({
        Authorization: `Bearer ${token}`,
      });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200', async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: false,
          includesHotel: true,
        },
      });
      await createTicket(enrollment.id, ticketType.id, 'PAID');
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      await createRoom(hotel.id);

      const response = await server.get(`/hotels/${hotel.id}`).set({
        Authorization: `Bearer ${token}`,
      });
      expect(response.status).toBe(httpStatus.OK);
    });

    describe('should respond with status 402', () => {
      it('when there is a ticket but is not PAID', async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType();
        await createTicket(enrollment.id, ticketType.id, 'RESERVED');
        const token = await generateValidToken(user);

        const response = await server.get('/hotels/1').set({
          Authorization: `Bearer ${token}`,
        });

        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
      });

      it('when the ticket is remote', async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await prisma.ticketType.create({
          data: {
            name: faker.name.findName(),
            price: faker.datatype.number(),
            isRemote: true,
            includesHotel: true,
          },
        });
        await createTicket(enrollment.id, ticketType.id, 'PAID');
        const token = await generateValidToken(user);

        const response = await server.get('/hotels/1').set({
          Authorization: `Bearer ${token}`,
        });

        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
      });

      it('when the ticket do not include hotel', async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await prisma.ticketType.create({
          data: {
            name: faker.name.findName(),
            price: faker.datatype.number(),
            isRemote: false,
            includesHotel: false,
          },
        });
        await createTicket(enrollment.id, ticketType.id, 'PAID');
        const token = await generateValidToken(user);

        const response = await server.get('/hotels/1').set({
          Authorization: `Bearer ${token}`,
        });

        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
      });
    });
  });
});
