import { createApp } from "./main"
import { renderToString } from 'vue/server-renderer'

export async function render(url) {
  const { app } = createApp()
  const html = await renderToString(app)
  console.log(html)
  return html
}

render()