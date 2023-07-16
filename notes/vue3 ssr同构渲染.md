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

这里直接进行代码演示  https://github.com/PoliWen/vue3/tree/master/myApp/ssr2

#### 如何将虚拟Dom渲染成html

```javascript
// 虚拟dom
const Element = {
    type:'div',
    props:{
        id: 'foo',
        class: 'bar'
    },
    children:[
        {
            type:'p',
            children:'hello'
        },
        {
            type:'p',
            children:'hello'
        }
    ]
}
```

编写一个renderElementVnode()方法实现将上面虚拟dom转化为html

```javascript
// 将虚拟dom渲染成html
function renderElementVnode(Vnode){
    const { type: tag, props, children } = Vnode
    let ret = `<${tag}`
    // 处理标签属性
    if(props){
        for(const attr in props){
            ret += ` ${attr}="${props[attr]}"`
        }
    }
    // 开始标签的闭合
    ret+= '>'

    // 处理子节点
    if(typeof children === 'string'){
        ret += children
    }else if(Array.isArray(children)){
        children.forEach(child=>{
            ret += renderElementVnode(child)
        })
    }

    // 标签结束
    ret+= `</${tag}>`

    return ret
}
```

以上代码还存在以下缺陷

- 需要考虑是否是自闭合标签
- 还需要处理boolean的attribute,  有指令就代表true，无就代表false
- 还需要考虑属性安全问题，不合法的属性不能够渲染，码点范围是[0x01,0x1f]和[0x7f,0x9f]
- 需要考虑属性名称是否合法，并且需要对属性值进行HTML转义防止XSS攻击
- 在服务端渲染中，属性的key仅用于虚拟dom的diff算法，在服务端是不存在update钩子的，所以无需渲染，除此之外一些事件绑定，以及ref属性操作dom也不需要渲染。

基于以上问题，需要进一步完善代码

处理闭合标签

```javascript
const VOID_TAGS = 'area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr'.split(',')

function renderElementVnode(Vnode){
    const { type: tag, props, children } = Vnode
    const isVoidTags = VOID_TAGS.includes(tag)
    let ret = `<${tag}`
    // 处理标签属性
    if(props){
        for(const attr in props){
            ret += ` ${attr}="${props[attr]}"`
        }
    }
    // 开始标签的闭合
    ret += isVoidTags ? '/>' :'>'

    // 如果是闭合标签则直接返回结果，无需处理children，因为闭合标签没有children
    if(isVoidTags) return ret
    
    // 处理子节点
    if(typeof children === 'string'){
        ret += children
    }else if(Array.isArray(children)){
        children.forEach(child=>{
            ret += renderElementVnode(child)
        })
    }

    // 标签结束
    ret+= `</${tag}>`

    return ret
}
```

排除事件和key，以及ref属性

```javascript
const shouldIgnoreProp = ['key','ref']
function renderArr(props){
    let ret = ''
    for(const key in props){
        if(
            // 如果是key和ref，以及事件属性，则跳过渲染
            shouldIgnoreProp.includes(key) || 
            /^on[^a-z]/.test(key)
        ){
            continue
        }
        const value = props[key]
        ret += renderDynaimcAttr(key,value)
    }
    return ret
}
```

处理boolean属性和非安全属性

```html
<!-- 选中的checkbox  -->
<input type="checkbox" checked/>

<!-- 未选中的checkbox  -->
<input type="checkbox" />
```

``` javascript
const isBooleanAttr = (key) => {
    (`itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`+
    `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,` +
    `inert,loop,open,required,reversed,scoped,seamless,` +
    `checked,muted,multiple,selected`).split(',').includes(key)
}

const isSSRSafeAttrName = (key) => /[>/="'\u0009\u000a\u000c\u0020]/.test(key)

function renderDynaimcAttr(key,value){
    if(isBooleanAttr(key)){
        // 对于boolean attribute,如果值是false，这什么都不渲染，否则只需要渲染key即可
        return value === false ? '' : ` ${key}` 
    }else if(isSSRSafeAttrName){
        return value === '' ? ` ${key}` : ` ${key}="${escapeHtml(value)}"`
    }else{
        console.warn(
            `[@vue/server-render] skipped rendering unsafe attribute name : ${key}`
        )
        return ''
    }
}
```

这里用到了escapeHtml来对< ，>， "， ',等四个特殊字符进行转义，以防止XSS攻击，具体代码可以查看源码库

https://github1s.com/vuejs/core/blob/HEAD/packages/shared/src/escapeHtml.ts

以上是直接渲染虚拟dom的方法，如何渲染组件呢？

假如有如下组件

```javascript
const myComponent = {
    setup(){
        return () => {
            return {
                type: 'div',
                children: 'hello'
            }
        }
    }
}
const CompVnode = {
    type: myComponent
}
```

```javascript
function renderComponentVnode(vnode){
    let { type: { setup } } = vnode
    const render = setup()
    const subTree = render()
    return renderElementVnode(subTree)
}
```

以上代码，当我们执行myComponent的render函数的时候返回的是一个虚拟dom，可以直接调用renderElementVnode（）方法进行渲染，但是组件的render方法的执行，可能会多种结果（组件、Fragement、component，Text，string）等，如下：

