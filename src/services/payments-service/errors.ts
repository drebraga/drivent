import { ApplicationError } from '@/protocols';

export function notAssociatedToUser(): ApplicationError {
  return {
    name: 'UnauthorizedError',
    message: 'this ticket is not associated to this user',
  };
}

export function notFoundTicket(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'ticket not found',
  };
}

export function nonTicketId(): ApplicationError {
  return {
    name: 'BadRequest',
    message: 'no ticketId detected',
  };
}
