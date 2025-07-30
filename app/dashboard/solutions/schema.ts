import { z } from 'zod';

export const solutionInsertSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  imagePath: z.string().min(1, 'Image path is required'),
  link: z.string().min(1, 'Link is required'),
});

export const solutionSelectSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  imagePath: z.string(),
  link: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Solution = z.infer<typeof solutionSelectSchema>;
export type SolutionInsert = z.infer<typeof solutionInsertSchema>;
