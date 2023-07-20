import fs from 'fs'
import path from 'path'
import { resolve } from 'path'
import express from 'express'
import { ofetch } from 'ofetch'
import { createServer as createViteServer } from 'vite'

async function createServer() {
  const app = express()

  const vite = await createViteServer({
    server: { 
      middlewareMode: true,
    },
    appType: 'custom'
  })

  // 使用 vite 的 Connect 实例作为中间件
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    const url = req.originalUrl

    try {
      // 1. 读取 index.html
      let template = fs.readFileSync(path.resolve('index.html'),'utf-8' )
  
      // 2. 应用 Vite HTML 转换。同时让html的修改支持HMR 
      template = await vite.transformIndexHtml(url, template)
  
      // 3. 加载服务器入口。vite.ssrLoadModule 将自动转换ESM 源码使之可以在 Node.js 环境中运行，而无需打包
      const { render } = await vite.ssrLoadModule('/src/server-entry.ts')
  
      // 4. 渲染应用的 HTML。这假设 entry-server.js 导出的 `render` 函数调用了适当的 SSR 框架 API。
      const { html: appHtml, __data__, __pinia__ } = await render(url)
  
      // 替换注释为准备好的html + 数据脱水
      const html = template.replace(`<!--ssr-outlet-->`, `${appHtml} <script>window.__SSR_DATA__=${__data__};window.__pinia__=${__pinia__}</script>`)
  
      // 6. 返回渲染后的 HTML。
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)

    } catch (e) {
      // 如果捕获到了一个错误，让 Vite 来修复该堆栈，这样它就可以映射回你的实际源码中。
      vite.ssrFixStacktrace(e)
      res.status(500).end(e.message)
    }
  })

  app.listen(3000)
  console.log('Your SSR server running at: http://localhost:3000')
}

createServer()