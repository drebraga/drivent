import { Payment } from '@prisma/client';
import { notAssociatedToUser, notFoundTicket } from './errors';
import paymentsRepository from '@/repositories/payments-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getPayment(ticketId: number, userId: number): Promise<Payment> {
  const ticket = await ticketsRepository.findTicketById(ticketId);
  if (!ticket) throw notFoundTicket();
  if (userId !== ticket.Enrollment.userId) throw notAssociatedToUser();
  const payment = await paymentsRepository.findPayment(ticketId);
  return payment;
}

const paymentsService = {
  getPayment,
};

export default paymentsService;
