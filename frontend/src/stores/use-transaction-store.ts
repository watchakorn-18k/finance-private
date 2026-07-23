import { defineStore } from 'pinia'
import { ref } from 'vue'
import { transactionApi, type TransactionFilters } from '../apis/transaction-api'
import type { Transaction, CreateTransactionInput } from '../models/transaction'

export const useTransactionStore = defineStore('TransactionStore', () => {
  const transactions = ref<Transaction[]>([])
  const total = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTransactions(filters?: TransactionFilters) {
    isLoading.value = true; error.value = null
    try {
      const res = await transactionApi.list(filters)
      transactions.value = res.data
      total.value = res.meta.total
    } catch (e: any) { error.value = e.message; throw e }
    finally { isLoading.value = false }
  }

  async function createTransaction(body: CreateTransactionInput) {
    const res = await transactionApi.create(body)
    transactions.value.unshift(res.data)
    total.value++
    return res.data
  }

  async function updateTransaction(id: string, body: Partial<CreateTransactionInput>) {
    const res = await transactionApi.update(id, body)
    const idx = transactions.value.findIndex(t => t.id === id)
    if (idx >= 0) transactions.value[idx] = res.data
    return res.data
  }

  async function deleteTransaction(id: string) {
    await transactionApi.remove(id)
    transactions.value = transactions.value.filter(t => t.id !== id)
    total.value--
  }

  return { transactions, total, isLoading, error, fetchTransactions, createTransaction, updateTransaction, deleteTransaction }
})
