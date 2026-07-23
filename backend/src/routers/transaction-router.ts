import { Hono } from 'hono'
import { describeRoute } from 'hono-openapi'
import { resolver, validator } from 'hono-openapi'
import type { Container } from '../di/container'
import { createTransactionSchema, updateTransactionSchema, transactionQuerySchema, transactionResponseSchema, transactionListResponseSchema } from '../schemas/transaction-schemas'
import { errorResponseSchema } from '../schemas/shared'

const router = new Hono<{ Bindings: Env; Variables: { container: Container } }>()

router.get(
  '/',
  describeRoute({
    tags: ['Transactions'],
    summary: 'List user transactions',
    responses: {
      200: { description: 'Transaction list', content: { 'application/json': { schema: resolver(transactionListResponseSchema) } } },
    },
  }),
  validator('query', transactionQuerySchema),
  (c) => c.get('container').transactionHandler.list(c),
)

router.post(
  '/',
  describeRoute({
    tags: ['Transactions'],
    summary: 'Create transaction',
    responses: {
      201: { description: 'Created transaction', content: { 'application/json': { schema: resolver(transactionResponseSchema) } } },
      400: { description: 'Validation error', content: { 'application/json': { schema: resolver(errorResponseSchema) } } },
    },
  }),
  validator('json', createTransactionSchema),
  (c) => c.get('container').transactionHandler.create(c),
)

router.patch(
  '/:id',
  describeRoute({
    tags: ['Transactions'],
    summary: 'Update transaction',
    responses: {
      200: { description: 'Updated transaction', content: { 'application/json': { schema: resolver(transactionResponseSchema) } } },
      404: { description: 'Not found', content: { 'application/json': { schema: resolver(errorResponseSchema) } } },
    },
  }),
  validator('json', updateTransactionSchema),
  (c) => c.get('container').transactionHandler.update(c),
)

router.delete(
  '/:id',
  describeRoute({
    tags: ['Transactions'],
    summary: 'Delete transaction',
    responses: {
      204: { description: 'Deleted' },
      404: { description: 'Not found', content: { 'application/json': { schema: resolver(errorResponseSchema) } } },
    },
  }),
  (c) => c.get('container').transactionHandler.delete(c),
)

export { router as transactionRouter }
