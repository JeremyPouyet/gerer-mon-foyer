import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ['Home',      '/',                'Comment gérer le budget de mon foyer ?'] ,
    ['Budget',    '/budget',          'Gérer mon budget'],
    ['Settings',  '/settings',        'Paramètres'],
    ['History',   '/history',         'Historique de mon budget'],
    ['Simulator', '/simulator',       'Simulateur de dépenses ponctuelles'],
    ['NotFound',  '/:pathMatch(.*)*', 'Oulà, cette pas n’existe pas !']
  ].map(([fileName, path, title]) => {
    console.log(fileName, path, title)
    return { component: () => import(`@/views/${fileName}.vue`), meta: { title }, path }
  })
})

router.beforeEach(to => { document.title = to.meta.title as string })

export default router