
<script setup lang="ts">
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

function reactive(target:Object){
    if(target && typeof target === 'object'){
       Object.entries(target).forEach(([key,value])=>{
        if(typeof value === 'object'){
            target[key] = reactive(value)
        }
       })
        return new Proxy(target,reactiveHandler)
    }
    return target
}

// const person = shallowReactive({
//     name: '张三',
//     age: 30,
//     son: {
//         name:'小张',
//         age: 3
//     }
// })
// person.name = '王五'
// console.log(person.name)
// delete person.name


const person = reactive({
    name: '张三',
    age: 30,
    son: {
        name:'小张',
        age: 3
    }
})
person.son.name = '大张'
console.log(person.son.name)
delete person.son.name

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
</script>

<template>

    <h1>reactive的基本实现</h1>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
