

# vueuse库的探索与实践

### vuesue是什么

vueuse是一个可组合式函数的工具库，它提供了一系列常见的、可复用的函数，可以帮助您更快地开发Vue 3应用程序。它提供了许多有用的功能，如状态管理、表单处理、副作用管理、计时器、窗口尺寸检测、鼠标位置跟踪等，并且支持tree-shaking，只导入您需要的功能，避免打包不必要的代码，从而优化您的应用程序性能。VueUse库非常灵活，易于使用，适合在各种规模的应用程序中使用。

### composables api与options api

我们都知道vue2中采用的是options api，在使用的过程中我们发现了一些问题

- 不利于逻辑复用，通常需要使用mixin才能进行逻辑复用，而mixin会到来更多的问题
- 上下文丢失，data和methods间隔很远，开发的过程中需要切换来切换去
- 代码可读性差，难以维护和拓展
- 不好进行单元测试，通常在方法里面使用了this来访问，不方便进行单元测试
- 更好的typeScript类型支持

正是基于options api的这些缺点，vue3采用了composable api的形式来组织代码，用composables api来组织代码拥有以下的优点

- 利于逻辑复用，可以将代码按功能和模块封装成可复用的代码
- 可以进行灵活的组合
- 更好的上下文语义
- 更好的typeScript类型支持
- 可以脱离vue组件，进行单独使用
- 易于进行单元测试
- 代码可读性强，易于维护和拓展

### composiable api的核心

**在于建立输入和输出的连接，输出会自动根据输入的改变而改变**

我们都知道普通的函数，输入和输出是不会建立联系的，改变输入的值，输出的值不会跟着改变，例如:

```javascript
function add(a: number, b: number){
    return a + b
}
let a = 1
let b = 2
const c = add(a + b) // 3

a = 3
console.log(c) // 3
```

以上代码，我们改变a的值，不会直接影响输入的c的结果。

而我们利用vue3的ref和computed等响应式api，可以实现输入和输出的连接,当改变输入的值时，输出的值会跟着改变

```javascript
function add(a: Ref<number>, b: Ref<number>){
    return computed(()=> a.value + b.value)
}
const a = ref(1)
const b = ref(2)
const c = add(a,b)
console.log(unref(c)) // 3

a.value = 2
console.log(unref(c)) // 4
```

上面的代码通过ref和computed建立了输入和输出的连接，当输入a的值改变之后，输出c的值也会跟着改变，这就是组合式api跟普通函数最大的不同之处

当然add函数的参数既可以是ref也可以是普通变量

```javascript
function add(
	a: Ref<number> | number,
    b: Ref<number> | number
){
    return computed(()=> unref(a) + unref(b))
}
```

通过改造之后，组合式函数的输入参数就更加灵活了。

我们可以抽象一个**MaybeRef**的类型工具来约束这种既可以是ref也可以是普通数据的参数

```
type MaybeRef<T> = Ref<T> | T
```

### 让输入和输出建立连接的更高级技巧

我们通过一个案例来实现更高级的将输入和输出建立连接的技巧，写一个实现useTitle的方法

```javascript
type MaybeRef<T> = Ref<T> | T
export function useTitle(
  newTitle: MaybeRef<string | null | undefined>
) {
  const title = ref(newTitle || document.title)
  watch(title,(t)=>{
    if(t !== null)
        document.title = t;
  },{ immediate: true })

  return {
    title,
  };
}
```

上面我们定义了useTitle函数的入参是一个**MaybeRef**类型，我们都知道computed的返回值也是一个ref类型，那么也可以给useTitle的参数传入一个computed，这样也能建立传入与输出的连接。

```javascript
const isDark = useDark()
useTitle(computed(()=> isDark.value? 'dark Mode' : 'Light mode'))
```

如果我想这样使用呢？

```javascript
const isDark = useDark()
useTitle(() => isDark.value? 'dark Mode' : 'Light mode'))
```

