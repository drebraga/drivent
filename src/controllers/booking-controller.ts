import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const booking = await bookingService.getBooking(userId);
    return booking;
  } catch (err) {
    next(err);
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const { roomId } = req.body;
    const booking = await bookingService.createBooking(userId, roomId);
    return booking;
  } catch (err) {
    next(err);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { roomId } = req.body;
    const booking = await bookingService.updateBooking(parseInt(id), roomId);
    return booking;
  } catch (err) {
    next(err);
  }
}
