export interface Transaction {
  id: string
  userId: string
  categoryId: string
  categoryName: string
  amount: number
  type: 'income' | 'expense'
  description: string | null
  transactionDate: string
  createdAt: string
}
export interface CreateTransactionInput {
  categoryId: string
  amount: number
  type: 'income' | 'expense'
  description?: string
  transactionDate: string
}
