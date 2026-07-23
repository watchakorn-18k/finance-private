import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import en from '../../locales/en.json'
import th from '../../locales/th.json'
import type { I18nLanguage } from '@layouts/types'

export default function (app: App) {
  const i18n = createI18n({
    legacy: false,
    locale: 'th',
    fallbackLocale: 'en',
    messages: {
      en,
      th,
    },
  })

  app.use(i18n)
}
