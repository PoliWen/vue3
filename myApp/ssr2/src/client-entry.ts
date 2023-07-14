import { createApp } from './main.js'
import '../asstes/style.scss'
const { app, router,pinia } = createApp()

// 初始化 pinia
if (window.__initState__) {
    pinia.state.value = JSON.parse(window.__initState__);
}
  
router.isReady().then(() => {
    app.mount('#app')
    console.log("hydrated");
})