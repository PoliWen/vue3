# vue3 学习—深入组件

### 全局组件

```typescript
import { createApp } from "vue";
import myComponent from "./myComponent.vue";
const app = createApp({}).mount("#app");
app.component("myComponent", myComponent);

// 支持链式调用
app.component("componentA", componentA).component("componentB", componentB);
```

全局注册的组件可以在任何地方被使用，不会被 tree-shaking，组件的依赖关系不清晰。

### 组件命名

推荐使用 PascalCase 命名，可以直接这样使用<PasecalCase/> ，这样能跟原生的 html 很好的区分开

HTML 标签和属性名称是不区分大小写的，会把任何写成大写的字符转换成小写，

因此在在 dom 中使用 vue 组件不管是标签还是属性都要写成 camelCase 的形式

```typescript
<blog-post post-title="hello" @update-post="onUpdatePost"></blog-post>
```

### props

定义 props 值的类型可以这样使用

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

值的校验可以使用 validator 函数，会在运行时进行警告提示

也可以结合 withDefaults 使用

```typescript
interface Props {
  foo: string;
  bar?: number;
}
const props = withDefaults(defineProps<props>(), {
  foo: "foo",
  bar: 100,
});
```

props 的命名建议使用 camelCase 的形式，但是在使用的时候建议使用 kebab-case 的形式，而组件的命名建议使用 PascalCase 的形式

```typescript
const props = defineProps({
    welcomeMessage:String
})
<myComponent welcome-message="hello"/>
```

props 的 type 还可以是一个类，或者构造函数，vue 会通过 instanceof 来检查类型是否匹配

### emit 父子组件数据传递

事件的命名在子组件使用 camelCase，在父组件汇总使用 kebab-case，跟 props 的命名规则一样

emit 事件支持对象语法，可以对触发事件的参数进行校验

```typescript
const emit = defineEmits({
  submit({ email, password }) {
    if (email && password) {
      return true;
    } else {
      return false;
    }
  },
});
function submit(email, password) {
  emit("submit", { email, password }); // 校验通过了才会在父组件中接收到
}
```

使用 typeScript 对事件的函数进行声明

```typescript
const emit = defineEmits<{
  (e: "submit", email: string): void;
  (e: "update", id: number): void;
}>();
```

### v-model

v-model 的原理

```typescript
<input :value="searchTxt" @input="searchTxt = $event.target.value"></input>

```

使用 computed 实现

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

v-model 可以指定多个参数

````
​```

````

```typescript
<input
  :value="searchText"
  @input="searchText = $event.target.value"
/>
```

computed 实现 v-model

```typescript
<!-- myInput.vue -->
<script setup>
import { computed } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<template>
  <input v-model="value" />
</template>
```

#### 实现一个 v-model.capitalize

```typescript
<script setup>
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

function emitValue(e) {
  let value = e.target.value
  if (props.modelModifiers.capitalize) {
    value = value.charAt(0).toUpperCase() + value.slice(1)
  }
  emit('update:modelValue', value)
}
</script>

<template>
  <input type="text" :value="modelValue" @input="emitValue" />
</template>
```

v-model.lazy，v-model.number，v-model.trim 同理可实现

### provide 与 inject

provide 会将数据逐级传递到每一个子组件中，在子组件中可以使用 inject 接受到父组件传递过来的值

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

为了避免命名重复或者冲突，最好可以使用**Symbol**作为 provide 的命名，这些命名可以抽离到一个单独的文件中。

在子组件可以直接修改父组件注入的数据，但是不建议这么做，会导致数据的修改混乱无法追踪，建议所有的修改都在供给方组件中进行修改，可以提供一个方法注入到子组件中给子组件进行调用。

如果要让 provide 注入的数据不能被修改，可以使用 readonly 进行包裹

```typescript
import { readonly, provide } from "vue";
const count = ref(0);
provide("read-only-count", readonly(count));
```

inject 可以提供一个默认值，当父组件没有提供 key 值的时候会避免报错

```typescript
const message = inject("message", "hello");
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

### useSlots 的使用

useSlots 和未使用 setup 语法糖中的$slots 的意思一样

```typescript
import { useSlots } from "vue";
const slots = useSlots();
console.log(slots.default());
```

### useAttrs 的使用

```typescript
<div foo="true"></div>;

import { useAttrs } from "vue";
const attrs = useAttrs();
console.log(attrs.foo); // true
```

如果不想 attributes 被孙子组件继承，可以设置 inheritAttrs: false

```typescript
<script>
export default {
  inheritAttrs: false
}
</script>
```

子组件中不止一个根节点，需要使用 v-bind="$attrs"指定将属性绑定到某一个子元素上。

### 问题

- props 的属性定一个了一个 default 默认值，当显示的传入一个 undefined 的时候，显示的是什么值?
- modelValue，modelModifiers 代表什么？

```typescript
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) },
});
```

- 当 props 是一个对象或者数组的时候在子组件中可以被直接修改? 会报错吗?

- .once修饰符的作用

- vue父子组件的通信方式有哪几种?**mitt**
- .once 修饰符的作用
- vue 父子组件的通信方式有哪几种?

- @click 跟@click.native 的区别?

- 让 provide 属性不能被修改？

- 作用域插槽

  ```typescript
  <div>
      <slot :message="'hello'" :count="count"></slot>
  </div>

  <myComponent v-slot="{message,count}">
      <button @click="count=count+1">{{message}}{{count}}</button>
  </myComponent>
  ```

- useVmodel原理

- 实现一个v-model.capitalize的思路

- JSON.parse(JSON.stringify(value)) 是深拷贝还是浅拷贝

- s-slot传递的数据可以修改吗

```typescript
  <subAttrs v-slot="{message,count}" @click.native="clickFn">
    {{ message.split('').reverse() }}
    <button @click="count=count+1">{{count}}</button>
  </subAttrs>
```
