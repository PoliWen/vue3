# vue3学习—同构渲染

### 什么是 CSR，SSR，同构渲染, SSG

#### SSR（server side render）服务端渲染

服务器直接返回组装好的html结构给浏览器，例如传统的php页面，asp，jsp页面

![](C:\Users\kingw\AppData\Roaming\Typora\typora-user-images\image-20230709134623364.png)

##### SSR的优点：

- 利于seo
- 首次加载白屏时间短 

##### ssr的缺点：

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

结合了CSR和SSR各自优点的解决方案，第一次页面加载返回完整的html结构，后续的操作全都托管给浏览器

##### 优点

- 首次加载白屏时间短
- 有利于seo
- 前后端分离，利于开发体验，与项目维护
- 切换新的页面不需要重新刷新页面，拥有更好的用户体验

#### SSG静态站点生成器

页面的数据不需要经常变化，存静态的页面，可以使用SSG技术，通常一些文档型网站，博客类型的，像VitePress就是一个使用vue驱动的静态站点生成器

### 服务端渲染的基本实现



### 脱水与注水



### 结合源码讲解renderTostring的实现





### 结合源码讲解createSSRApp() 方法如何实现的



关于服务端渲染的文章

https://blog.sww.moe/post/vue3-ssr-tutorial/



https://blog.logrocket.com/adding-ssr-existing-vue-3-app/



https://blog.csdn.net/baidu_20144723/article/details/125656085



https://blog.csdn.net/baidu_20144723/article/details/125656085

















