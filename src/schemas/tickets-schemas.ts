import Joi from 'joi';
import { PostTicket } from '@/protocols';

export const postTicketSchema = Joi.object<PostTicket>({
  ticketTypeId: Joi.number().required(),
});
