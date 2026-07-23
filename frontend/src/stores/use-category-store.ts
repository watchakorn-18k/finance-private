import { defineStore } from 'pinia'
import { ref } from 'vue'
import { categoryApi } from '../apis/category-api'
import type { Category } from '../models/category'

export const useCategoryStore = defineStore('CategoryStore', () => {
  const categories = ref<Category[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCategories() {
    isLoading.value = true; error.value = null
    try {
      const res = await categoryApi.list()
      categories.value = res.data
    } catch (e: any) { error.value = e.message; throw e }
    finally { isLoading.value = false }
  }

  async function createCategory(body: { name: string; type: string; icon?: string; color?: string }) {
    const res = await categoryApi.create(body)
    categories.value.push(res.data)
    return res.data
  }

  async function updateCategory(id: string, body: { name?: string; icon?: string; color?: string }) {
    const res = await categoryApi.update(id, body)
    const idx = categories.value.findIndex(c => c.id === id)
    if (idx >= 0) categories.value[idx] = res.data
    return res.data
  }

  async function deleteCategory(id: string) {
    await categoryApi.remove(id)
    categories.value = categories.value.filter(c => c.id !== id)
  }

  return { categories, isLoading, error, fetchCategories, createCategory, updateCategory, deleteCategory }
})
