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
  <VCard elevation="0" border rounded="lg">
    <div class="d-flex align-center pa-5">
      <h5 class="text-h5 font-weight-bold mb-0">{{ $t('Categories') }}</h5>
      <VSpacer />
      <VBtn color="primary" prepend-icon="ri-add-line" rounded="lg" class="font-weight-medium" @click="categoryStore.createCategory">{{ $t('Add Category') }}</VBtn>
    </div>
    <VDivider />
    <VDataTable :headers="headers" :items="categoryStore.categories" :loading="categoryStore.isLoading">
      <template #item.isDefault="{ item }">
        <VChip v-if="item.isDefault" size="small" color="info" variant="tonal">{{ $t('Default') }}</VChip>
        <span v-else class="text-medium-emphasis">{{ $t('Custom') }}</span>
      </template>
      <template #item.color="{ item }">
        <span :style="colorDot(item.color)" v-if="item.color" class="border" style="border-width:2px!important;"></span>
        <span v-else class="text-medium-emphasis">—</span>
      </template>
    </VDataTable>
  </VCard>
</template>
