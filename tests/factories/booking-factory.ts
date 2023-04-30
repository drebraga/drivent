import { Booking } from '@prisma/client';
import { prisma } from '@/config';
import { UserBooking } from '@/repositories/booking-repository';

export async function createBooking(userId: number, roomId: number): Promise<UserBooking> {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
    select: {
      id: true,
      Room: true,
    },
  });
}

export async function getBooking(userId: number): Promise<Booking> {
  return prisma.booking.findFirst({
    where: { userId },
  });
}
