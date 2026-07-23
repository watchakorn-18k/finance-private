import { api } from './request'
import type { Transaction, CreateTransactionInput } from '../models/transaction'

const BASE = '/api/v1/transactions'

export interface TransactionFilters {
  month?: string
  categoryId?: string
  type?: string
  limit?: number
  offset?: number
}

export const transactionApi = {
  list: (filters?: TransactionFilters) => {
    const params = new URLSearchParams()
    if (filters?.month) params.set('month', filters.month)
    if (filters?.categoryId) params.set('categoryId', filters.categoryId)
    if (filters?.type) params.set('type', filters.type)
    if (filters?.limit) params.set('limit', String(filters.limit))
    if (filters?.offset) params.set('offset', String(filters.offset))
    const qs = params.toString()
    return api<{ data: Transaction[]; meta: { total: number; limit: number; offset: number } }>(`${BASE}${qs ? '?' + qs : ''}`)
  },
  create: (body: CreateTransactionInput) =>
    api<{ data: Transaction }>(BASE, { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<CreateTransactionInput>) =>
    api<{ data: Transaction }>(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (id: string) => api<null>(`${BASE}/${id}`, { method: 'DELETE' }),
}
