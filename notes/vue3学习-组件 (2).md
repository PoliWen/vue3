# vue3学习—组合式函数

### 组合式函数

利用组合式api可以封装有状态逻辑的函数，而像lodash或者date-fns封装的则是无状态逻辑

命令规则以use开头的驼峰命名

如何让一个组合式api变成状态可共享?

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

实现一个useToggle函数

```javascript

<script setup lang="ts">
import { ref } from 'vue'
function useToggle(initValue:boolean){
  const state = ref(initValue)
  function toggle(){
    state.value = !state.value
  }
  return {
    state,
    toggle
  }
}
const {state,toggle} = useToggle(false)
</script>

<template>
 <p>{{state ? 'on' : 'off'}}</p>
 <p @click="toggle">Toggle State</p>
</template>
```



### 自定义指令

问题，在组件上绑定指令，如果组件内部有多个根节点，可以通过v-bind="$attrs"来指定传递的元素吗?

如何设计一个自定义指令，有哪些场景下可以使用自定义指令？

v-lazy-img，v-observer，v-fixed，v-click-outside， v-tooltips，  v-fixbold

### app.config.globalProperties

app.config.globalProperties是vue.prototype的一种代替，用于注册能够被所有组件访问到的全局属性

### transition动画

transition组件里slot应用v-if，v-show以及component动态组件的切换都会触发transition的动画

动画进入阶段分为有哪几个？

enter-from，enter-active  enter-to

leave-from，leave-active，leave-to

结合animate.css和Animate.js以及GSAP动画库，可以实现几乎所有的动画效果了

为了提升网页的动画的性能，一般建议使用，transform，translate来实现动画，尽量避免触发页面的回流与重绘

在用js钩子函数控制transition动画的时候为了避免css影响它，需要增加一个:css="false"属性

```javascript
 <Transition
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @leave="onLeave"
    :css="false"
  >
    <div class="gsap-box" v-if="show"></div>
  </Transition>
```

监听动画结束的原生事件是

```javascript
el.addEventListener('transitionend',()=>{})
```

### keep-alive

keepalive 的max属性限制缓存的最大数量，当超出了最大数量，那么最久没有被访问的缓存实例将被销毁

### teleport

当一个组件在pc端需要当做浮层来使用，在移动端需要当做内联使用，可以使用teleport的什么属性

```javascript
<Teleport :disabled="isMobile"></Teleport>
```

在vue2中如何包装一个teleport?

```javascript
<script>
    export default {
        name: 'teleport',
        props: {
            /* 移动至哪个标签内，最好使用id */
            to: {
                type: String,
                required: true
            }
        },
 
        mounted() {
            document.querySelector(this.to).appendChild(this.$el)
        },
 
        destroyed() {
            document.querySelector(this.to).removeChild(this.$el)
        },
 
        render() {
            return <div>{this.$scopedSlots.default()}</div>
        }
    }
</script>

```
