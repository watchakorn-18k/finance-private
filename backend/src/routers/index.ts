import { Hono } from 'hono'
import type { Container } from '../di/container'
import type { AppEnv } from '../types'
import { createUserRouter } from './user-router'
import { categoryRouter } from './category-router'
import { transactionRouter } from './transaction-router'

export function mountRouters(app: Hono<{ Bindings: AppEnv['Bindings']; Variables: { container: Container } }>): void {
  const userRouter = createUserRouter()
  app.route('/api/v1/users', userRouter)
  app.route('/api/v1/categories', categoryRouter)
  app.route('/api/v1/transactions', transactionRouter)
}
