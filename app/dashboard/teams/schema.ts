import { z } from 'zod';

export const teamSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  position: z
    .string()
    .min(1, 'Position is required')
    .max(100, 'Position too long'),
  imagePath: z.string().url('Must be a valid URL'),
});

export const teamInsertSchema = teamSchema;

export const teamUpdateSchema = teamSchema.partial();

export const teamSelectSchema = teamSchema.extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TeamInsert = z.infer<typeof teamInsertSchema>;
export type TeamUpdate = z.infer<typeof teamUpdateSchema>;
export type TeamSelect = z.infer<typeof teamSelectSchema>;
