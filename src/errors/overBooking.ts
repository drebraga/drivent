import { ApplicationError } from '@/protocols';

export function overBooking(): ApplicationError {
  return {
    name: 'ForbiddenError',
    message: 'Overbooking!',
  };
}
