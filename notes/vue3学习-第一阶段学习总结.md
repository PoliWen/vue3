# vue3 学习—第一阶段学习总结

通过第一阶段的收获主要是进行了查漏补缺，掌握，了解了一些平时很少见，少用的知识点

### 全局 api

app.config.globalProperties 是 vue2 的 vue.prototype 的一种代替，定义好之后在任意组件的实例中都可以进行访问

```javascript
function fetch() {}
app.config.globalProperties.$http = fetch;
```

### 命名规则

组件命名，属性命名，方法命名的规则

```javascript
//组件
<PasecalCase @change="onChangeStatus" @error-back="errorBack" header-title="组件遵循帕斯卡命名，属性遵循驼峰命名"/>
```

### 计算属性

计算属性传递参数的用法

```javascript
const draggableGuideVisible = computed(() => {
  return (index: number) => {
    return unref(pictureList).length > 1 && index === 0 && unref(isAllDone);
  };
});
```

### 共享状态修改规则

对于共享状态的修改，一定要统一在定义的地方修改，如果到处进行修改会照成代码维护困难，如直接在子组件修改父组件的数据，需遵循单向数据流的规则，使用 pinia，或者使用 createSharedComposable

```javascript
// 供给方组件
const location = ref('North')
const updateLocation(){
    location.value = 'South'
}
provide('location',{
    location,
    updateLocation
})

// 注入方组件
const {location, updateLocation} = inject('location')
<button @click="updateLocation">{{ location }}</button>

```

### effectScope

使用 effectScope 可以收集副作用函数，并且进行集中清除

```javascript
const scope = effectScope();
scope.run(() => {
  watch(count, (newVal, oldVal) => {});
  watchEffect(() => {});
});
scope.stop();
```

### typeScript 与 vue

为模板引用定义类型

```javascript
import MyModal from './MyModal.vue'
const modal = ref<InstanceType<typeof MyModal> | null>(null)
const openModal = () => {
  modal.value?.open()
}
```

为事件标注类型

```javascript
// 为事件标注类型
function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value)
}
```

为 provide，inject 标注类型

```javascript
const isFeedBack = ref(false);
provide("isFeedBack", isFeedBack);
const isFeedBack = inject < boolean > "isFeedBack";
```

使用 propType 给对象标注类型

```javascript
import type { propType } from 'vue'
interface Book {
  title: string
  author: string
  year: number
}
const props = defineProps({
  book: Object as PropType<Book>
})
```

### style 选择器

```javascript
:deep(div)   // 深度选择器，可以控制子选择器的样式

:slotted(div) // 插槽选择器，可以控制插槽的元素的样式

:global(.red) // 全局选择器，可以将此样式应用到全局
```

scoped 选择器原理

```css
<div
  class="modal-title"
  data-v-94fcd891
  > 弹窗标题</div
  > .modal-title[data-v-94fcd891] {
  height: 30px;
  line-height: 30px;
  text-align: center;
}
```

deep 选择器原理

```javascript
<div data-v-94fcd891 data-v-7a7a37b1 class="modal">
    <div class="modal-title" data-v-94fcd891>弹窗标题</div>
</div>

[data-v-7a7a37b1] .modal-title {
    background: red;
}
```

global 选择器原理

```javascript
<div data-v-94fcd891 class="mask"></div>
.mask{}
```

slotted 选择器原理

```javascript
<div data-v-94fcd891-s class="slot">slot</div>
.slot[data-v-94fcd891-s] {
    background: red;
}
```

一个组件使用 teleport 传递到 body 组件了，如何局部控制组件样式？

### 响应性语法糖

使用了$ref 则不需要在每次使用 ref 的时候加上.value

每一个返回的 ref 的响应式 api 都有一个与之相对应的$前缀宏函数

- ref->$ref
- computed-> $computed
- shallowRef -> $shallowRef
- customRef-> $customRef
- toRef-> $toRef

```javascript
import { $ref } from "vue/macros";

let count = $ref(0);
```

### 使用 v-once 与 v-memo 来提升性能

v-once 让组件只渲染一次，不会进行更新操作

v-memo 只有传入的条件进行变更时才会进行组件更新

### 响应式 api

shallowRef，shallowReactive，markRaw，toRaw

### 响应式工具方法

isRef，unRef，isProxy，isReactive，isReadOnly
