import type { TransactionRepository } from '../../domain/repositories/transaction-repository'
import type { Transaction, CreateTransactionInput, UpdateTransactionInput, TransactionFilter } from '../../domain/entities/transaction'

export class MemoryTransactionRepository implements TransactionRepository {
  private transactions: Map<string, Transaction> = new Map()

  async findManyByUserId(userId: string, filter?: TransactionFilter): Promise<{ items: Transaction[]; total: number }> {
    let items = Array.from(this.transactions.values()).filter(t => t.userId === userId)
    if (filter?.month) items = items.filter(t => t.transactionDate.startsWith(filter.month!))
    if (filter?.categoryId) items = items.filter(t => t.categoryId === filter.categoryId)
    if (filter?.type) items = items.filter(t => t.type === filter.type)
    const total = items.length
    const limit = Math.min(filter?.limit ?? 50, 100)
    const offset = filter?.offset ?? 0
    return { items: items.slice(offset, offset + limit), total }
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.transactions.get(id) ?? null
  }

  async create(input: CreateTransactionInput & { userId: string }): Promise<Transaction> {
    const tx: Transaction = {
      id: crypto.randomUUID(),
      userId: input.userId,
      categoryId: input.categoryId,
      categoryName: '',
      amount: input.amount,
      type: input.type,
      description: input.description ?? null,
      transactionDate: input.transactionDate,
      createdAt: new Date().toISOString(),
    }
    this.transactions.set(tx.id, tx)
    return tx
  }

  async update(id: string, input: UpdateTransactionInput): Promise<Transaction> {
    const existing = this.transactions.get(id)
    if (!existing) throw new Error('Not found')
    const updated = { ...existing, ...input }
    this.transactions.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<void> {
    this.transactions.delete(id)
  }
}
