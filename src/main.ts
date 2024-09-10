import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import './assets/main.css'

import App from './App.vue'
import { type Component, createApp } from 'vue'
import router from './router'

const app = createApp(App as Component)

app.use(router)

app.mount('#app')