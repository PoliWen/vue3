# vue3学习—深入组件

### 全局组件

```typescript
import { createApp } from 'vue'
import myComponent from './myComponent.vue'
const app = createApp({}).mount('#app')
app.component('myComponent',myComponent)

// 支持链式调用
app.component('componentA',componentA)
   .component('componentB',componentB)
```

全局注册的组件可以在任何地方被使用，不会被tree-shaking，组件的依赖关系不清晰。

### 组件命名

推荐使用PascalCase命名，可以直接这样使用<PasecalCase/> ，这样能跟原生的html很好的区分开

HTML标签和属性名称是不区分大小写的，会把任何写成大写的字符转换成小写，

因此在在dom中使用vue组件不管是标签还是属性都要写成camelCase的形式

```typescript
<blog-post post-title="hello" @update-post="onUpdatePost"></blog-post>
```

### props

定义props值的类型可以这样使用

```typescript
const props = defineProps({
	foo:{
		type:String
		default:'foo',
        require:true
        validator(value){
    		return 	['foo'].includes(value)
        }
	},
    bar:{
        type:number,
        default:100
    }
	
})
```

值的校验可以使用validator函数，会在运行时进行警告提示

也可以结合withDefaults使用

```typescript
interface Props{
    foo:string,
    bar?:number
}
const props = withDefaults(defineProps<props>(),{
    foo:'foo',
    bar:100
})
```

props的命名建议使用camelCase的形式，但是在使用的时候建议使用kebab-case的形式，而组件的命名建议使用PascalCase的形式

```typescript
const props = defineProps({
    welcomeMessage:String
})
<myComponent welcome-message="hello"/>
```

props的type还可以是一个类，或者构造函数，vue会通过instanceof来检查类型是否匹配

### emit父子组件数据传递

事件的命名在子组件使用camelCase，在父组件汇总使用kebab-case，跟props的命名规则一样

emit事件支持对象语法，可以对触发事件的参数进行校验

```typescript
const emit = defineEmits({
	submit({email,password}){
        if(email && password){
        	return true
        }else{
            return false
        }
    }
})
function submit(email,password){
    emit('submit',{email,password})  // 校验通过了才会在父组件中接收到
}
```

使用typeScript对事件的函数进行声明

```typescript
const emit = defineEmits<{
	(e:'submit', email: string):void
    (e:'update', id: number): void
}>()
```

### v-model

v-model的原理

```typescript
<input :value="searchTxt" @input="searchTxt = $event.target.value"></input>

```

使用computed实现

```typescript
// myInput
<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const value = computed({
    get(value){
        return props.modelValue
    },
    set(newVal){
        emit('update:modelValue',newVal)
    }
})
</script>

<template>
   <input type="text" v-model="value">
</template>


```

v-model可以指定多个参数

```
​```

```



### provide与inject

provide会将数据逐级传递到每一个子组件中，在子组件中可以使用inject接受到父组件传递过来的值

```javascript 
// 父组件
const { provide } from 'vue'
const count = ref(0)
provide('count',{
    count,
    increaseCount(){
        count.value++
    }
})

const message = ref('hello')
provide('message',message)


//子组件接收
const { inject } from 'vue'
const {count,increasecount} = inject('count')
const message = inject('message')
```

为了避免命名重复或者冲突，最好可以使用**Symbol**作为provide的命名，这些命名可以抽离到一个单独的文件中。

在子组件可以直接修改父组件注入的数据，但是不建议这么做，会导致数据的修改混乱无法追踪，建议所有的修改都在供给方组件中进行修改，可以提供一个方法注入到子组件中给子组件进行调用。

如果要让provide注入的数据不能被修改，可以使用readonly进行包裹

```typescript
import { readonly,provide } from 'vue'
const count = ref(0)
provide('read-only-count',readonly(count))
```

inject可以提供一个默认值，当父组件没有提供key值的时候会避免报错

```typescript
const message = inject('message','hello')
```

### 插槽

具名插槽

```typescript
<div class="modal">
    <slot name="header"></slot>
	<slot name='body'></slot>
	<slot name="footer"></slot>
</div>

// 使用
<myComponent>
	<template #header>
    	<h3>弹窗的标题</h3>    
    </template>        
</myComponent>
```

作用域插槽

```typescript
<div>
    <slot :message="'hello'" :count="count"></slot>
</div>

<myComponent v-slot="{message, count}">
    {{ message.split('').reverse() }}
    {{ count }}
</myComponent>
```

### useSlots的使用

useSlots和未使用setup语法糖中的$slots的意思一样

```typescript
import { useSlots } from 'vue'
const slots = useSlots()
console.log(slots.default())
```

### useAttrs的使用

```typescript
<div foo="true"></div>

import { useAttrs } from 'vue'
const attrs = useAttrs()
console.log(attrs.foo) // true
```

如果不想attributes被孙子组件继承，可以设置inheritAttrs: false

```typescript
<script>
export default {
  inheritAttrs: false
}
</script>
```

子组件中不止一个根节点，需要使用v-bind="$attrs"指定将属性绑定到某一个子元素上。

### 问题

- props的属性定一个了一个default默认值，当显示的传入一个undefined的时候，显示的是什么值?
- modelValue，modelModifiers代表什么？

```typescript
const props = defineProps({
    modelValue: String,
    modelModifiers:{default:()=>({})}
})
```

- 当props是一个对象或者数组的时候在子组件中可以被直接修改?    会报错吗?

- .once修饰符的作用
- vue父子组件的通信方式有哪几种?

- @click跟@click.native的区别?

- 让provide属性不能被修改？

- 作用域插槽

  ```typescript
  <div>
      <slot :message="'hello'" :count="count"></slot>
  </div>
  
  <myComponent v-slot="{message,count}">
      <button @click="count=count+1">{{message}}{{count}}</button>
  </myComponent>
  ```

- useVModel的原理