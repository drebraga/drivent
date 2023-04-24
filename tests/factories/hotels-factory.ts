import { Hotel, Room, TicketType } from '@prisma/client';
import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel(): Promise<Hotel> {
  return prisma.hotel.create({
    data: {
      name: faker.datatype.string(),
      image: faker.image.abstract(),
    },
  });
}

export async function createRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.datatype.string(),
      capacity: faker.datatype.number(),
      hotelId,
    },
  });
}

export async function createHotelTicketType(isRemote: boolean, includesHotel: boolean): Promise<TicketType> {
  return await prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote,
      includesHotel,
    },
  });
}

export async function hotels(): Promise<Hotel[]> {
  return await prisma.hotel.findMany({});
}

export async function hotelById(id: number): Promise<Hotel & { Rooms: Room[] }> {
  return await prisma.hotel.findFirst({
    where: { id },
    include: {
      Rooms: true,
    },
  });
}
