import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotelById, getHotels } from '@/controllers/hotel-controller';

const hotelRouter = Router();

hotelRouter.all('/*', authenticateToken).get('/', getHotels).get('/:id', getHotelById);

export { hotelRouter };
