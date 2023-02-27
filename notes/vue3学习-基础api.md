# vue3基础知识学习笔记

### setup函数

setup函数执行的时机，在beforeCreated之前。

async setup() {  await } 的用法会导致组件无法渲染，需要结合suspense异步组件使用

```typescript
// setUp.vue
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

正确的用法，在调用此组件的父组件中包裹一个Suspense组件

```typescript
<script setup lang="ts">
import setUp from './components/setUp.vue'
</script>

<template>
  <Suspense>
      <setUp></setUp>
      <template #fallback>
        isLoading
      </template>
  </Suspense>
</template>
```

### 响应式系统

ref，reactive，unRef，toRef，toRefs，toRaw，markRaw，shallowRef，shallowReactive

### shallowReactive的基础实现

```typescript
const reactiveHandler ={
    get(target,prop){
        console.log('拦截get()',prop)
        return Reflect.get(target,prop)
    },
    set(target,prop,val){
        console.log('劫持set()',prop,val)
        return Reflect.set(target,prop,val)
    },
    deleteProperty(target,prop){
        console.log('劫持delete',prop)
        return Reflect.deleteProperty(target,prop)
    }
}
function shallowReactive(target:Object){
    if(target && typeof target==='object'){
        return new Proxy(target,reactiveHandler)
    }
    return target
}

const person = shallowReactive({
    name: '张三',
    age: 30,
    son: {
        name:'小张',
        age: 3
    }
})
person.name = '王五'
console.log(person.name)
delete person.name
```

以上代码是浅响应，可以劫持对象的第一级属性，嵌套属性无法劫持的。需要深度劫持，要进行递归遍历

#### reactive的基础实现，

在shallowReactive的基础上进行递归拦截

```typescript
function reactive(target:Object){
    if(target && typeof target === 'object'){
       Object.entries(target).forEach(([key,value])=>{
            if(typeof value === 'object'){
                target[key] = reactive(value)  // 递归监听子元素
            }
       })
        return new Proxy(target,reactiveHandler)
    }
    return target
}
```

#### ref的基础实现

```typescript
function ref(target:string | number | boolean){
    return {
        _value:target,
        get value(){
            console.log('劫持get')
            return this._value
        },
        set value(val){
            console.log('劫持set')
            this._value = val
        }
    }
}
const x = ref(0)
console.log(x.value)
x.value = 2
console.log(x.value)
```

js中get和set可以指定属性名，当访问设置这个属性名的时候就会触发get和set方法

### toRef与toRefs

使用解构赋值，会使得响应式对象失去响应式，可借助**toRefs**或者**toRef**包裹之后在进行解构

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

#### unRef的原理

```javascript
val = isRef(val) ? val.value : val
```

#### **customRef** 的使用

```typescript

<script setup lang="ts">
import { customRef } from 'vue'
function useDebouncedRef<T>(value:T, delay = 200){
    let timer:number
    return customRef((track,trigger)=>{
        return {
            get(){
                track()
                return value
            },
            set(newVal: T){
                clearTimeout(timer)
                timer = setTimeout(() => {
                    value = newVal
                    trigger()
                }, delay);
            }
        }
    })
}
const name = useDebouncedRef('刘德华')
console.log(name.value)
</script>

<template>
    <h1>用customRef定义一个防抖函数</h1>
    <input type="text" v-model="name" placeholder="输入名称">
    {{ name }}
</template>
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

### h()函数的使用

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

### 计算属性

如何让一个计算属性可以修改值，增加一个set方法

```typescript

<script setup lang="ts">
import { computed, ref, watch} from 'vue'
const firstName = ref('刘')
const lastName = ref('德华')
const fullName = computed({
    get(){
        return firstName.value + lastName.value
    },
    set(newVal){
        [firstName.value,lastName.value] = newVal.split(' ')
    }
})
watch(fullName,(val)=>{
    console.log(val)
})
setTimeout(()=>{fullName.value = '王 麻子'},1000)
</script>

<template>
  姓：{{ firstName }}<br>
  名：{{ lastName }}<br>
  姓名: {{ fullName }}<br>
  <input type="text" v-model="fullName">
</template>
```

### watch与watchEffect