也就是我们想将入参改成既支持computed又支持computed getter函数，进行改造的话，可以定义一个**MaybeComputedRef**类型，这个类型表示参数可以是一个ref，一个getter函数，一个computedRef

````javascript
type MaybeComputedRef<T> = MaybeRef<T> | (()=> T) | ComputedRef<T>
````

我们都知道普通的函数是没有响应式能力的，那么需要对传入的getter函数进行处理，定义一个工具方法**resolveRef**，将传入的函数用computed进行包裹一下就可以了

```javascript
function resolveRef<T>(input: MaybeRef<T>): Ref<T> {
  return typeof input === 'function'
     ? computed(input)
     : ref(input)
}
```

这里要注意ref包裹一个ref返回的还是一个ref

```javascript
function ref(input){
    return isRef(input) 
        ? input
    	: createRef(input)
}
```

下面对useTitle进行改造

```javascript
export function useTitle(
    newTitle: MaybeComputedRef<string | null | undefined>
) {
  const title = ref(resolveRef(newTitle ?? document.title))
  watch(title,(t)=>{
    if(t !== null)
        document.title = t;
  },{ immediate: true })

  return {
    title,
  };
}
```

改造之后就可以支持传入getter函数了。

###	如何在组合式函数里清除副作用函数

我们都知道执行watch会返回一个回调函数，调用watch执行后的回调函数就可以清除这个watch的副作用

```javascript
const count = ref(0)
const stop = watch(count,(val)=>{
    console.log(`count:${val}`)
})
count.value += 1 // count: 1
stop()
count.value += 1 // 无输出
```

那么我们可以仿造watch，将清除副作用函数的方法返回出去

```javascript
function useEventListener(target: EventTarget, event:string, callback:(e: any )=> void){
    const cleanup = ()=>{
        target.removeEventListener(event,callback)
    }
    onMounted(()=>{
        target.addEventListener(event,callback)
    })
    onUnmounted(cleanup)
    return cleanup
}
```

```javascript
const stop = useEventListener(document,'click',()=>{ })
// 手动清除
stop()
```

但是会存在以下问题，当一个函数调用多次，则需要多次调用stop回调方法

```javascript
function useMouse(){
    const stop1 = useEventListener(document,'mousedown',() => { })
    const stop1 = useEventListener(document,'click',( )=> { })
    const stop1 = useEventListener(document,'mousemove',() => { })
    const cleanup = ()=>{
        stop1()
        stop2()
        stop3()
    }
    return cleanup
}
```

可以采用effectScope解决上面的问题，efffectScope可以集中收集所有的副作用函数，进行统一清除，这样就不需要在return 一个清除副作用的stop函数

```javascript
import { effectScope } from 'vue'
const scope = effectScope()
scope.run(() => {
    watch(count,()=>{})
    useEventListener(document,'mousedown',() => { })
    seEventListener(document,'click',() => { })
})
scope.stop()
```

为了达到这种效果，调用onScopeDispose可以收集并且清除副作用函数

可以将onUnmounted 替换为onScopeDispose，当组件被销毁时，会自动调用清理函数

```javascript
function useEventListener(target: EventTarget, event:string, callback:(e: any )=> void){
    const cleanup = () => {
        target.removeEventListener(event,callback)
    }
    onMounted(()=>{
        target.addEventListener(event,callback)
    })
    onScopeDispose(cleanup)
}
```

### 实现一个useDark

vueuse里面有一个useDark函数，我们来模仿实现一下

```javascript
import { ref, watch, unref } from 'vue';
import { useLocalStorage } from '@vueuse/core';

export function useDark() {
  const isDark = ref(false)
  const mode = ref('')

  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mode.value = mediaQuery.matches ? 'dark' : 'light'

    const isDarkStore = useLocalStorage('isDark', null)

    if (isDarkStore.value === null) {
      isDark.value = mediaQuery.matches
    } else {
      isDark.value = JSON.parse(isDarkStore.value)
    }

    watch(isDark, (value: boolean) => {
      document.documentElement.classList.toggle('dark', value)
      isDarkStore.value = value
    }, { immediate: true })

    mediaQuery.addEventListener('change',(event) => {
        mode.value = event.matches ? 'dark' : 'light'
        if (isDarkStore.value === null) {
          isDark.value = event.matches
        }
      });
  }
  function toggleDark() {
    isDark.value = !isDark.value;
  }

  return { isDark, mode, toggleDark }
}
```

