import { z } from 'zod';

export const productInsertSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  name: z.string().min(1, 'Name is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  description: z.string().min(1, 'Description is required'),
  features: z.array(z.string()).default([]),
  applications: z.array(z.string()).default([]),
  modelPath: z.string().min(1, 'Model path is required'),
  imagePath: z.string().min(1, 'Image path is required'),
  color: z.string().min(1, 'Color is required'),
  category: z.string().min(1, 'Category is required'),
  brochureUrl: z.string().min(1, 'Brochure URL is required'),
});

export const productSelectSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  shortDescription: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  applications: z.array(z.string()),
  modelPath: z.string(),
  imagePath: z.string(),
  color: z.string(),
  category: z.string(),
  brochureUrl: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Product = z.infer<typeof productSelectSchema>;
export type ProductInsert = z.infer<typeof productInsertSchema>;