watch用来监听数据的变化，可以直接监听ref值，监听reactive和computed需要写成函数的形式，不加immediate第一次不会执行，支持数组的形式，

watchEffect第一次也会进行监听，不需要指定监听的对象，只要watcheffect函数体里面所有依赖的响应式数据发生变化，就会触发执行。watchEffect有时候可以减少代码量，但可能导致监听关系不是很明确。

```typescript
// 监听单个ref
const count = ref(0)
watch(count,(newVal,oldVal)=>{
  console.log(`count的值发生了变化,变化前的值是${oldVal},现在的值是${newVal}`)
},{immediate:true})

// 监听reactive
const person = reactive({
    name: '张三',
    age: 30,
    son:{
        name: '张子',
        age: 2
    }
})

// 监听整个reactive对象，是深层监听，是深层次监听，不要加deep
watch(person,(newVal,oldVal)=>{
    console.log(newVal.son.age);
    console.log(oldVal.son.age);
})
person.son.age = 10

// 也可以监听reactive的某一个属性，需要写成函数的形式
watch(()=> person.name,(newVal,oldVal)=>{
    console.log(newVal,oldVal)
})

// 监听计算属性的值
const double = computed(()=>{
    return count.value*2
})

// 监听计算属性，直接监听值，不需要写成函数的形式
watch(double,(newVal,oldVal)=>{
    console.log(`监听计算属性double的值变化,变化前的值是${oldVal},现在的值是${newVal}`)
})

// 当ref是一个对象的时候
const name = ref({
    firstName:'刘',
    lastName:'德华'
})
// 监听整个对象
watch(name.value,(val)=>{
    console.log(val.firstName)
})

// 也可以添加deep参数进行监听
watch(name,(val)=>{
    console.log('当ref为一个对象的时候使用deep监听',val)
},{deep:true})

// 监听某一个值
watch(()=> name.value.firstName,(val)=>{
    console.log(val)
})

// 写成数组的形式,缺点不够单一职责
watch([count,()=> person.name],([newCount,newName])=>{
    console.log('数组',newCount,newName)
})

// watchEffect第一次就会执行，不需要写具体的监听的值,函数体内任何一个具有响应式的数据发生变化都会触发执行
watchEffect(()=>{
    console.log('count发生了变化就执行watchEffect',unref(count))
    console.log('person.name的值也发生了变化',person.name)
})

```

watch的getter函数可以对数据进行处理

```typescript
const x = ref(1)
watch(()=> x.value + '123',(val)=>{
    console.log('value的值可以修改',val)  // 返回结果2123
})
setTimeout(() => x.value++,1000)
```

如何停止监听一个watch，如何消除watch的副作用？

- watch与watchEffect执行之后会返回一个函数，执行这个函数，可以停止watch继续进行监听

  ```typescript
  const count = ref(0)
  const unwatch = watch(count,(newVal,oldVal)=>{
    console.log(`count的值发生了变化,变化前的值是${oldVal},现在的值是${newVal}`)
    if(newVal > 10){
      unwatch()
    }
  })
  
  const stopWatch = watchEffect(()=>{
      console.log('watchEffect,监听count',count.value)
      if(count.value > 10){
          stopWatch()
      }
  })
  
  ```

- 使用effectScope消除副作用

  > **effectScope**用来收集副作用函数，并可以进行集中清除

  ```typescript
  <script setup lang="ts">
      const count = ref(0)
      const scope = effectScope()
      scope.run(()=>{
          watch(count,(newVal,oldVal) => {
               console.log(`count的值发生了变化,变化前的值是${oldVal},现在的值是${newVal}`)
          })
          watchEffect(()=> {
              console.log('watchEffect,监听count',count.value)
          })    
      })
  
      function increment(){
          count.value++
          if(unref(count) > 10){
              scope.stop()
          }
      }
  </script>
  
  <template>
    <p>effectScope主要用来收集副作用函数，并且进行集中清除</p>
    <button @click="increment">增加{{count}}</button>
  </template>
  ```

想在watch函数里面立即访问到更新后的dom可以使用 { flush:post }

```typescript
watch(source,callback,{flush:post})
```

### 自定义指令

