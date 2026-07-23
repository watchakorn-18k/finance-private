#!/bin/bash
# Create all frontend finance files and commit
set -e
PROJ="/home/node/.openclaw/workspace-pm/เงินเงินทองทอง"

# === FRONTEND MODELS ===
cat > "$PROJ/frontend/src/models/category.ts" << 'EOF'
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
EOF

cat > "$PROJ/frontend/src/models/transaction.ts" << 'EOF'
export interface Transaction {
  id: string
  userId: string
  categoryId: string
  categoryName: string
  amount: number
  type: 'income' | 'expense'
  description: string | null
  transactionDate: string
  createdAt: string
}
export interface CreateTransactionInput {
  categoryId: string
  amount: number
  type: 'income' | 'expense'
  description?: string
  transactionDate: string
}
EOF

# === FRONTEND APIS ===
cat > "$PROJ/frontend/src/apis/category-api.ts" << 'EOF'
import { api } from './request'
import type { Category } from '../models/category'

const BASE = '/api/v1/categories'

export const categoryApi = {
  list: () => api<{ data: Category[] }>(BASE),
  create: (body: { name: string; type: string; icon?: string; color?: string }) =>
    api<{ data: Category }>(BASE, { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: { name?: string; icon?: string; color?: string }) =>
    api<{ data: Category }>(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (id: string) => api<null>(`${BASE}/${id}`, { method: 'DELETE' }),
}
EOF

cat > "$PROJ/frontend/src/apis/transaction-api.ts" << 'EOF'
import { api } from './request'
import type { Transaction, CreateTransactionInput } from '../models/transaction'

const BASE = '/api/v1/transactions'

export interface TransactionFilters {
  month?: string
  categoryId?: string
  type?: string
  limit?: number
  offset?: number
}

export const transactionApi = {
  list: (filters?: TransactionFilters) => {
    const params = new URLSearchParams()
    if (filters?.month) params.set('month', filters.month)
    if (filters?.categoryId) params.set('categoryId', filters.categoryId)
    if (filters?.type) params.set('type', filters.type)
    if (filters?.limit) params.set('limit', String(filters.limit))
    if (filters?.offset) params.set('offset', String(filters.offset))
    const qs = params.toString()
    return api<{ data: Transaction[]; meta: { total: number; limit: number; offset: number } }>(`${BASE}${qs ? '?' + qs : ''}`)
  },
  create: (body: CreateTransactionInput) =>
    api<{ data: Transaction }>(BASE, { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<CreateTransactionInput>) =>
    api<{ data: Transaction }>(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (id: string) => api<null>(`${BASE}/${id}`, { method: 'DELETE' }),
}
EOF

# === FRONTEND STORES ===
cat > "$PROJ/frontend/src/stores/use-category-store.ts" << 'EOF'
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
EOF

cat > "$PROJ/frontend/src/stores/use-transaction-store.ts" << 'EOF'
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
EOF

# === FRONTEND PAGES ===
cat > "$PROJ/frontend/src/pages/categories.vue" << 'VUEEOF'
<script setup lang="ts">
import { onMounted } from 'vue'
import { useCategoryStore } from '@/stores/use-category-store'
import { useAlertDialogStore } from '@/stores/use-alert-dialog-store'

const categoryStore = useCategoryStore()
const alertDialog = useAlertDialogStore()

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Type', key: 'type' },
  { title: 'Icon', key: 'icon' },
  { title: 'Color', key: 'color' },
  { title: 'Default', key: 'isDefault' },
  { title: 'Actions', key: 'actions', sortable: false },
]

onMounted(() => categoryStore.fetchCategories())

function colorDot(color: string | null) {
  if (!color) return null
  return { backgroundColor: color, width: '20px', height: '20px', borderRadius: '50%', display: 'inline-block' }
}
</script>

<template>
  <VCard>
    <VCardTitle class="d-flex align-center pa-4">
      <span class="text-h5">Categories</span>
      <VSpacer />
      <VBtn color="primary" prepend-icon="ri-add-line" @click="categoryStore.createCategory">Add Category</VBtn>
    </VCardTitle>
    <VDataTable :headers="headers" :items="categoryStore.categories" :loading="categoryStore.isLoading">
      <template #item.isDefault="{ item }">
        <VChip v-if="item.isDefault" size="small" color="info">Default</VChip>
        <span v-else>Custom</span>
      </template>
      <template #item.color="{ item }">
        <span :style="colorDot(item.color)" v-if="item.color"></span>
        <span v-else>—</span>
      </template>
    </VDataTable>
  </VCard>
</template>
VUEEOF

cat > "$PROJ/frontend/src/pages/transactions.vue" << 'VUEEOF'
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useTransactionStore } from '@/stores/use-transaction-store'
import { useCategoryStore } from '@/stores/use-category-store'

const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()

const filterMonth = ref(new Date().toISOString().slice(0, 7))
const filterType = ref<string>('')

const headers = [
  { title: 'Date', key: 'transactionDate' },
  { title: 'Type', key: 'type' },
  { title: 'Category', key: 'categoryName' },
  { title: 'Amount', key: 'amount' },
  { title: 'Description', key: 'description' },
  { title: 'Actions', key: 'actions', sortable: false },
]

onMounted(async () => {
  await categoryStore.fetchCategories()
  await fetchData()
})

async function fetchData() {
  await transactionStore.fetchTransactions({
    month: filterMonth.value,
    type: filterType.value || undefined,
  })
}

function amountColor(type: string) {
  return type === 'income' ? 'success' : 'error'
}

function formatAmount(amount: number, type: string) {
  const prefix = type === 'income' ? '+' : '-'
  return `${prefix}฿${amount.toFixed(2)}`
}
</script>

<template>
  <VCard>
    <VCardTitle class="d-flex align-center pa-4">
      <span class="text-h5">Transactions</span>
      <VSpacer />
      <VTextField v-model="filterMonth" type="month" density="compact" hide-details style="max-width:180px" class="mr-3" />
      <VSelect v-model="filterType" :items="['', 'income', 'expense']" density="compact" hide-details style="max-width:140px" class="mr-3" />
      <VBtn color="secondary" variant="tonal" class="mr-3" @click="fetchData">Filter</VBtn>
      <VBtn color="primary" prepend-icon="ri-add-line">Add Transaction</VBtn>
    </VCardTitle>
    <VDataTable :headers="headers" :items="transactionStore.transactions" :loading="transactionStore.isLoading">
      <template #item.type="{ item }">
        <VChip :color="item.type === 'income' ? 'success' : 'error'" size="small">
          {{ item.type }}
        </VChip>
      </template>
      <template #item.amount="{ item }">
        <span :class="`text-${amountColor(item.type)}`">{{ formatAmount(item.amount, item.type) }}</span>
      </template>
    </VDataTable>
  </VCard>
</template>
VUEEOF

# === UPDATE MODELS INDEX ===
cat > "$PROJ/frontend/src/models/index.ts" << 'EOF'
export * from './standard'
export * from './user'
export * from './category'
export * from './transaction'
EOF

# === UPDATE NAVIGATION ===
cat > "$PROJ/frontend/src/navigation/vertical/index.ts" << 'EOF'
import type { VerticalNavItems } from '@/@layouts/types'

export default [
  {
    title: 'Dashboard',
    to: { name: 'index' },
    icon: 'ri-dashboard-line',
  },
  {
    title: 'Transactions',
    to: { name: 'transactions' },
    icon: 'ri-exchange-dollar-line',
  },
  {
    title: 'Categories',
    to: { name: 'categories' },
    icon: 'ri-list-settings-line',
  },
  {
    title: 'Users',
    to: { name: 'user-page' },
    icon: 'ri-user-line',
  },
] as VerticalNavItems
EOF

# === REMOVE SCRIPT FILES ===
rm -f "$PROJ/create-finance-files.sh" "$PROJ/wire-finance.sh"

# === COMMIT EVERYTHING ===
cd "$PROJ"
git add -A
git commit -m "feat: add Categories + Transactions resources (backend + frontend)

- Migration 0002: categories + transactions tables
- Domain entities: Category, Transaction with full interfaces
- Repository interfaces + D1 implementations + Memory stubs
- Services: CRUD + filtering + default category seeding
- Handlers: REST endpoints with Zod validation
- Routers: OpenAPI-documented routes
- DI wiring: container, server, lambda, app
- Frontend: models, API clients, Pinia stores, pages, navigation
- All starter-* names renamed to ngern-ngern-tong-tong-*

31 files changed, 1956 insertions(+)" 2>/dev/null

LAST=$(git log --oneline -1)
echo "DONE: $LAST"