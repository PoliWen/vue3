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





### useSlots的使用

useSlots和未使用setup语法糖中的$slots的意思一样

```typescript
import { useSlots } from 'vue'
const slots = useSlots()
console.log(slots.default())
```



### 问题

- props的属性定一个了一个default默认值，当显示的传入一个undefined的时候，显示的是什么值
- modelValue，modelModifiers代表什么？

```typescript
const props = defineProps({
    modelValue: String,
    modelModifiers:{default:()=>({})}
})
```

- 当props是一个对象或者数组的时候在子组件中可以被直接修改?    会报错吗?







