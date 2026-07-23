import type { Transaction, CreateTransactionInput, UpdateTransactionInput, TransactionFilter } from '../entities/transaction'

export interface TransactionRepository {
  findManyByUserId(userId: string, filter?: TransactionFilter): Promise<{ items: Transaction[]; total: number }>
  findById(id: string): Promise<Transaction | null>
  create(input: CreateTransactionInput & { userId: string }): Promise<Transaction>
  update(id: string, input: UpdateTransactionInput): Promise<Transaction>
  delete(id: string): Promise<void>
}
