import '@/assets/main.scss'

import { ViteSSG } from 'vite-ssg'
import { createWebHistory } from 'vue-router'

import App from '@/App.vue'
import { tooltip } from '@/tooltip'

import { Page } from '@/types'

export const createApp = ViteSSG(
  App,
  {
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      [Page.Home,      '/'],
      [Page.Budget,    '/budget'],
      [Page.Settings,  '/settings'],
      [Page.History,   '/history'],
      [Page.Simulator, '/simulator'],
      [Page.NotFound,  '/not-found']
    ].map(([fileName, path]) => {
      return { component: () => import(`@/views/${fileName}.vue`), path }
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