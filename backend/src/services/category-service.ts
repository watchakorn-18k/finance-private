import type { CategoryRepository } from '../domain/repositories/category-repository'
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../domain/entities/category'
import { NotFoundError, ValidationError } from '../domain/errors'

const DEFAULT_CATEGORIES = [
  { name: 'เงินเดือน', type: 'income' as const, icon: 'ri-bank-line', color: '#4CAF50' },
  { name: 'ของขวัญ', type: 'income' as const, icon: 'ri-gift-line', color: '#FF9800' },
  { name: 'อาหาร', type: 'expense' as const, icon: 'ri-restaurant-line', color: '#FF6B6B' },
  { name: 'ค่าเดินทาง', type: 'expense' as const, icon: 'ri-roadster-line', color: '#4ECDC4' },
  { name: 'ที่พัก', type: 'expense' as const, icon: 'ri-home-line', color: '#45B7D1' },
  { name: 'บันเทิง', type: 'expense' as const, icon: 'ri-movie-line', color: '#96CEB4' },
  { name: 'สุขภาพ', type: 'expense' as const, icon: 'ri-heart-pulse-line', color: '#FFEAA7' },
  { name: 'อื่นๆ', type: 'expense' as const, icon: 'ri-more-line', color: '#DDA0DD' },
]

export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async listCategories(userId: string): Promise<Category[]> {
    return this.categoryRepository.findManyByUserId(userId)
  }

  async createCategory(userId: string, input: CreateCategoryInput): Promise<Category> {
    return this.categoryRepository.create({ ...input, userId, isDefault: false })
  }

  async updateCategory(id: string, userId: string, input: UpdateCategoryInput): Promise<Category> {
    const existing = await this.categoryRepository.findById(id)
    if (!existing) throw new NotFoundError('Category')
    if (existing.userId !== userId) throw new NotFoundError('Category')
    return this.categoryRepository.update(id, input)
  }

  async deleteCategory(id: string, userId: string): Promise<void> {
    const existing = await this.categoryRepository.findById(id)
    if (!existing) throw new NotFoundError('Category')
    if (existing.userId !== userId) throw new NotFoundError('Category')
    if (existing.isDefault) throw new ValidationError('Cannot delete default category')
    const txCount = await this.categoryRepository.countTransactionsByCategoryId(id)
    if (txCount > 0) throw new ValidationError('Cannot delete category with linked transactions')
    await this.categoryRepository.delete(id)
  }

  async seedDefaultsForUser(userId: string): Promise<void> {
    for (const cat of DEFAULT_CATEGORIES) {
      await this.categoryRepository.create({
        name: cat.name,
        type: cat.type,
        icon: cat.icon,
        color: cat.color,
        userId,
        isDefault: true,
      })
    }
  }
}
