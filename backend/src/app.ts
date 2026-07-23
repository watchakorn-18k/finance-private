import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { mountRouters } from './routers'
import { createContainer } from './di/container'
import type { Repositories } from './di/container'

export function createApp(repos: Repositories): Hono {
  const app = new Hono()
  app.use('*', cors())
  const container = createContainer(repos)
  app.use('*', async (c, next) => {
    c.set('container', container)
    await next()
  })
  mountRouters(app)
  return app
}
