import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelService from '@/services/hotel-service';

export async function getHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const hotels = await hotelService.getHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (err) {
    next(err);
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const { hotelId } = req.params;
    const hotel = await hotelService.getHotelsById(userId, parseInt(hotelId));
    return res.status(httpStatus.OK).send(hotel);
  } catch (err) {
    next(err);
  }
}
