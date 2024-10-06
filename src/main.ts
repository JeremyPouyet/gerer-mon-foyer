import 'bootstrap/dist/css/bootstrap.min.css'

import './assets/main.css'

import App from './App.vue'
import { createApp } from 'vue'
import router from './router'
import { tooltip } from './tooltip'

createApp(App).use(router)
  .directive('tooltip', tooltip)
  .mount('#app')