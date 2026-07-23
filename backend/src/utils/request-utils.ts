import type { Context } from 'hono'
import { ValidationError } from '../domain/errors'

export function getUserId(c: Context): string {
  const userId = c.get('userId') || c.req.header('X-User-Id')
  if (!userId) throw new ValidationError('User ID is required')
  return userId
}

export function getParam(c: Context, name: string): string {
  const value = c.req.param(name)
  if (!value) throw new ValidationError(`${name} param is required`)
  return value
}

export async function parseJson<T>(c: Context): Promise<T> {
  try {
    return await c.req.json<T>()
  } catch {
    throw new ValidationError('Invalid JSON body')
  }
}
