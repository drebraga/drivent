import { Request, Response } from 'express';
import httpStatus from 'http-status';
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
    const id = req.userId;
    const tickets = await eventsService.getUserTickets(id);
    return res.status(httpStatus.OK).send(tickets);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send([]);
  }
}

export async function postUserTicket() {
  // try {
  //   const event = await eventsService.getFirstEvent();
  //   return res.status(httpStatus.OK).send(event);
  // } catch (error) {
  //   return res.status(httpStatus.NOT_FOUND).send({});
  // }
}
