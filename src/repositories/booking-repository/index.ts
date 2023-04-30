import { Booking, Room } from '@prisma/client';
import { prisma } from '@/config';

export type UserBooking = {
  id: number;
  Room: Room;
};

async function findUserBookings(userId: number): Promise<UserBooking> {
  return prisma.booking.findFirst({
    where: { userId },
    select: {
      id: true,
      Room: true,
    },
  });
}

async function findRoomBookings(roomId: number): Promise<Booking[]> {
  return prisma.booking.findMany({
    where: { roomId },
  });
}

async function create(userId: number, roomId: number): Promise<Booking> {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

async function update(id: number, roomId: number): Promise<Booking> {
  return prisma.booking.update({
    where: { id },
    data: { roomId },
  });
}

const bookingRepository = {
  create,
  update,
  findUserBookings,
  findRoomBookings,
};

export default bookingRepository;
