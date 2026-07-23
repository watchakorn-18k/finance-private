<script setup lang="ts">
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

import miscMaskDark from '@images/misc/misc-mask-dark.png'
import miscMaskLight from '@images/misc/misc-mask-light.png'
import tree1 from '@images/misc/tree1.png'
import tree3 from '@images/misc/tree3.png'

import { VForm } from 'vuetify/components'

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const router = useRouter()
const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)

const isProcessing = ref(false)
const refLoginForm = ref<VForm>()
const isPasswordVisible = ref(false)
const email = ref('')
const password = ref('')

async function onClickLogin() {
  const isFormValid = await refLoginForm?.value?.validate()
  if (!isFormValid?.valid)
    return
  // TODO: implement login
  router.push('/')
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4 min-vh-100" style="background: linear-gradient(135deg, var(--color-bg) 0%, rgb(var(--v-theme-primary)) 5%, var(--color-bg) 40%, var(--color-bg) 100%);">
    <VCard
      class="auth-card"
      max-width="460"
      width="100%"
      elevation="0"
      border
      rounded="xl"
    >
      <VCardText class="pa-8">
        <div class="d-flex align-center gap-x-3 justify-center mb-6">
          <VNodeRenderer :nodes="themeConfig.app.logo" />
          <h1 class="auth-title text-h5 font-weight-bold">
            {{ themeConfig.app.title.toLocaleUpperCase() }}
          </h1>
        </div>
        <p class="mb-0 text-center text-body-2 text-medium-emphasis">
          {{ $t('Standard System') }}
        </p>
      </VCardText>

      <VCardText class="px-8 pb-8 pt-0">
        <VForm ref="refLoginForm" @submit.prevent="onClickLogin">
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="email"
                autofocus
                :label="$t('Email')"
                type="email"
                variant="outlined"
                :rules="[requiredValidator, emailValidator]"
                placeholder="your@email.com"
              />
            </VCol>

            <VCol cols="12">
              <VTextField
                v-model="password"
                :label="$t('Password')"
                variant="outlined"
                placeholder="············"
                :rules="[requiredValidator]"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <div class="d-flex align-center flex-wrap justify-space-between my-5 gap-4" />

              <VBtn block type="submit" :loading="isProcessing" size="large" rounded="lg" class="font-weight-medium">
                {{ $t('Login') }}
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <div class="d-flex gap-x-2 auth-footer-start-tree">
      <img class="d-none d-md-block" :src="tree3" :height="120" :width="67">
      <img
        class="d-none d-md-block align-self-end"
        :src="tree3"
        :height="70"
        :width="40"
      >
    </div>

    <img
      :src="tree1"
      class="auth-footer-end-tree d-none d-md-block"
      :width="97"
      :height="210"
    >

    <!-- bg img -->
    <img
      class="auth-footer-mask d-none d-md-block"
      :src="authThemeMask"
      height="172"
    >
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
