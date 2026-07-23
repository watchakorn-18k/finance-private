import type { Context } from 'hono'
import type { CategoryService } from '../services/category-service'
import { getUserId, getParam, parseJson } from '../utils/request-utils'
import { createCategorySchema, updateCategorySchema } from '../schemas/category-schemas'
import { NotFoundError, ValidationError } from '../domain/errors'

export class CategoryHandler {
  constructor(private readonly categoryService: CategoryService) {}

  list = async (c: Context) => {
    const userId = await getUserId(c)
    const categories = await this.categoryService.listCategories(userId)
    return c.json({ data: categories })
  }

  create = async (c: Context) => {
    const userId = await getUserId(c)
    const body = await parseJson(c)
    const input = createCategorySchema.parse(body)
    const category = await this.categoryService.createCategory(userId, input)
    return c.json({ data: category }, 201)
  }

  update = async (c: Context) => {
    const userId = await getUserId(c)
    const id = getParam(c, 'id')
    const body = await parseJson(c)
    const input = updateCategorySchema.parse(body)
    const category = await this.categoryService.updateCategory(id, userId, input)
    return c.json({ data: category })
  }

  delete = async (c: Context) => {
    const userId = await getUserId(c)
    const id = getParam(c, 'id')
    await this.categoryService.deleteCategory(id, userId)
    return c.body(null, 204)
  }
}
