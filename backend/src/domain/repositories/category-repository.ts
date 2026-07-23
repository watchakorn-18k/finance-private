import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../entities/category'

export interface CategoryRepository {
  findManyByUserId(userId: string): Promise<Category[]>
  findById(id: string): Promise<Category | null>
  create(input: CreateCategoryInput & { userId: string; isDefault: boolean }): Promise<Category>
  update(id: string, input: UpdateCategoryInput): Promise<Category>
  delete(id: string): Promise<void>
  countTransactionsByCategoryId(categoryId: string): Promise<number>
}
