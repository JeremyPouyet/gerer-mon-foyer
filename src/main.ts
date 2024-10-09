import './assets/main.scss'

import App from './App.vue'
import { createApp } from 'vue'
import router from './router'
import { tooltip } from './tooltip'

createApp(App).use(router)
  .directive('tooltip', tooltip)
  .mount('#app')