import { createApp } from './main.js'
import '../asstes/style.scss'
const { app, router,pinia } = createApp()

// if (window.__initState__) {
//     pinia.state.value = window.__initState__
// }
router.isReady().then(() => {
    app.mount('#app')
    console.log("hydrated");
})