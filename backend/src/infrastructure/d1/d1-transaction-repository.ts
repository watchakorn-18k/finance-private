import type { TransactionRepository } from '../../domain/repositories/transaction-repository'
import type { Transaction, CreateTransactionInput, UpdateTransactionInput, TransactionFilter } from '../../domain/entities/transaction'
import type { D1Database } from '../../types'

interface TransactionRow {
  id: string
  user_id: string
  category_id: string
  category_name: string
  amount: number
  type: string
  description: string | null
  transaction_date: string
  created_at: string
}

function rowToEntity(row: TransactionRow): Transaction {
  return {
    id: row.id,
    userId: row.user_id,
    categoryId: row.category_id,
    categoryName: row.category_name,
    amount: row.amount,
    type: row.type as 'income' | 'expense',
    description: row.description,
    transactionDate: row.transaction_date,
    createdAt: row.created_at,
  }
}

export class D1TransactionRepository implements TransactionRepository {
  constructor(private readonly db: D1Database) {}

  async findManyByUserId(userId: string, filter?: TransactionFilter): Promise<{ items: Transaction[]; total: number }> {
    let where = 'WHERE t.user_id = ?'
    const params: (string | number)[] = [userId]

    if (filter?.month) {
      where += ' AND strftime(\'%Y-%m\', t.transaction_date) = ?'
      params.push(filter.month)
    }
    if (filter?.categoryId) {
      where += ' AND t.category_id = ?'
      params.push(filter.categoryId)
    }
    if (filter?.type) {
      where += ' AND t.type = ?'
      params.push(filter.type)
    }

    const countRow = await this.db.prepare(
      `SELECT COUNT(*) as count FROM transactions t ${where}`
    ).bind(...params).first<{ count: number }>()
    const total = countRow?.count ?? 0

    const limit = Math.min(filter?.limit ?? 50, 100)
    const offset = filter?.offset ?? 0

    const { results } = await this.db.prepare(
      `SELECT t.*, c.name as category_name FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       ${where} ORDER BY t.transaction_date DESC, t.created_at DESC
       LIMIT ? OFFSET ?`
    ).bind(...params, limit, offset).all<TransactionRow>()

    return { items: results.map(rowToEntity), total }
  }

  async findById(id: string): Promise<Transaction | null> {
    const row = await this.db.prepare(
      'SELECT t.*, c.name as category_name FROM transactions t LEFT JOIN categories c ON t.category_id = c.id WHERE t.id = ?'
    ).bind(id).first<TransactionRow>()
    return row ? rowToEntity(row) : null
  }

  async create(input: CreateTransactionInput & { userId: string }): Promise<Transaction> {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    await this.db.prepare(
      'INSERT INTO transactions (id, user_id, category_id, amount, type, description, transaction_date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, input.userId, input.categoryId, input.amount, input.type, input.description ?? null, input.transactionDate, now).run()
    return this.findById(id) as Promise<Transaction>
  }

  async update(id: string, input: UpdateTransactionInput): Promise<Transaction> {
    const sets: string[] = []
    const vals: (string | number | null)[] = []
    if (input.categoryId !== undefined) { sets.push('category_id = ?'); vals.push(input.categoryId) }
    if (input.amount !== undefined) { sets.push('amount = ?'); vals.push(input.amount) }
    if (input.description !== undefined) { sets.push('description = ?'); vals.push(input.description ?? null) }
    if (input.transactionDate !== undefined) { sets.push('transaction_date = ?'); vals.push(input.transactionDate) }
    if (sets.length === 0) throw new Error('No fields to update')
    vals.push(id)
    await this.db.prepare(`UPDATE transactions SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run()
    return this.findById(id) as Promise<Transaction>
  }

  async delete(id: string): Promise<void> {
    await this.db.prepare('DELETE FROM transactions WHERE id = ?').bind(id).run()
  }
}
