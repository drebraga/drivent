import { Room, TicketType } from '@prisma/client';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import supertest from 'supertest';
import { createHotel, createRoom, createHotelTicketType, hotels, hotelById } from '../factories/hotels-factory';
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

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
      const isRemote = false;
      const includesHotel = true;
      const ticketType = await createHotelTicketType(isRemote, includesHotel);
      await createTicket(enrollment.id, ticketType.id, 'PAID');
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      await createRoom(hotel.id);
      const result = await hotels();

      const response = await server.get('/hotels').set({
        Authorization: `Bearer ${token}`,
      });
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: result[0].id,
          name: result[0].name,
          image: result[0].image,
          createdAt: result[0].createdAt.toISOString(),
          updatedAt: result[0].updatedAt.toISOString(),
        },
      ]);
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
        const isRemote = true;
        const includesHotel = true;
        const ticketType = await createHotelTicketType(isRemote, includesHotel);
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
        const isRemote = false;
        const includesHotel = false;
        const ticketType = await createHotelTicketType(isRemote, includesHotel);
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
      const isRemote = false;
      const includesHotel = true;
      const ticketType = await createHotelTicketType(isRemote, includesHotel);
      await createTicket(enrollment.id, ticketType.id, 'PAID');
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      await createRoom(hotel.id);
      const result = await hotelById(hotel.id);

      const response = await server.get(`/hotels/${hotel.id}`).set({
        Authorization: `Bearer ${token}`,
      });
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: result.id,
        name: result.name,
        image: result.image,
        createdAt: result.createdAt.toISOString(),
        updatedAt: result.updatedAt.toISOString(),
        Rooms: [
          {
            id: result.Rooms[0].id,
            name: result.Rooms[0].name,
            capacity: result.Rooms[0].capacity,
            hotelId: result.Rooms[0].hotelId,
            createdAt: result.Rooms[0].createdAt.toISOString(),
            updatedAt: result.Rooms[0].updatedAt.toISOString(),
          },
        ],
      });
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
        const isRemote = true;
        const includesHotel = true;
        const ticketType = await createHotelTicketType(isRemote, includesHotel);
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
        const isRemote = false;
        const includesHotel = false;
        const ticketType = await createHotelTicketType(isRemote, includesHotel);
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
