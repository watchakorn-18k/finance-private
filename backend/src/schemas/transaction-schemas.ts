import { z } from 'zod'
import { categoryTypeSchema } from './category-schemas'
import { paginationSchema } from './shared'

export const createTransactionSchema = z.object({
  categoryId: z.string().uuid(),
  amount: z.number().positive(),
  type: categoryTypeSchema,
  description: z.string().max(500).optional(),
  transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
})

export const updateTransactionSchema = z.object({
  categoryId: z.string().uuid().optional(),
  amount: z.number().positive().optional(),
  description: z.string().max(500).optional(),
  transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

export const transactionQuerySchema = paginationSchema.extend({
  month: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  categoryId: z.string().uuid().optional(),
  type: categoryTypeSchema.optional(),
})

export const transactionResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  categoryId: z.string(),
  categoryName: z.string(),
  amount: z.number(),
  type: categoryTypeSchema,
  description: z.string().nullable(),
  transactionDate: z.string(),
  createdAt: z.string(),
})

export const transactionListResponseSchema = z.object({
  data: z.array(transactionResponseSchema),
  meta: z.object({
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
  }),
})
