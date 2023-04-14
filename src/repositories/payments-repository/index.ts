import { Payment } from '@prisma/client';
import { prisma } from '@/config';

async function findPayment(ticketId: number): Promise<Payment> {
  return prisma.payment.findFirst({
    where: { ticketId },
  });
}

const ticketsRepository = {
  findPayment,
};

export default ticketsRepository;
