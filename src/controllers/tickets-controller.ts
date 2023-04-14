import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PostTicket } from './../protocols';
import eventsService from '@/services/tickets-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function getTicketsType(req: Request, res: Response) {
  try {
    const ticketsType = await eventsService.getTicketsType();
    return res.status(httpStatus.OK).send(ticketsType);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send([]);
  }
}

export async function getUserTickets(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    const ticket = await eventsService.getUserTickets(userId);
    return res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send([]);
  }
}

export async function postUserTicket(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    const { ticketTypeId } = req.body as PostTicket;
    const ticket = await eventsService.postUserTicket(userId, ticketTypeId);
    return res.status(httpStatus.CREATED).send(ticket);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send([]);
  }
}
