<script setup lang="ts">
import { onMounted } from 'vue'
import { useSEO } from '@/composables/useSEO'
import { useUserStore } from '@/stores/use-user-store'

useSEO({
  title: 'Dashboard - Starter',
  description: 'Starter template overview.',
  keywords: ['dashboard', 'starter', 'template'],
})

const userStore = useUserStore()

onMounted(async () => {
  await userStore.fetchUsers()
})
</script>

<template>
  <div>
    <div class="d-flex align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-1">{{ $t('Dashboard') }}</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">{{ $t('Total Users') }}: {{ userStore.users.length }}</p>
      </div>
    </div>

    <VRow class="mb-6">
      <VCol cols="12" sm="6" lg="4">
        <VCard class="card-hoverable" elevation="0" border>
          <VCardText class="d-flex align-center gap-4 pa-5">
            <VAvatar color="primary" variant="tonal" size="52" rounded="lg">
              <VIcon icon="ri-user-3-line" size="26" />
            </VAvatar>
            <div class="stat-card">
              <div class="stat-label text-medium-emphasis">{{ $t('Total Users') }}</div>
              <div class="text-h4 stat-value font-weight-bold mt-1">{{ userStore.users.length }}</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" lg="4">
        <VCard class="card-hoverable" elevation="0" border>
          <VCardText class="d-flex align-center gap-4 pa-5">
            <VAvatar color="success" variant="tonal" size="52" rounded="lg">
              <VIcon icon="ri-exchange-dollar-line" size="26" />
            </VAvatar>
            <div class="stat-card">
              <div class="stat-label text-medium-emphasis">{{ $t('Transactions') }}</div>
              <div class="text-h4 stat-value font-weight-bold mt-1">—</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" lg="4">
        <VCard class="card-hoverable" elevation="0" border>
          <VCardText class="d-flex align-center gap-4 pa-5">
            <VAvatar color="info" variant="tonal" size="52" rounded="lg">
              <VIcon icon="ri-list-settings-line" size="26" />
            </VAvatar>
            <div class="stat-card">
              <div class="stat-label text-medium-emphasis">{{ $t('Categories') }}</div>
              <div class="text-h4 stat-value font-weight-bold mt-1">—</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VRow>
      <VCol cols="12" md="8">
        <VCard elevation="0" border :title="$t('Recent Users')">
          <VList lines="two" class="pa-0">
            <VListItem
              v-for="user in userStore.users.slice(0, 5)"
              :key="user.id"
              class="border-b-thin"
            >
              <template #prepend>
                <VAvatar color="primary" variant="tonal" size="40" rounded>
                  <span class="text-body-1 font-weight-bold">{{ user.name.charAt(0) }}</span>
                </VAvatar>
              </template>
              <VListItemTitle class="font-weight-medium">{{ user.name }}</VListItemTitle>
              <VListItemSubtitle>{{ user.email }}</VListItemSubtitle>
            </VListItem>
            <VListItem v-if="userStore.users.length === 0" class="text-center text-medium-emphasis py-6">
              {{ $t('No users yet') }}
            </VListItem>
          </VList>
          <VDivider />
          <VCardActions>
            <RouterLink :to="{ name: 'user-page' }" class="w-100">
              <VBtn variant="text" size="small" block class="font-weight-medium">{{ $t('View all users') }}</VBtn>
            </RouterLink>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
