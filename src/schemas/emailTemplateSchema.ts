// src/schemas/emailTemplateSchema.ts
import { z } from 'zod';

export const emailTemplateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  fromemail: z.string().email('Invalid from email'),
  adminemail: z.string().email('Invalid admin email'),
  subject: z.string().min(1, 'Subject is required'),
  format: z.string().min(1, 'Format is required'),
});

export type EmailTemplateFormValues = z.infer<typeof emailTemplateSchema>;
