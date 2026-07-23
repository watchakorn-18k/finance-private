import { z } from 'zod'

export const categoryTypeSchema = z.enum(['income', 'expense'])

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  type: categoryTypeSchema,
  icon: z.string().optional(),
  color: z.string().optional(),
})

export const updateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
})

export const categoryResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  type: categoryTypeSchema,
  icon: z.string().nullable(),
  color: z.string().nullable(),
  isDefault: z.boolean(),
  createdAt: z.string(),
})

export const categoryListResponseSchema = z.object({
  data: z.array(categoryResponseSchema),
})
