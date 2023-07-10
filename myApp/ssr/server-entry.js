import { createApp } from './app.js'
import { renderToString } from 'vue/server-renderer'
export async function render() {
  const app  = createApp()
  const html = await renderToString(app)
  return html
}