```javascript
// 普通标签
const vNode = {
    type:'div'
}
// 组件
const vNode = {
    type: myComponent
}
// 片段
const vNode = {
    type:Fragement
}
// 文本节点
const vNode = {
    type:Text
}
```

封装一个renderVnode的方法对以上几种情况进行处理

```javascript
// 通过封装一个renderVnode方法来解决
function renderVnode(vnode){
    const type = typeof vnode.type
    if(type === 'string'){
        // 普通标签
        return renderElementVnode(vnode)
    }else if(type==='object' || type === 'function'){
        // 组件
        return renderComponentVnode(vnode)
    }else if(type === Text){
        // 文本节点
        
    }else if(type === Fragement){
        // 片段
    }
}
```

执行setUp函数时，应该提供setupContext对象，执行渲染函数时候应该将this指向setupContext对象，还需要初始化data，得到setup的执行结果，并且检查setup函数的返回值是函数还是setupSate，和第十二章组件的渲染流程基本一致

解决第二个问题，我们需要了解服务端渲染与客户端渲染有何不同之处

![image-20230715165926537](C:\Users\kingw\AppData\Roaming\Typora\typora-user-images\image-20230715165926537.png)

服务端只是当前应用的一个快照，不存在数据更新重新渲染的情况，因此数据无需是响应式的，服务端无需渲染真实的dom，因此render effect完成渲染这一步也不需要，也就意味着在客户端渲染的那一套生命周期钩子函数，服务端只执行到created为止。

完整的实现代码如下，这里需要继续学习12章才能完成完整的代码

```javascript

```

#### 客户端激活的原理

对于同构应用，组件代码会在服务端和客户端分别执行一次，浏览器渲染了由服务端发送过来的html之后，页面中已经存在html了，当组件代码在客户端运行时，不会在重新创建dom，而是做了以下两件事情

- 通过hydrate方法将虚拟dom和真实dom关联起来
- 为页面中的dom元素添加事件绑定

我们知道一个虚拟节点被挂载之后，为了后续程序更新不需要重新渲染dom，需要通过该虚拟节点的vnode.el 属性存储对真实dom对象的引用，因此激活做的第一步就是将虚拟dom跟真实的dom关联起来。

在服务端渲染过程中，我们已经忽略了事件的绑定，和一些相关的props，因此在激活的过程中，还需要为页面中的dom元素添加事件绑定

当客户端渲染时使用如下函数进行渲染

```javascript
const renderer = createRenderer()
renderer.render(vnode,container)
```

对于同构应用需要使用以下方法来激活

```javascript
render.hydrate(vnode,container)
```

用代码简单的模拟下

```javascript
const html = renderComponentVnode(CompVnode)
const container = document.querySelector('#app')
container.innerHTML = html

// 激活
render.hydrate(CompVnode,container)
```

在渲染器那一章节，已经讲过了，组件挂载的时候会将组件vnode与真实的dom建立联系，以便在更新的时候不需要重新渲染dom，以及在卸载的时候把dom上的事件进行移除掉。

```javascript
function mountElement(vnode,container){
    vnode.el = createElement(vnode.type)
}
```

````javascript
function unmount(vnode){
    const parent = vnode.el.parentNode
    if(parent){
       parent.removeChild(vnode.el)
    }
    // 这里需要使用真实的dom的 removeChild方法进行卸载，而不能直接使用parent.innerHTML = ''
}
````

所以hydrate的第一步也是将组件的的虚拟dom和服务器返回的真实dom进行一一的关联

![image-20230717003213485](C:\Users\kingw\AppData\Roaming\Typora\typora-user-images\image-20230717003213485.png)

激活的原理就是递归的在真实DOM与虚拟DOM之间建立联系，从挂载容器的第一个子节点开始处理

```javascript
function hydrate(vnode,container){
    hydrateNode(container.firstChild,vnode)
}
```

```javascript
// 传入两个参数，一个是真实的dom，一个是虚拟dom节点
function hydrateNode(node,vnode){
    const { type } = vnode
    vnode.el = node
    if(typeof type === 'Object'){
        mountComponent(vnode,container,null)
    }else if(typeof type === 'string'){
        if(node.nodeType !== 1){
            console.log('mismatch')
            console.log('服务端渲染的真实DOM节点是', node)
            console.log('客户端渲染的虚拟DOM节点是', vnode)
        }
    }else{
        hydrateElement(node,vnode)
    }
    // 返回当前节点的下一个兄弟节点
    return node.nextSibling
}
```

```javascript
function hydrateElement(el,vnode){
    if(vnode.props){
        for(const key in vnode.props){
            if(/^on/.test(key)){
                patchProps(el,key,null,vnode.props[key])
            }
        }
    }
    // 递归激活子加点
    if(Array.isArray(vnode.children)){
        let nextNode = el.firstChild
        const len = vnode.children.length
        for(let i=0;i<len;i++){
            // 通过递归调用，将所有的子节点都进行激活
            nextNode = hydrateNode(nextNode,vnode.children[i])
        }
    }
}
```

patchProps在渲染器那一章节已经讲过了

#### 服务端renderToString源码实现漫游



#### 同构的原理



### 源码createSSRApp()的实现漫游 



 #### 编写同构代码应该注意什么





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