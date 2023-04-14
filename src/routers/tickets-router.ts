import { Router } from 'express';
import { getTicketsType, getUserTickets, postUserTicket } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter.get('/types', authenticateToken, getTicketsType);
ticketsRouter.get('/', authenticateToken, getUserTickets);
ticketsRouter.post('/', authenticateToken, postUserTicket);

export { ticketsRouter };
