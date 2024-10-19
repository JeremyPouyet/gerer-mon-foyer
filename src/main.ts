import './assets/main.scss'

import App from './App.vue'
import { ViteSSG } from 'vite-ssg'
import { tooltip } from './tooltip'
import { createWebHistory } from 'vue-router'

export const createApp = ViteSSG(
  App,
  {
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      ['Home',      '/',                'Comment gérer le budget de mon foyer ?'] ,
      ['Budget',    '/budget',          'Gérer mon budget'],
      ['Settings',  '/settings',        'Paramètres'],
      ['History',   '/history',         'Historique de mon budget'],
      ['Simulator', '/simulator',       'Simulateur de dépenses ponctuelles'],
      ['NotFound',  '/not-found',       'Oulà, cette page n’existe pas !']
    ].map(([fileName, path, title]) => {
      return { component: () => import(`@/views/${fileName}.vue`), meta: { title }, path }
    }),
  },
  ({ app, router }) => {
    app.directive('tooltip', tooltip)

    router.addRoute({ path: '/:pathMatch(.*)*', redirect: '/not-found' })
    router.beforeEach(to => {
      document.title = to.meta.title as string
    })
  },
)