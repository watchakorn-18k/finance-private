import type { CategoryRepository } from '../../domain/repositories/category-repository'
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../../domain/entities/category'
import type { D1Database } from '../../types'

interface CategoryRow {
  id: string
  user_id: string
  name: string
  type: string
  icon: string | null
  color: string | null
  is_default: number
  created_at: string
}

function rowToEntity(row: CategoryRow): Category {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    type: row.type as 'income' | 'expense',
    icon: row.icon,
    color: row.color,
    isDefault: row.is_default === 1,
    createdAt: row.created_at,
  }
}

export class D1CategoryRepository implements CategoryRepository {
  constructor(private readonly db: D1Database) {}

  async findManyByUserId(userId: string): Promise<Category[]> {
    const { results } = await this.db.prepare(
      'SELECT * FROM categories WHERE user_id = ? ORDER BY created_at ASC'
    ).bind(userId).all<CategoryRow>()
    return results.map(rowToEntity)
  }

  async findById(id: string): Promise<Category | null> {
    const row = await this.db.prepare(
      'SELECT * FROM categories WHERE id = ?'
    ).bind(id).first<CategoryRow>()
    return row ? rowToEntity(row) : null
  }

  async create(input: CreateCategoryInput & { userId: string; isDefault: boolean }): Promise<Category> {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    await this.db.prepare(
      'INSERT INTO categories (id, user_id, name, type, icon, color, is_default, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, input.userId, input.name, input.type, input.icon ?? null, input.color ?? null, input.isDefault ? 1 : 0, now).run()
    return this.findById(id) as Promise<Category>
  }

  async update(id: string, input: UpdateCategoryInput): Promise<Category> {
    const sets: string[] = []
    const vals: (string | number | null)[] = []
    if (input.name !== undefined) { sets.push('name = ?'); vals.push(input.name) }
    if (input.icon !== undefined) { sets.push('icon = ?'); vals.push(input.icon ?? null) }
    if (input.color !== undefined) { sets.push('color = ?'); vals.push(input.color ?? null) }
    if (sets.length === 0) throw new Error('No fields to update')
    vals.push(id)
    await this.db.prepare(`UPDATE categories SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run()
    return this.findById(id) as Promise<Category>
  }

  async delete(id: string): Promise<void> {
    await this.db.prepare('DELETE FROM categories WHERE id = ?').bind(id).run()
  }

  async countTransactionsByCategoryId(categoryId: string): Promise<number> {
    const row = await this.db.prepare(
      'SELECT COUNT(*) as count FROM transactions WHERE category_id = ?'
    ).bind(categoryId).first<{ count: number }>()
    return row?.count ?? 0
  }
}