在html上添加不同的模式class之后，就可以通过如下css变量来实现暗黑模式的切换效果

```scss
:root {
  /* 背景顏色 */
  --c-bg: #fff;
}

html,
body {
  background-color: var(--c-bg);
}

html.dark {
  --c-bg: #121212;
}
```

上面的实现中我们借助了window.matchMedia，我们也可以将这个方法封装为一个useMediaQuery()方法

windows.matchMedia方法用来动态监听媒体查询的变化，基本用法如下。

```javascript
const mediaQuery = window.matchMedia("(max-width: 768px)");

function handleDeviceChange(e) {
  if (e.matches) {
    // 当设备宽度小于等于 768px 时执行的代码
  } else {
    // 当设备宽度大于 768px 时执行的代码
  }
}

mediaQuery.addEventListener(''handleDeviceChange); // 添加监听器
handleDeviceChange(mediaQuery); // 初始化执行一次
```

下面将这个api封装成一个组合式useMediaQuery方法

```javascript
import { ref, watchEffect, onScopeDispose } from 'vue'

export function useMediaQuery(query: string) {
  const mediaQuery = window.matchMedia(query)
  const matches = ref(mediaQuery.matches)

  const update = () => {
    matches.value = mediaQuery.matches
  }
  
  mediaQuery.addEventListener('change',update)

  function cleanUp(){
    mediaQuery.removeEventListener('change', update)
  }
  onScopeDispose(cleanUp)

  return matches
}
```

useMediaQuery的使用

```javascript
const isLargeScreen = useMediaQuery('(min-width: 1024px)')
const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
```

通过阅读vusue的源码我们发现，还有一个获取当前设备的暗黑模式的方法usePreferredDark()，利用已经封装好的useMediaQuery方法可以很简单实现这个方法，代码如下

```javascript
export function usePreferredDark() {
  return useMediaQuery('(prefers-color-scheme: dark)')
}
```

现在我们用封装好的useMediaQuery方法，和usePreferredDark方法对useDark方法进行改进

```javascript
import { ref, watch, unref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { usePreferredDark } from './usePreferredDark';

export function useDark() {
  const isDark = ref(false)
  const mode = ref('')

  if (typeof window !== 'undefined') {
    const preferredDark = usePreferredDark()
    mode.value = preferredDark.value ? 'dark' : 'light'
    const isDarkStore = useLocalStorage('isDark', null)
    function update(){
      	if (isDarkStore.value === null) {
          isDark.value = preferredDark.value
        } else {
          isDark.value = JSON.parse(isDarkStore.value)
        }  
    }
    watch(isDark, (value: boolean) => {
      document.documentElement.classList.toggle('dark', value)
      isDarkStore.value = value
    }, { immediate: true })

    watch(preferredDark,(value)=> {
      update()
    })
  }
    
  function toggleDark() {
    isDark.value = !isDark.value;
  }
    
  return { isDark, mode, toggleDark }
}
```

通过实现一个useDark方法，相信我们对可组合式api有了一个更深入的理解，可组合式api可以将单一职责的方法进行封装，形成一块块积木，然后可以将这些积木拼接起来，实现更多的功能。

![image-20230326221503685](C:\Users\kingw\AppData\Roaming\Typora\typora-user-images\image-20230326221503685.png)

### vueuse的库分析

@vueuse/components如何让组合式api支持以组件形式使用的？

```javascript
<UseMouse v-slot="{ x, y }">
  x: {{ x }}
  y: {{ y }}
</UseMouse>
```











