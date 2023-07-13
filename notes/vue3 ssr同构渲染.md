# vue3学习—同构渲染

### 什么是 CSR，SSR，同构渲染, SSG

#### SSR（server side render）服务端渲染

服务器直接返回组装好的html结构给浏览器，例如传统的php页面，asp，jsp页面

![](C:\Users\kingw\AppData\Roaming\Typora\typora-user-images\image-20230709134623364.png)

##### SSR的优点：

- 利于seo
- 首次加载白屏时间短 

##### SSR的缺点：

- 前后端代码不分离，前端开发体验差，开发效率低
- 每次加载新的页面都需要重新刷新页面，用户体验差
- 占用较多服务器资源

#### CSR（client side render）客户端渲染

服务器只返回一个基础的html结构，数据请求，html结构渲染都在浏览器端进行。

![image-20230709142045973](C:\Users\kingw\AppData\Roaming\Typora\typora-user-images\image-20230709142045973.png)

```javascript
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Vue + TS</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

##### csr的优点：

- 前后端分离，代码的可维护性高，前端开发体验强，开发效率高
- 单页面应用，使用前端路由跳转，每次加载数据不需要重新刷新页面
- 占用较少的服务器资源

##### csr的缺点：

- 首次加载白屏时间过长
- 不利于seo

#### 同构渲染

结合了CSR和SSR各自优点的解决方案，第一次页面加载返回完整的html结构，后续的交互操作全都交给浏览器进行接管

![image-20230709155122156](C:\Users\kingw\AppData\Roaming\Typora\typora-user-images\image-20230709155122156.png)

##### 优点

- 首次加载白屏时间短
- 有利于seo
- 前后端分离，利于开发体验，与项目维护
- 切换新的页面不需要重新刷新页面，拥有更好的用户体验

#### 缺点

- 增加了代码复杂度
- 服务器的负载变大了，需要做好服务器的负载管理

#### SSG静态站点生成器

页面的数据不需要经常变化，纯静态的页面，可以使用SSG技术，通常一些文档型网站，博客类型的，像VitePress就是一个使用vue驱动的静态站点生成器

### 服务端渲染的最基本实现

一个同构应用基本的目录结构应包含以下几个文件

```javascript
ssr
├─ app.js  			// 组件入口
├─ client-entry.js  // 客户端入口文件
├─ index.html		// 首页入口
├─ server-entry.js	// 服务端入口文件
└─ server.js		// 服务端启动文件
```

在app.js建立一个基本的vue组件，服务端和客户端渲染用的都是这一组件，正如同构的概念所说“一套代码既可以运行在服务端，也可以运行在客户端”。

```javascript
import { createSSRApp, ref } from 'vue'
const myComponent = {
  template: `
  <h3>{{ title }}</h3>
  <button @click="count++">{{ count }}</button>`,
  setup(){
    const count = ref(1)
    function increment(){
      count.value++
    }
    const title = 'Vue 3.0 SSR'
    return {
      title,
      count,
      increment
    }
  }
}
export function createApp() {
  return createSSRApp(myComponent)
}
```

注意这个组件我们返回的是一个用**createSSRApp**创建的vue实例对象，而不是CSR的createApp方法

server-entry.js的代码如下

```javascript
import { createApp } from './app.js'
import { renderToString } from 'vue/server-renderer'
export async function render() {
  const app  = createApp()
  const html = await renderToString(app)
  return html
}
```

客户端的入口文件主要调用了vue/server-renderer   renderToString（）方法，将vue组件渲染成HTML字符串

server.js 的代码

```javascript
import express from 'express';
import { render }from './server-entry.js';
import fs from 'fs';
const server = express();

server.get('/', async (req, res) => {
  const appHTML = await render();
  const template = fs.readFileSync('./index.html', 'utf-8');
  res.send(template.replace('<!--ssr-outlet-->', appHTML));
});

server.use(express.static('.'));

server.listen(3000, () => {
  console.log('Your SSR server running at: http://localhost:3000');
});

```

server.js  借助express启动了一个后端服务，返回的内容是由index.html和server-entry渲染的字符串，拼接而成的HTML

index.html代码如下

```javascript
<!DOCTYPE html>
<html>
<head>
<title>Vue SSR Example</title>
</head>
<script type="importmap">
    {
      "imports": {
        "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
      }
    }
</script>
<body>
    <div id="app"><!--ssr-outlet--></div>
    <script type="module" src="/client-entry.js"></script>
</body>
</html>
    
```

<!--ssr-outlet--> 占位符，在server.js中使用了entry-server.js渲染的字符串进行了替换，如下

```javascript
import { render }from './server-entry.js';
server.get('/', async (req, res) => {
  const appHTML = await render();
  const template = fs.readFileSync('./index.html', 'utf-8');
  res.send(template.replace('<!--ssr-outlet-->', appHTML));
});
```

为了在前台页面中可以使用esm模块，在index.html 使用了 script 的importmap属性，这个属性，支持在浏览器中使用esm功能。

client-entry.js的代码如下

```javascript
import { createApp } from './app.js'

createApp().mount('#app')
```

客户端入口文件是在浏览器加载页面时候开始执行，这一步的主要作用，是进行hydrate（水合），hydrate主要分为三步：

1. 将页面中服务端已经返回的DOM结构，与vue组件的虚拟dom建立联系（并不是重新渲染DOM结构）
2. 为页面中的DOM元素添加事件绑定
3. 获取后端返回在window_ssrData__的脱水数据，对组件的状态和数据进行初始化，使得客户端的数据和状态保持和服务端返回的状态一致

执行完以上三个步骤，可以说客户端已经完全接管了页面，后续的页面操作，就基本和CSR一致了。

以上就是一个服务端渲染的最基本实现，但是还存在很多其他需要解决的问题：如何支持路由？如何实现脱水与注水？如何保持状态？接下来我们继续来完善项目

### 如何支持路由，状态，以及实现脱水与注水

引入router

引入pinia

服务端进行脱水

客户端进行水合



### 结合源码讲解renderTostring的实现

服务端renderToString是如何实现的



### 结合源码讲解createSSRApp() 方法如何实现的

客户端createSSRApp()是怎么实现的

关于服务端渲染的文章

参照文章

https://juejin.cn/post/7176866248934817849



https://blog.sww.moe/post/vue3-ssr-tutorial/



https://blog.logrocket.com/adding-ssr-existing-vue-3-app/



https://blog.csdn.net/baidu_20144723/article/details/125656085



https://blog.csdn.net/baidu_20144723/article/details/125656085



### 这篇文章也是very good

https://zhuanlan.zhihu.com/p/76967335