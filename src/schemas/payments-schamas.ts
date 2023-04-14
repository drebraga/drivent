import Joi from 'joi';
import { PaymentData } from '@/protocols';

export const paymentSchema = Joi.object<PaymentData>({
  ticketId: Joi.number().required(),
  cardData: {
    issuer: Joi.string().required(),
    number: Joi.number().required(),
    name: Joi.string().required(),
    expirationDate: Joi.string().required(),
    cvv: Joi.number().required(),
  },
});
