import { Router } from 'express';
import { getTicketsType, getUserTickets, postUserTicket } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { postTicketSchema } from '@/schemas/tickets-schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketsType)
  .get('/', getUserTickets)
  .post('/', validateBody(postTicketSchema), postUserTicket);

export { ticketsRouter };
