import { Payment } from '@prisma/client';
import { prisma } from '@/config';
import { PaymentData } from '@/protocols';

async function findPayment(ticketId: number): Promise<Payment> {
  return prisma.payment.findFirst({
    where: { ticketId },
  });
}

async function createPayment(data: PaymentData, price: number): Promise<Payment> {
  return prisma.payment.create({
    data: {
      ticketId: data.ticketId,
      value: price,
      cardIssuer: data.cardData.issuer,
      cardLastDigits: data.cardData.number.toString().slice(-4),
    },
  });
}

const paymentsRepository = {
  findPayment,
  createPayment,
};

export default paymentsRepository;
