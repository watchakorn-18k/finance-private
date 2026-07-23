export interface Category {
  id: string
  userId: string
  name: string
  type: 'income' | 'expense'
  icon: string | null
  color: string | null
  isDefault: boolean
  createdAt: string
}

export interface CreateCategoryInput {
  name: string
  type: 'income' | 'expense'
  icon?: string
  color?: string
}

export interface UpdateCategoryInput {
  name?: string
  icon?: string
  color?: string
}