自定义指令的使用 

````typescript
const vFocus = {
	mounted(el,binding){
		el.focus()
	}
}

const vColor = {
    mounted:(el:HTMLElement, binding)=>{
        el.style.color = binding.value
    }
}
````

自定义指令传递的参数的含义

- el: 指令绑定的元素
- binding: 返回一个对象，包含一下属性
  - value: v-my-directive = ' 1 + 1' , value值2
  - arg: v-my-directive:foo  值是foo
  - modifiers：v-my-directive.foo.bar  修饰符对象是{ foo:  true，bar:  true }

### 使用自定义指令实现一个v-click-outside

```typescript

<script setup lang="ts">
const vClickOutside = {
    mounted(el, binding){
        const clickHandler = (ev)=>{
            if(el.contains(ev.target)){
                return
            }
            if(binding.value && typeof binding.value === 'function'){
                binding.value()
            }
        }
        el._clickOutside = clickHandler
        document.addEventListener('click',el._clickOutside)
    },
    unmounted(el) {
        document.removeEventListener('click', el._clickOutside);
        delete el._clickOutside;
    },
}

function clickoutside(){
    console.log('点击了外面')
}
</script>

<template>
    <h1>自定义指令的使用</h1>
    <input type="text" v-model="name" placeholder="输入名称" v-focus v-click-outside="clickoutside">
</template>

```

### v-model原理

```typescript
<input :value="text" @input="event => text = event.target.value">
```

#### 实现一个 v-model.capitalize

```typescript
// 自定义一个myInput.vue
<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
const props = defineProps({
    modelValue: String,
    modelModifiers:{default:()=>({})}
})
const emit = defineEmits(['update:value'])
function updateModelValue(e){
    let value = e.target.value
    if(props.modelModifiers.capitalize){
        value = value.charAt(0).toUpperCase() +  value.slice(1)
    }
    e.target.value = value
    emit('update:value',value)
}
</script>

<template>
   <input type="text" :value="modelValue" @input="updateModelValue">
</template>


// 在app.vue中使用
<script setup lang="ts">
import { ref } from 'vue'
import myInput from './components/myInput.vue'
const count = ref('')
</script>
<template>
    <myInput v-model.capitalize="count"/>
</template>
```

同理可以实现v-model.trim  v-model.number  v-model.lazy

### 实现一个useMouse钩子函数

```typescript
import {onMounted, onUnmounted, ref} from 'vue'
function useEventListener(target:EventTarget,event:string, callback:(e: any )=> void){
    onMounted(()=>{
        target.addEventListener(event,callback)
    })
    onUnmounted(()=>{
        target.removeEventListener(event,callback)
    })
}

export function useMouse(){
    const x = ref(0)
    const y = ref(0)
    useEventListener(document,'mousemove',(ev)=>{
        x.value = ev.pageX
        y.value = ev.pageY
    })
    return{
        x,
        y
    }
}
```

### 关于style选择器

```
:deep(div)   // 深度选择器，可以控制子选择器的样式

:slotted(div) // 插槽选择器，可以控制插槽的元素的样式

:global(.red) // 全局选择器，可以将此样式应用到全局
```

### expose

父组件想访问到子组件的方法与属性，需要在子组件中使用expose进行对外暴露

### 计算属性vs方法

计算属性跟方法的使用，计算属性有缓存能力，只有当它依赖的的响应式数据发生更改的时才会重新计算，而方法总是在重新渲染时，再次执行计算

### v-if vs v-show

v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。因此，如果需要频繁切换，则使用 v-show 较好；如果在运行时绑定条件很少改变，则 v-if 会更合适

### v-if 与v-for不能同时使用

v-if与v-for不建议同时使用，因为v-if会先执行，可以使用template标签包裹一层

```
<template v-for="todo in todos">
    <li v-if="!todo.isComplete">
      {{ todo.name }}
    </li>
</template>
```

v-for in 可以用v-for of来代替

### @click.prevent.self  vs  @click.self.prevent

@click.prevent.self，会阻止元素以及子元素的默认行为

@click.self.prevent，会阻止元素本身的点击的事件的默认行为

@click.once事件被调用一次即被移除掉