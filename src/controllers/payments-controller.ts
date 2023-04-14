import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import paymentsService from '@/services/payments-service';
import { AuthenticatedRequest } from '@/middlewares';
import { PaymentData } from '@/protocols';

export async function getPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { ticketId } = req.query as Record<string, string>;
    const userId = req.userId;
    if (!ticketId) return res.sendStatus(httpStatus.BAD_REQUEST);
    const payment = await paymentsService.getPayment(parseInt(ticketId), userId);
    return res.status(httpStatus.OK).send(payment);
  } catch (err) {
    next(err);
  }
}

export async function processPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const data = req.body as PaymentData;
    const userId = req.userId;
    const payment = await paymentsService.processPayment(data, userId);
    return res.status(httpStatus.OK).send(payment);
  } catch (err) {
    next(err);
  }
}
