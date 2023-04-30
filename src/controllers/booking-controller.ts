import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const booking = await bookingService.getBooking(userId);
    return res.send(booking);
  } catch (err) {
    next(err);
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const { roomId } = req.body;
    const bookingId = await bookingService.createBooking(userId, roomId);
    return res.send({ bookingId });
  } catch (err) {
    next(err);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const { bookingId } = req.params;
    const { roomId } = req.body;
    const id = await bookingService.updateBooking(userId, parseInt(bookingId), roomId);
    return res.send({ bookingId: id });
  } catch (err) {
    next(err);
  }
}
