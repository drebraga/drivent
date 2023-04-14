import { Ticket, TicketStatus, TicketType, Enrollment } from '@prisma/client';
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

async function findTicketById(id: number): Promise<
  Ticket & {
    Enrollment: Enrollment;
    TicketType: TicketType;
  }
> {
  return prisma.ticket.findFirst({
    where: { id },
    include: {
      Enrollment: true,
      TicketType: true,
    },
  });
}

async function postUserTicket(
  ticketTypeId: number,
  enrollmentId: number,
  status: TicketStatus,
  id?: number,
): Promise<
  Ticket & {
    TicketType: TicketType;
  }
> {
  return prisma.ticket.upsert({
    where: {
      id: id || 0,
    },
    create: {
      ticketTypeId,
      enrollmentId,
      status,
    },
    update: {
      status,
    },
    include: {
      TicketType: true,
    },
  });
}

const ticketsRepository = {
  findTicketsTypes,
  findUserTickets,
  findTicketById,
  postUserTicket,
};

export default ticketsRepository;
