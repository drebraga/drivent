import { Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';

async function getHotels(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}

async function getHotelById(hotelId: number): Promise<Hotel & { Rooms: Room[] }> {
  return prisma.hotel.findFirst({
    where: { id: hotelId },
    include: {
      Rooms: true,
    },
  });
}

async function getRoom(roomId: number): Promise<Room> {
  return prisma.room.findFirst({
    where: { id: roomId },
  });
}

const hotelRepository = {
  getHotels,
  getHotelById,
  getRoom,
};

export default hotelRepository;
