import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { describeRoute } from 'hono-openapi'
import { resolver } from 'hono-openapi/zod'
import { z } from 'zod'
import { apiReference } from '@scalar/hono-api-reference'
import { mountRouters } from './routers'
import { createContainer } from './di/container'
import { D1UserRepository } from './infrastructure/d1/d1-user-repository'
import { D1CategoryRepository } from './infrastructure/d1/d1-category-repository'
import { D1TransactionRepository } from './infrastructure/d1/d1-transaction-repository'
import { KVCacheRepository } from './infrastructure/kv/kv-cache-repository'

export interface Env {
  DB: D1Database
  KV: KVNamespace
  ENVIRONMENT?: string
  JWT_SECRET?: string
}

const app = new Hono<{ Bindings: Env; Variables: { container: import('./di/container').Container } }>()

app.use('*', cors())

app.openAPIRegistry.registerComponent('securitySchemes', 'X-User-Id', {
  type: 'apiKey',
  in: 'header',
  name: 'X-User-Id',
})

app.get(
  '/health',
  describeRoute({
    tags: ['Health'],
    summary: 'Health check',
    responses: { 200: { description: 'OK', content: { 'application/json': { schema: resolver(z.object({ status: z.string() })) } } } },
  }),
  (c) => c.json({ status: 'ok' }),
)

app.get(
  '/docs',
  apiReference({
    spec: { url: '/openapi.json' },
    pageTitle: 'เงินเงินทองทอง API',
  }),
)

app.use('*', async (c, next) => {
  const container = createContainer({
    userRepository: new D1UserRepository(c.env.DB),
    cacheRepository: new KVCacheRepository(c.env.KV),
    categoryRepository: new D1CategoryRepository(c.env.DB),
    transactionRepository: new D1TransactionRepository(c.env.DB),
  })
  c.set('container', container)
  await next()
})

mountRouters(app)

export default app
