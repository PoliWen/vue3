# vue3学习—组合式函数

### 组合式函数

利用组合式api可以封装有状态逻辑的函数，而像lodash或者date-fns封装的则是无状态逻辑

命令规则以use开头的驼峰命名

问题，如何让一个组合式api变成状态可共享?

```javascript
// useX
export const x = ref(0)
export function increase(){
    x.value = x.value + 1
}

// a.vue
import { x } from 'useX
console.log(x)

// b.vue
import { x } from useX
increase()
increase()
console.log(x)

// 此处的x是同一个状态吗？
```

```javascript
// useX
export function useX(){
    const x = ref(0)
    function increase(){
        x.value = x.value + 1
    }
    return{
        x,
        increase
    }
}

// a.vue
<script setup lang="ts">
import { useState} from '../useHooks/index'
const { x, increase } = useState()
</script>

<template>
  x:{{ x }}
  <button @click="increase">x</button>
</template>

// b.vue
<script setup lang="ts">
import { useState} from '../useHooks/index'
const { x, increase } = useState()
</script>

<template>
  x:{{ x }}
  <button @click="increase">x</button>
</template>

```

如何让组合式函数变成一个可共享状态的组件

```typescript
export function createSharedComposable(composable){
    let state
    return function(){
        if(!state){
            state = composable()
        }
        return state
    }
}
```

### 自定义指令

问题，在组件上绑定指令，如果组件内部有多个根节点，可以通过v-bind="$attrs"来指定传递的元素吗?



### app.config.globalProperties

app.config.globalProperties是vue.prototype的一种代替，用于注册能够被所有组件访问到的全局属性



### transition动画

transition组件里slot应用v-if，v-show以及component动态组件的切换都会触发transition的动画

动画进入阶段分为有哪几个？

enter-from，enter-active  enter-to

leave-from，leave-active，leave-to

结合animat.css和Animate.js以及GSAP动画库，可以实现几乎所有的动画效果了

为了提升网页的动画的性能，一般建议使用，transform，translate来实现动画，尽量避免触发页面的回流与重绘







