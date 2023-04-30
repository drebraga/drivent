import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getBooking, createBooking, updateBooking } from '@/controllers';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getBooking)
  .post('/', createBooking)
  .put('/:bookingId', updateBooking);

export { bookingRouter };
