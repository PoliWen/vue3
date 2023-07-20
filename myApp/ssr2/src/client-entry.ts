import { createApp } from './main.js'
const { app, router, pinia } = createApp()

// 拿到服务端的状态数据对客户端进行注水
if (window.__pinia__) {
    pinia.state.value = window.__pinia__
}

app.mount('#app')