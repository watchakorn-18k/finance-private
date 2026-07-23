export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  userId: string
  categoryId: string
  categoryName: string
  amount: number
  type: TransactionType
  description: string | null
  transactionDate: string
  createdAt: string
}

export interface CreateTransactionInput {
  categoryId: string
  amount: number
  type: TransactionType
  description?: string
  transactionDate: string
}

export interface UpdateTransactionInput {
  categoryId?: string
  amount?: number
  description?: string
  transactionDate?: string
}

export interface TransactionFilter {
  month?: string
  categoryId?: string
  type?: TransactionType
  limit?: number
  offset?: number
}
