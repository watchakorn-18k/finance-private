import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'
import { cors } from 'hono/cors'
import { mountRouters } from './routers'
import { createContainer } from './di/container'
import type { Container } from './di/container'
import { MemoryUserRepository } from './infrastructure/memory/memory-user-repository'
import { MemoryCategoryRepository } from './infrastructure/memory/memory-category-repository'
import { MemoryTransactionRepository } from './infrastructure/memory/memory-transaction-repository'
import { MemoryCacheRepository } from './infrastructure/memory/memory-cache-repository'
import type { Env } from './types'

const app = new Hono<{ Bindings: Env; Variables: { container: Container } }>()

app.use('*', cors())

app.get('/health', (c) => c.json({ status: 'ok' }))

app.use('*', async (c, next) => {
  const container = createContainer({
    userRepository: new MemoryUserRepository(),
    cacheRepository: new MemoryCacheRepository(),
    categoryRepository: new MemoryCategoryRepository(),
    transactionRepository: new MemoryTransactionRepository(),
  })
  c.set('container', container)
  await next()
})

mountRouters(app)

export const handler = handle(app)
