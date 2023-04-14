import { Ticket, TicketType } from '@prisma/client';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

async function getTicketsType(): Promise<TicketType[]> {
  const tickets = await ticketsRepository.findTicketsTypes();
  return tickets;
}

async function getUserTickets(userId: number): Promise<
  Ticket & {
    TicketType: TicketType;
  }
> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw new Error();
  const tickets = await ticketsRepository.findUserTickets(enrollment.id);
  if (!tickets) throw new Error();
  return tickets;
}

const ticketsService = {
  getTicketsType,
  getUserTickets,
};

export default ticketsService;
