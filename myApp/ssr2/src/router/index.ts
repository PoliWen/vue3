import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'

const router = createRouter({
  history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
  routes: [
    {
      name: 'home',
      path:'/',
      component: () => import('../pages/home/index.vue')
    },
    {
      name: 'articleList',
      path:'/article-list',
      component: () => import('../pages/article/index.vue')
    }
  ]
})

export default router