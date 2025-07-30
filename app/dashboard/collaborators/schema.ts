import { z } from 'zod';

export const collaboratorInsertSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  longDescription: z.string().min(1, 'Long description is required'),
  logo: z.string().min(1, 'Logo is required'),
  website: z.string().url('Website must be a valid URL'),
});

export type CollaboratorInsert = z.infer<typeof collaboratorInsertSchema>;
