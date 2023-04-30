import { Booking } from '@prisma/client';
import { prisma } from '@/config';

async function findUserBookings(userId: number): Promise<Booking> {
  return prisma.booking.findFirst({
    where: { userId },
  });
}

async function findRoomBookings(roomId: number): Promise<Booking[]> {
  return prisma.booking.findMany({
    where: { roomId },
  });
}

async function create(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

async function update(id: number, roomId: number) {
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
