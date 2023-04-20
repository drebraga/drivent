import { Hotel } from '@prisma/client';
import { badRequest } from './errors';
import ticketsRepository from '@/repositories/tickets-repository';
import hotelRepository from '@/repositories/hotel-repository';
import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { paymentRequired } from '@/errors/payment-required';

async function getHotels(userId: number): Promise<Hotel[]> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findUserTickets(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.status === 'RESERVED' || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote)
    throw paymentRequired();

  const hotel = await hotelRepository.getHotels();
  if (!hotel) throw badRequest();

  return hotel;
}

async function getHotelsById(userId: number, id: number): Promise<Hotel> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findUserTickets(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.status === 'RESERVED' || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote)
    throw paymentRequired();

  const hotel = await hotelRepository.getHotelById(id);
  if (!hotel) throw badRequest();

  return hotel;
}

const hotelService = {
  getHotels,
  getHotelsById,
};

export default hotelService;
