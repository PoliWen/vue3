# composiables api（可组合式api）

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

当然add函数的参数既可以是ref也可以不是ref

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

### 实现一个useTitle方法

```javascript

```



### 通过实现一个useDark来理解composable api



### vueuse的分析











