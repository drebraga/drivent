import { Router } from 'express';
import { getPayment, processPayment } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { paymentSchema } from '@/schemas/payments-schamas';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', getPayment)
  .post('/process', validateBody(paymentSchema), processPayment);

export { paymentsRouter };
