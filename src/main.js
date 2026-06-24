import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/main.css' 
import router from './router/index.js'

const pinia = createPinia()

createApp(App) .use(pinia) .use(router) .mount('#app')
