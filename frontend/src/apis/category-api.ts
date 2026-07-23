import { request } from './request'
import type { Category } from '../models/category'

const BASE = '/api/v1/categories'

export const categoryApi = {
  list: () => request<{ data: Category[] }>(BASE),
  create: (body: { name: string; type: string; icon?: string; color?: string }) =>
    request<{ data: Category }>(BASE, { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: { name?: string; icon?: string; color?: string }) =>
    request<{ data: Category }>(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (id: string) => request<null>(`${BASE}/${id}`, { method: 'DELETE' }),
}
