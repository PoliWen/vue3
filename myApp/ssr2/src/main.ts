import { createSSRApp } from 'vue'
import { createPinia } from "pinia";
import App from './App.vue'
import router from './router'
export function createApp() {
  const app = createSSRApp(App)
  app.use(router)
  const pinia = createPinia()
  app.use(pinia)
  return { app, router, pinia  }
}