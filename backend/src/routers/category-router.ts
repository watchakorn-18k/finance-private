import { Hono } from 'hono'
import { describeRoute } from 'hono-openapi'
import { resolver, validator } from 'hono-openapi/zod'
import type { Container } from '../di/container'
import { createCategorySchema, updateCategorySchema, categoryResponseSchema, categoryListResponseSchema } from '../schemas/category-schemas'
import { errorResponseSchema } from '../schemas/shared'

const router = new Hono<{ Bindings: Env; Variables: { container: Container } }>()

router.get(
  '/',
  describeRoute({
    tags: ['Categories'],
    summary: 'List user categories',
    responses: {
      200: { description: 'Category list', content: { 'application/json': { schema: resolver(categoryListResponseSchema) } } },
    },
  }),
  (c) => c.get('container').categoryHandler.list(c),
)

router.post(
  '/',
  describeRoute({
    tags: ['Categories'],
    summary: 'Create category',
    responses: {
      201: { description: 'Created category', content: { 'application/json': { schema: resolver(categoryResponseSchema) } } },
      400: { description: 'Validation error', content: { 'application/json': { schema: resolver(errorResponseSchema) } } },
    },
  }),
  validator('json', createCategorySchema),
  (c) => c.get('container').categoryHandler.create(c),
)

router.patch(
  '/:id',
  describeRoute({
    tags: ['Categories'],
    summary: 'Update category',
    responses: {
      200: { description: 'Updated category', content: { 'application/json': { schema: resolver(categoryResponseSchema) } } },
      404: { description: 'Not found', content: { 'application/json': { schema: resolver(errorResponseSchema) } } },
    },
  }),
  validator('json', updateCategorySchema),
  (c) => c.get('container').categoryHandler.update(c),
)

router.delete(
  '/:id',
  describeRoute({
    tags: ['Categories'],
    summary: 'Delete category',
    responses: {
      204: { description: 'Deleted' },
      404: { description: 'Not found', content: { 'application/json': { schema: resolver(errorResponseSchema) } } },
    },
  }),
  (c) => c.get('container').categoryHandler.delete(c),
)

export { router as categoryRouter }
