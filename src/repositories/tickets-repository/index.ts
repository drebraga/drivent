import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function findTicketsTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

async function findUserTickets(enrollmentId: number): Promise<
  Ticket & {
    TicketType: TicketType;
  }
> {
  return prisma.ticket.findFirst({
    where: { enrollmentId },
    include: {
      TicketType: true,
    },
  });
}

const ticketsRepository = {
  findTicketsTypes,
  findUserTickets,
};

export default ticketsRepository;
