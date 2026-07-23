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
