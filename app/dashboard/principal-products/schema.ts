import { z } from 'zod';

export const principalProductInsertSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  imagePath: z.string().min(1, 'Image path is required'),
  link: z.string().min(1, 'Link is required'),
});

export const principalProductSelectSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  imagePath: z.string(),
  link: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PrincipalProduct = z.infer<typeof principalProductSelectSchema>;
export type PrincipalProductInsert = z.infer<
  typeof principalProductInsertSchema
>;
