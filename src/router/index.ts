import { createRouter, createWebHistory } from 'vue-router'
import DomainManagement from '@/views/DomainManagement.vue'
import RecordManagement from '@/views/RecordManagement.vue'

const routes = [
  {
    path: '/',
    redirect: '/domain-management'
  },
  {
    path: '/domain-management',
    name: 'DomainManagement',
    component: DomainManagement
  },
  {
    path: '/record-management',
    name: 'RecordManagement',
    component: RecordManagement,
    props: (route: { query: { domain?: string } }) => ({ domain: route.query.domain })
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router