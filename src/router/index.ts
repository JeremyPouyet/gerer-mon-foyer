import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ['Home',                '/'] ,
    ['ExpenseDistribution', '/expense-distribution'],
    ['DataManagement',      '/data-management'],
    ['History',             '/history'],
    ['Simulator',           '/simulator'],
    ['NotFound',            '/:pathMatch(.*)*']
  ].map(([fileName, path]) => ({ component: () => import(`@/views/${fileName}.vue`), path }))
})