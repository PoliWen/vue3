# vue3学习—最佳实践

### sfc

sfc文件的的template内容会被提取出来，传递给@vue/compiler-dom，预编译成javascript渲染函数

vuejs的打包产物，各代表什么意思，在什么场景下使用？

![image-20230302080317858](C:\Users\kingw\AppData\Roaming\Typora\typora-user-images\image-20230302080317858.png)

@vitejs/plugin-vue的作用，为vite提供vuesfc支持的官方插件

### vueRouter的基本原理

```javascript

<script setup lang="ts">
import {ref, computed } from 'vue'
import Home from './Home.vue';
import About from './About.vue';
import NotFound from './404.vue'
const routes = {
    '/': Home,
    '/about': About
}
const currentPath = ref(window.location.hash)
const currentView = computed(()=>{
    return routes[currentPath.value.slice(1) || '/'] || NotFound
})
window.addEventListener('hashchange',()=>{
    currentPath.value = window.location.hash
})

</script>

<template>
  <div>
    <a href="#/">Home</a>
    <a href="#/about">About</a>
    <a href="#/non-existent-path">Broken link</a>
  </div>

  <component :is="currentView"></component>
</template>

```

### 状态管理

如何处理组件中的共享状态，抽取组件中的共享状态，放在一个全局的单例中来管理

可以被组件任意改变的全局状态是不太容易维护的，为了确保改变状态的逻辑像状态一样集中，建议在store上定义修改方法，方法要能表达行动的意图

为什么要使用pinia代替vuex，因为，pinia提供了更简洁的api，并且提供了组合式风格的API，提供了完善的typeScript类型推导

创建一个简单的store进行状态管理

```javascript
// store.js
import { reactive } from 'vue'

export const store = reactive({
  count: 0,
  increment() {
    this.count++
  }
})
```

以上store在ssr中会导致状态污染，是在每个请求中为整个应用创建一个全新的实例，包括 router 和全局 store。然后，我们使用[应用层级的 provide 方法](https://cn.vuejs.org/guide/components/provide-inject.html#app-level-provide)来提供共享状态，并将其注入到需要它的组件中，而不是直接在组件中将其导入。

```javascript
import { createSSRApp } from 'vue'
import { createStore } from './store.js'

// 每次请求时调用
export function createApp() {
  const app = createSSRApp(/* ... */)
  // 对每个请求都创建新的 store 实例
  const store = createStore(/* ... */)
  // 提供应用级别的 store
  app.provide('store', store)
  // 也为激活过程暴露出 store
  return { app, store }
}
```

### pinia特点

- 模块热更新
- 服务端渲染支持
- 与vueDevtools集成，包括了时间轴，组件内部审查和时间旅行调试



### ssr的特点?

响应性在ssr中是不必要的，因为没有用户交互和DOM更新

哪些组件的生命周期在ssr中不会执行？

onMounted，onUpdated，unmounted

需要避免在setup根作用域下使用副作用函数

为什么定义个store在ssr渲染中，状态无法共享?

解释一下什么是跨请求状态污染，在服务端如何使用状态共享？

编写ssr代码时要注意做服务端和客户端的兼容，如window在node环境下不存在，对于浏览器特有的api需要仅在客户端的生命周期钩子函数中惰性的访问。

### 生产部署

为了在生成中使用，使得包的体积更小，vue在打包的时候去掉了哪些代码？

错误追踪

```javascript
app.config.errorHandler = (err, instance, info) => {
  // 向追踪服务报告错误
}
```

生产部署问题，打包上线之后，二级路由跳转之后刷新页面404怎么处理？

```javascript
location / {
  try_files $uri $uri/ /index.html;
}
```

### 性能优化

性能的指标

- 页面加载性能，LCP，FID等
- 页面更新性能

性能分析的工具有哪些？

- 性能检测工具，pageSpeed Insights，webPageTest
- app.config.performance
- vueDevtools

输出vuejs性能优化的几个点？

- 采用正确的架构

- 减少打包体积
- 预加载该该加载的内容
- 懒加载该加载的内容

如何减少代码的打包体积？

- 采用构建步骤
- 当心引入的依赖包导致体积膨胀，尽量引入提供Es模块的依赖包，例如lodash-es比loadsh更好
- 代码分割

问题

treeShaking有时候是无法清除一些副作用函数的，vue3中是如何标记此作用函数可以被tree shaking的？

```typescript
/*#__PUER__*/  表明调用这个函数不会产生副作用，可以使用tree-shaking移除掉
```

更新时优化

- 让props尽量稳定
- v-once渲染元素和组件一次，跳过之后的更新
- v-memo的使用

通用优化

- 大型虚拟列表优化
- 使用shallowRef，shallowReactive
- 减少不必要的组件抽象

### 无障碍访问



### 安全

如何预防xss攻击

确保使用的vue模板，始终是可信的，并且完全由自己控制

哪几种情况下会导致xss攻击？



### typescript与vue

使用propType来定义一个对象的type

```javascript
import type {propType} from 'vue'
interface Book{
    title:string
    author:string
    year:number
}
const props = defineProps({
	book: Object as PropType<Book>
})
```

withDefaults的使用

```typescript
const props = withDefaults(defineProps<{
	msg?:string
	labels?:string[]
}>(),{
	msg:'hello',
	labels:()=>['one','two']
})
```

为ref标注类型

```javascript
import type { Ref } from 'vue'
const year:Ref<string | number> = ref('2023')
// 或者
const year = ref<string | number>('2023')

// 或者
const year = ref('2023') as Ref<string | number> 
```

为computed标注类型

```javascript
const double = computed<number>(()=> count.value * 2)
```

### 组合式api

组合式api的优点

- 更好的逻辑复用
- 更灵活的代码组织
- 更好的类型推导
- 更小的生产包体积

### 深入响应式系统



### 渲染机制

编译，挂载，更新

vue模板被编译为渲染函数，运行时渲染器调用渲染函数，生成真实DOM，追踪响应式依赖，当依赖发生变化后，创建一个新的虚拟DOM，编译器遍历新的DOM数和旧的DOM树进行对比，然后将真实的DOM更新到页面中。

什么是静态提升与属性标记？

静态提升，在第一次编译时，将静态的部分提取出来，存在一个缓存的变量里面，下次渲染时，直接从缓存里面读取出来，而不要在重新渲染一次

编译器在编译模板的时候会对DOM属性进行分析，打上标记，哪些是动态属性，哪些是静态属性，渲染器在渲染Vnode的时候，就知道这些静态标记的内容是静态的，不需要更新的可以跳过去查找。





























