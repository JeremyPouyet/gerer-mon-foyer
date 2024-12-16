import '@/assets/main.scss'

import { ViteSSG } from 'vite-ssg'
import { createWebHistory } from 'vue-router'
import { useHead } from '@unhead/vue'

import App from '@/App.vue'
import Texts from '@/texts'
import { tooltip } from '@/tooltip'
import { Path } from '@/types'

/**
 * Set page headers (meta description and page title)
 *
 * @param {String} path Page path
 */
function setHead(path: Path) {
  const pageHeader = Texts.heads[path]

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
      ['Home',      Path.Home],
      ['Budget',    Path.Budget],
      ['Settings',  Path.Settings],
      ['History',   Path.History],
      ['Simulator', Path.Simulator],
      ['Projects',  Path.Projects],
      ['Legals',    Path.Legals],
      ['NotFound',  Path.NotFound]
    ].map(([fileName, path]) => {
      return { component: () => import(`@/views/${fileName}.vue`), path }
    }),
  },
  ({ app, router }) => {
    let currentPath = ''

    app.directive('tooltip', tooltip)

    router.beforeEach((to, from, next) => {
      // Do not change head when the user clicks on a anchor in the page
      if (currentPath === to.path) return

      currentPath = to.path
      setHead(to.path as Path)
      next()
    })

    router.addRoute({ path: '/:pathMatch(.*)*', redirect: '/not-found' })
  },
)