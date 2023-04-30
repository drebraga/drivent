import bookingRepository, { UserBooking } from '@/repositories/booking-repository';
import { notFoundError } from '@/errors';
import hotelRepository from '@/repositories/hotel-repository';
import { overBooking } from '@/errors/overBooking';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function checkUserTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findUserTickets(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.status === 'RESERVED' || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote)
    throw overBooking();
}

async function checkHotel(roomId: number) {
  const room = await hotelRepository.getRoom(roomId);
  if (!room) throw notFoundError();
  const roomBookings = await bookingRepository.findRoomBookings(roomId);
  if (roomBookings.length >= room.capacity) throw overBooking();
}

async function getBooking(userId: number): Promise<UserBooking> {
  const booking = await bookingRepository.findUserBookings(userId);

  if (!booking) throw notFoundError();

  return booking;
}

async function createBooking(userId: number, roomId: number): Promise<number> {
  await checkUserTicket(userId);
  await checkHotel(roomId);
  const booking = await bookingRepository.create(userId, roomId);

  return booking.id;
}

async function updateBooking(userId: number, id: number, roomId: number): Promise<number> {
  const userBooking = await bookingRepository.findUserBookings(userId);
  if (!userBooking) throw overBooking();
  await checkHotel(roomId);
  console.log(id, roomId);
  const booking = await bookingRepository.update(id, roomId);

  return booking.id;
}

const bookingService = {
  getBooking,
  createBooking,
  updateBooking,
};

export default bookingService;
