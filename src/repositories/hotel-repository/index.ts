import { Hotel } from '@prisma/client';
import { prisma } from '@/config';

async function getHotels(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}

async function getHotelById(id: number): Promise<Hotel> {
  return prisma.hotel.findUnique({
    where: { id },
  });
}

const hotelRepository = {
  getHotels,
  getHotelById,
};

export default hotelRepository;
