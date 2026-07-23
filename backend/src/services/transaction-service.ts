import type { TransactionRepository } from '../domain/repositories/transaction-repository'
import type { CategoryRepository } from '../domain/repositories/category-repository'
import type { Transaction, CreateTransactionInput, UpdateTransactionInput, TransactionFilter } from '../domain/entities/transaction'
import { NotFoundError } from '../domain/errors'

export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async listTransactions(userId: string, filter?: TransactionFilter): Promise<{ items: Transaction[]; total: number }> {
    return this.transactionRepository.findManyByUserId(userId, filter)
  }

  async createTransaction(userId: string, input: CreateTransactionInput): Promise<Transaction> {
    const category = await this.categoryRepository.findById(input.categoryId)
    if (!category) throw new NotFoundError('Category')
    return this.transactionRepository.create({ ...input, userId })
  }

  async updateTransaction(id: string, userId: string, input: UpdateTransactionInput): Promise<Transaction> {
    const existing = await this.transactionRepository.findById(id)
    if (!existing) throw new NotFoundError('Transaction')
    if (existing.userId !== userId) throw new NotFoundError('Transaction')
    if (input.categoryId) {
      const category = await this.categoryRepository.findById(input.categoryId)
      if (!category) throw new NotFoundError('Category')
    }
    return this.transactionRepository.update(id, input)
  }

  async deleteTransaction(id: string, userId: string): Promise<void> {
    const existing = await this.transactionRepository.findById(id)
    if (!existing) throw new NotFoundError('Transaction')
    if (existing.userId !== userId) throw new NotFoundError('Transaction')
    await this.transactionRepository.delete(id)
  }
}
