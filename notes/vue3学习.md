

# vue3基础知识学习笔记

### setup函数

setup函数执行的时机，在beforeCreated之前。

async setup() {  await } 的用法会导致组件无法渲染，需要结合suspense异步组件进行使用

```typescript
<script setup lang="ts">
import { watch, ref} from 'vue'
function delay(){
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      const res = {
          status:1,
          data:{
            msg:'成功'
          }
      }
      resolve(res)
    },2000)
  })
}
const res = await delay()
console.log('setUp里面执行await函数',res)

const props = defineProps({
  title: String
})
</script>
// 以上代码会报错,runtime-core.esm-bundler.js:40 [Vue warn]: Component <Anonymous>: setup function returned a promise, but no <Suspense> boundary was found in the parent component tree. A component with async setup() must be nested in a <Suspense> in order to be rendered. 

```

正确的用法

```

```



**h()**函数的使用

```javascript
h('tag',{},'nodeText') // 一共接收三个参数

// 案例，动态创建一个h标签
const { createApp, h } from 'vue'

const app = createApp({})

app.component('h-tag',{
    render(){
        return h('h' + this.level, {}, this.slots.default())
    },
    props:{
        level:{
            type: Number,
            required: true
        }
    }
})
```

如何让一个计算属性可以修改值，下一个set方法

```typescript
const getName = computed(()=>{
	get(){
        
    }
    set(){}
})
```

custmRef的使用?

```typescript

```

watch与watchEffect

```typescript

```

如何消除watch的副作用

```typescript

```

自定义指令

```

```

手写简易版reactive

```

```

手写简易版ref



使用解构赋值，会使得响应式对象失去响应式，可借助**toRefs**或者**toRef**

```javascript
import { toRefs,ref } from 'vue'

setup(props){
    const { title } = toRefs(props)
    // 或者
    const title = toRef(props,'title')
    
    const state = reactive({
        count:0,
        item:[
            {
                id:1,
                todo:'something'
            }
        ]
    })
    return {
        ...toRefs(state)  // 使用toRefs 对reactive对象进行解构之后，在模板中可以直接使用对象
    }
}
```

使用**ref**定义的变量，进行修改赋值的时候需要加上.value，在使用的时候无需添加，如果想要在使用的时候不添加.value，可以借助**unref**

```javascript
import { ref, unRef } from 'vue'

setup(){
    const count = ref(0)
    
    const add = ()=>{
        count.value++
    }
    
    const subtract = ()=>{
        unRef(count)++
    }
    
    return {
        count
        add
    }
}
```

**unRef**的原理

```javascript
val = isRef(val) ? val.value : val
```

**customRef** 自定义一个响应式

```

```

**toRaw**从代理对象reactive中获取原始对象

```javascript
const foo = {}
const reactiveFoo = reactive(foo)
console.log(toRaw(reactiveFoo) === foo) // true
```

**markRaw** 标记一个对象，使得其永远不会被转为proxy

```javascript
const foo = markRaw({})
console.log(isReactive(reactive(foo))) // false
```

**shallowReactive** 非递归包装成proxy对象，仅仅包装第一级property



**shallowReadonly** 非递归包装成readonly只读，仅仅包装第一级property



通过**expose**将组件的方法暴露出去，可以通过父组件模板**ref**访问到



使用**provide**和**inject**可以方便的在多级嵌套组件里面传值



**关于style选择器**

```
:deep(div)   // 深度选择器，可以控制子选择器的样式

:slotted(div) // 插槽选择器，可以控制插槽的元素的样式

:global(.red) // 全局选择器，可以将此样式应用到全局
```

**ref与reactive的区别**

```javascript
ref(xx) = reactive（{value：xx}）
```

### 





下篇文章：手写简易版reactive和ref



下篇文章手写：结合源码解读ref，reactie，toRaw，toRef，toRefs，unRef
