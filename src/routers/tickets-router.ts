import { Router } from 'express';
import { getTicketsType, getUserTickets, postUserTicket } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { postTicketSchema } from '@/schemas/tickets-schemas';

const ticketsRouter = Router();

ticketsRouter.get('/types', authenticateToken, getTicketsType);
ticketsRouter.get('/', authenticateToken, getUserTickets);
ticketsRouter.post('/', authenticateToken, validateBody(postTicketSchema), postUserTicket);

export { ticketsRouter };
