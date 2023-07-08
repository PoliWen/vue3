// app.js (在服务器和客户端之间共享)
import { createSSRApp } from 'vue'

export function createApp() {
  return createSSRApp({
    data: () => ({ count: 1 }),
    template: `<h3>服务端渲染</h3><button @click="count++">{{ count }}</button>`
  })
}