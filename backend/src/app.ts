import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { mountRouters } from './routers'
import { createContainer, type Repositories } from './di/container'
import type { Container, Env } from './types'

export function createApp(repos: Repositories): Hono<{ Bindings: Env; Variables: { container: Container } }> {
  const app = new Hono<{ Bindings: Env; Variables: { container: Container } }>()
  app.use('*', cors())
  const container = createContainer(repos)
  app.use('*', async (c, next) => {
    c.set('container', container)
    await next()
  })
  mountRouters(app)
  return app
}
