# vue3学习—组合式函数

利用组合式api可以封装有状态逻辑的函数，而像lodash或者date-fns封装的无状态逻辑

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

如何让useX函数变成一个共享的状态的组件

