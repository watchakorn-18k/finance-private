import type { CategoryRepository } from '../../domain/repositories/category-repository'
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../../domain/entities/category'

export class MemoryCategoryRepository implements CategoryRepository {
  private categories: Map<string, Category> = new Map()

  async findManyByUserId(userId: string): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(c => c.userId === userId)
  }

  async findById(id: string): Promise<Category | null> {
    return this.categories.get(id) ?? null
  }

  async create(input: CreateCategoryInput & { userId: string; isDefault: boolean }): Promise<Category> {
    const cat: Category = {
      id: crypto.randomUUID(),
      userId: input.userId,
      name: input.name,
      type: input.type,
      icon: input.icon ?? null,
      color: input.color ?? null,
      isDefault: input.isDefault,
      createdAt: new Date().toISOString(),
    }
    this.categories.set(cat.id, cat)
    return cat
  }

  async update(id: string, input: UpdateCategoryInput): Promise<Category> {
    const existing = this.categories.get(id)
    if (!existing) throw new Error('Not found')
    const updated = { ...existing, ...input }
    this.categories.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<void> {
    this.categories.delete(id)
  }

  async countTransactionsByCategoryId(categoryId: string): Promise<number> {
    return 0
  }
}
