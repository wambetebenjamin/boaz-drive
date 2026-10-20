import { z } from 'zod';

export const bookingSchema = z.object({
  carId: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  pickUp: z.enum(['collect', 'delivery']),
  address: z.string().optional(),
  fullName: z.string().min(2).max(120),
  idNumber: z.string().min(4).max(32),
  phone: z.string().min(9).max(20),
  email: z.string().email(),
  licenceNumber: z.string().min(4).max(40),
  payment: z.enum(['mpesa', 'card']),
  recaptchaToken: z.string().min(1),
  recaptchaVersion: z.enum(['v3', 'v2']).optional(),
}).refine((value) => new Date(value.endDate) > new Date(value.startDate), { message: 'Return date must be after pickup date', path: ['endDate'] })
  .refine((value) => value.pickUp !== 'delivery' || Boolean(value.address?.trim()), { message: 'Enter a delivery address', path: ['address'] });

export type BookingInput = z.infer<typeof bookingSchema>;
