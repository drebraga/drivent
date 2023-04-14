import { Payment } from '@prisma/client';
import { notAssociatedToUser, notFoundTicket } from './errors';
import paymentsRepository from '@/repositories/payments-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { PaymentData } from '@/protocols';

async function getPayment(ticketId: number, userId: number): Promise<Payment> {
  const ticket = await ticketsRepository.findTicketById(ticketId);
  if (!ticket) throw notFoundTicket();
  if (userId !== ticket.Enrollment.userId) throw notAssociatedToUser();
  const payment = await paymentsRepository.findPayment(ticketId);
  return payment;
}

async function processPayment(data: PaymentData, userId: number): Promise<Payment> {
  const status = 'PAID';
  const ticket = await ticketsRepository.findTicketById(data.ticketId);
  if (!ticket) throw notFoundTicket();
  if (userId !== ticket.Enrollment.userId) throw notAssociatedToUser();
  const payment = await paymentsRepository.createPayment(data, ticket.TicketType.price);
  await ticketsRepository.postUserTicket(ticket.ticketTypeId, ticket.enrollmentId, status, ticket.id);
  return payment;
}

const paymentsService = {
  getPayment,
  processPayment,
};

export default paymentsService;
