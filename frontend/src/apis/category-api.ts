import { api } from './request'
import type { Category } from '../models/category'

const BASE = '/api/v1/categories'

export const categoryApi = {
  list: () => api<{ data: Category[] }>(BASE),
  create: (body: { name: string; type: string; icon?: string; color?: string }) =>
    api<{ data: Category }>(BASE, { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: { name?: string; icon?: string; color?: string }) =>
    api<{ data: Category }>(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (id: string) => api<null>(`${BASE}/${id}`, { method: 'DELETE' }),
}
