## 响应性系统

### 响应式系统的基本工作流程

- 当读取操作发生时，将副作用函数收集到"桶"中
- 当设置操作发生时，从“桶”中取出副作用函数进行执行

### WeakMap与map的区别？

- WeakMap的键只能是一个对象，而map的键可以是任何数据类型，
- WeakMap的键名所指向的对象不会记录垃圾回收机制，一旦不在需要，WeakMap里面的键名对象和键值对象都会自动消失，不会再占用内存

如何处理effect嵌套问题？

```javascript
let activeEffect
let effectStack = []
function effect(fn){
	const effectFn = () => {
        cleanUp(effectFn)
        activeEffect = effectFn
        effectStack.push(effectFn)
        fn()
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
    }
    effectFn.deps = []
    effectFn()
}
```

