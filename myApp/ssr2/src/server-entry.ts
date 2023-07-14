import { createApp } from "./main"
import { renderToString } from 'vue/server-renderer'

export async function render(url:string) {
  const { app, router, pinia  }  = createApp()
  // 这里需要等待路由加载完成才能渲染
  app.__data__ = {}
  await router.push(url)
  await router.isReady()
  const html = await renderToString(app)
  
  return {
    html, 
    __data__: JSON.stringify(app?.__data__), 
    __state__:  JSON.stringify(pinia.state.value)
  }
}