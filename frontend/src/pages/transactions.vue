<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useTransactionStore } from '@/stores/use-transaction-store'
import { useCategoryStore } from '@/stores/use-category-store'

const { t } = useI18n()

const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()

const filterMonth = ref(new Date().toISOString().slice(0, 7))
const filterType = ref<string>('')

const headers = computed(() => [
  { title: t('Date'), key: 'transactionDate' },
  { title: t('Type'), key: 'type' },
  { title: t('Category'), key: 'categoryName' },
  { title: t('Amount'), key: 'amount' },
  { title: t('Description'), key: 'description' },
  { title: t('Actions'), key: 'actions', sortable: false },
])

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
      <span class="text-h5">{{ $t('Transactions') }}</span>
      <VSpacer />
      <VTextField v-model="filterMonth" type="month" density="compact" hide-details style="max-width:180px" class="mr-3" />
      <VSelect v-model="filterType" :items="['', 'income', 'expense']" density="compact" hide-details style="max-width:140px" class="mr-3" />
      <VBtn color="secondary" variant="tonal" class="mr-3" @click="fetchData">{{ $t('Filter') }}</VBtn>
      <VBtn color="primary" prepend-icon="ri-add-line">{{ $t('Add Transaction') }}</VBtn>
    </VCardTitle>
    <VDataTable :headers="headers" :items="transactionStore.transactions" :loading="transactionStore.isLoading">
      <template #item.type="{ item }">
        <VChip :color="item.type === 'income' ? 'success' : 'error'" size="small">
          {{ $t(item.type) }}
        </VChip>
      </template>
      <template #item.amount="{ item }">
        <span :class="`text-${amountColor(item.type)}`">{{ formatAmount(item.amount, item.type) }}</span>
      </template>
    </VDataTable>
  </VCard>
</template>
