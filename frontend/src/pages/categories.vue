<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useCategoryStore } from '@/stores/use-category-store'
import { useAlertDialogStore } from '@/stores/use-alert-dialog-store'

const { t } = useI18n()

const categoryStore = useCategoryStore()
const alertDialog = useAlertDialogStore()

const headers = computed(() => [
  { title: t('Name'), key: 'name' },
  { title: t('Type'), key: 'type' },
  { title: t('Icon'), key: 'icon' },
  { title: t('Color'), key: 'color' },
  { title: t('Default'), key: 'isDefault' },
  { title: t('Actions'), key: 'actions', sortable: false },
])

onMounted(() => categoryStore.fetchCategories())

function colorDot(color: string | null) {
  if (!color) return null
  return { backgroundColor: color, width: '20px', height: '20px', borderRadius: '50%', display: 'inline-block' }
}
</script>

<template>
  <VCard>
    <VCardTitle class="d-flex align-center pa-4">
      <span class="text-h5">{{ $t('Categories') }}</span>
      <VSpacer />
      <VBtn color="primary" prepend-icon="ri-add-line" @click="categoryStore.createCategory">{{ $t('Add Category') }}</VBtn>
    </VCardTitle>
    <VDataTable :headers="headers" :items="categoryStore.categories" :loading="categoryStore.isLoading">
      <template #item.isDefault="{ item }">
        <VChip v-if="item.isDefault" size="small" color="info">{{ $t('Default') }}</VChip>
        <span v-else>{{ $t('Custom') }}</span>
      </template>
      <template #item.color="{ item }">
        <span :style="colorDot(item.color)" v-if="item.color"></span>
        <span v-else>—</span>
      </template>
    </VDataTable>
  </VCard>
</template>
