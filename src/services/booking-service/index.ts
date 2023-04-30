import { Booking } from '@prisma/client';
import bookingRepository from '@/repositories/booking-repository';
import { notFoundError } from '@/errors';
import hotelRepository from '@/repositories/hotel-repository';
import { overBooking } from '@/errors/overBooking';

async function getBooking(userId: number): Promise<Booking> {
  const booking = await bookingRepository.findUserBookings(userId);

  if (!booking) throw notFoundError();

  return booking;
}

async function createBooking(userId: number, roomId: number) {
  const room = await hotelRepository.getRoom(roomId);
  if (!room) throw notFoundError;
  const roomBookings = await bookingRepository.findRoomBookings(roomId);
  if (!roomBookings.length) throw overBooking();
  await bookingRepository.create(userId, roomId);
}

async function updateBooking(id: number, roomId: number) {
  const room = await hotelRepository.getRoom(roomId);
  if (!room) throw notFoundError;
  const roomBookings = await bookingRepository.findRoomBookings(roomId);
  if (!roomBookings.length) throw overBooking();
  await bookingRepository.update(id, roomId);
}

const bookingService = {
  getBooking,
  createBooking,
  updateBooking,
};

export default bookingService;
