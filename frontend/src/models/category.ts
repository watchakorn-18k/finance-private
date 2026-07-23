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
