import { z } from 'zod';

export const SystemIntegratorSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().min(1, 'Icon is required'),
  slug: z.string().min(1, 'Slug is required'),
});

export const SystemIntegratorInsertSchema = SystemIntegratorSchema;

export const SystemIntegratorUpdateSchema =
  SystemIntegratorSchema.partial().extend({
    id: z.string(),
  });

export const SystemIntegratorSelectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  slug: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type SystemIntegratorInsert = z.infer<
  typeof SystemIntegratorInsertSchema
>;
export type SystemIntegratorUpdate = z.infer<
  typeof SystemIntegratorUpdateSchema
>;
export type SystemIntegratorSelect = z.infer<
  typeof SystemIntegratorSelectSchema
>;
