## 框架设计概览

### 声明式与命令式代码的区别

命令式描述的是做事的过程，更关注过程，如下代码

```javascript
const div = document.getElementById('div')
div.innerHTML = 'hello world'
div.addEventListener('click',()=>{alert('ok')})
```

上面这段代码描述是一个做事的过程: ”获取一个div，给div设置一个文本，点击div 弹出一个ok“

声明式代码更关注结果，结果的实现基于对逻辑的封装，封装的过程也是命令式的，vue框架帮我封装好了代码实现的过程，让我们更加关注与结果

```javascript
<div @click="()=> alert('ok')">hello world</div>
```

### 声明式代码和命令式代码的性能比较

如下代码，我们要修改div的内容

```javascript
// 修改之前
<div @click="()=>alert('ok')">hello world</div>

// 修改之后
<div @click="()=>alert('ok')">hello vue3</div>
```

使用命令式代码只需要

```
div.innerHTML='hello vue3'
```

而声明式代码需要先分析模板，找到前后的差异性，并且只更新有变化的地方，其最终实现的代码还是跟命令式代码一样。但是中间多了寻找差异化的性能消耗

因此命令式代码在理论上拥有最佳的性能，而声明式代码多了寻找差异化的性能消耗，所以声明式代码的性能是要差于命令式代码的。

但是从维护的角度来说，命令式代码需要维护代码实现的整个过程，会特别的繁琐，混乱，而命令式代码只需要关注结果，做事的过程并不需要我们关心

因此框架的设计者需要在可维护性与性能之间做出权衡，如何在保证可维护性的同时又把性能做到极致?

### 虚拟dom

**声明式代码的更新的性能 = 找出差异的性能消耗+直接修改的性能消耗**

如果能够最小化找出差异的性能消耗，就可以让声明式代码的性能无限接近与命令式代码的性能

而虚拟dom的设计让这一理论的实现成为可能

虚拟dom在更新页面是只会更新必要的元素，但innerHTML需要全量更新，这个时候虚拟的DOM的优势就体现出来了

### 运行时与编译时

```javascript
const obj = [
    tag:'div',
    children:[
        {
			tag:'span',children:'hello world'
        }
    ]
]
function render(obj,root){
    
}
Render(obj,document.body)
```

如上代码是一个运行时代码，纯运行时代码，需要用户自己维护虚拟dom，但是有时候用户觉得手写虚拟dom麻烦，用户更习惯写html模板，这时候就需要引入编译功能

```javascript
const html = `
	<div>
		<span>hello world</span>
	</div>
`
// 编译函数
function Compiler(){ }
const obj = Compiler(html)
Render(obj,document.body)
```

上面代码就是一个运行时+编译时，需要实现一个编译的函数将html转化为虚拟dom，然后在执行render函数，vue3是一个运行时+编译时的框架

### 框架设计的核心要素

1. 框架的设计要提供友好的告警和错误信息提示，以帮助用户快速的定位问题

2. 控制框架的代码体积，通过环境变量__DEV，控制打包输出的产物，在vue.global.js开发环境中包含错误信息，在生成环境中vue.global.prod.js中不包含错误提示信息
3. 做到良好的tree shaking，使用/* #________PURE____*/ 进行注释以便更好的清除副作用函数
4. 在不同场景下使用需要构建不同的打包产物，例如支持IIFE模式，ESM模式，CommonJS模式
5. 支持特性开关，例如vue3的代码做了兼容vue2的options api的代码，可以通过配置_____VUE_OPTIONS_API_来关闭该特性
6. 良好的错误处理机制
7. 良好的typeScript类型支持，vue3中做了大量的类型推导工作

vuejs中的错误处理逻辑

```javascript
const handleError = null

// utils.js
export dafault{
    foo(fn){
        callWithErrorHandling(fn)
    }
    registerErrorHandler(fn){
        handleError = fn
    }
}

function callWithErrorHandling(fn){
    try(){
       fn && fn() 
    }catch(e){
       handleError(e) 
    }
}

// 注册错误处理程序
utils.registerErrorHandler((e)=>{
    console.log(e)
})
```

### vue3的设计思路

什么是渲染器，什么是编译器？

渲染器的作用就是把虚拟DOM渲染为真实的DOM

编译器的作用就是将模板编译为渲染函数

渲染函数的基本实现

```
  const vnode = {
            tag: 'div',
            props: {
                id: 'app',
                onClick: () => alert('hello, vue3!')
            },
            children: 'click me'
        }

        function render(vnode, root) {
            const el = document.createElement(vnode.tag)
            for (const key in vnode.props) {
                // 添加事件
                if (/^on/.test(key)) {
                    el.addEventListener(
                        key.substr(2).toLowerCase(),
                        vnode.props[key]
                    )
                } else {
                    el.setAttribute(key, vnode.props[key])
                }
            }
            if (typeof vnode.children === 'string') {
                el.appendChild(document.createTextNode(vnode.children))
            } else if (Array.isArray(vnode.children)) {
                vnode.children.forEach(child => {
                    render(child, el)
                })
            }
            root && root.appendChild(el)
        }
        render(vnode, document.getElementById('app'))
```























