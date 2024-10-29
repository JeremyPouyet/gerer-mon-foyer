import '@/assets/main.scss'

import { ViteSSG } from 'vite-ssg'
import { createWebHistory } from 'vue-router'
import { useHead } from '@unhead/vue'

import App from '@/App.vue'
import Texts from '@/texts'
import { tooltip } from '@/tooltip'
import { Page } from '@/types'

/**
 * Set page headers (meta description and page title)
 *
 * @param {String} key Page name
 */
function setHead(key: Page) {
  const pageHeader = Texts.heads[key]

  useHead({
    meta: [{
      content: pageHeader.meta.description,
      name: 'description'
    }],
    title: pageHeader.title
  })
}

export const createApp = ViteSSG(
  App,
  {
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      ['Home',      Page.Home],
      ['Budget',    Page.Budget],
      ['Settings',  Page.Settings],
      ['History',   Page.History],
      ['Simulator', Page.Simulator],
      ['NotFound',  Page.NotFound]
    ].map(([fileName, path]) => {
      return { component: () => import(`@/views/${fileName}.vue`), path }
    }),
  },
  ({ app, router }) => {
    app.directive('tooltip', tooltip)

    router.beforeEach((to, from, next) => {
      setHead(to.path as Page)
      next()
    })

    router.addRoute({ path: '/:pathMatch(.*)*', redirect: '/not-found' })
  },
)