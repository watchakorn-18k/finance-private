import type { D1Database, KVNamespace } from '@cloudflare/workers-types'
import type { Container } from './di/container'

// Cloudflare Workers bindings (declared in wrangler.jsonc)
export interface Env {
  DB: D1Database
  KV: KVNamespace
  ENVIRONMENT?: string
  JWT_SECRET?: string
}

export interface Bindings {
  DB: D1Database
  KV: KVNamespace
  ENVIRONMENT?: string
}

export interface Variables {
  container: Container
}

export type AppEnv = {
  Bindings: Env
  Variables: Variables
}

// Re-export for convenience
export type { D1Database, KVNamespace, Container }
