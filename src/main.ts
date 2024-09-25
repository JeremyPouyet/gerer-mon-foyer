import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import './assets/main.css'

import App from './App.vue'
import { type Component, createApp } from 'vue'
import router from './router'
import { tooltip } from './tooltip'

createApp(App as Component).use(router)
  .directive('tooltip', tooltip)
  .mount('#app')