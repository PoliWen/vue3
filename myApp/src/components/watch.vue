
<script setup lang="ts">
import {watch, watchEffect,ref,reactive,computed,unref} from 'vue'
const props = defineProps({
  title: String
})
const double = computed(()=>{
    return count.value*2
})
const count = ref(0)
const unwatch = watch(count,(newVal,oldVal)=>{
  console.log(`count的值发生了变化,变化前的值是${oldVal},现在的值是${newVal}`)
  if(newVal > 10){
    unwatch()
  }
})

const person = reactive({
    name: '张三',
    age: 30,
    son:{
        name: '张子',
        age: 2
    }
})

watch(person,(newVal,oldVal)=>{
    console.log(newVal.son.age);
    console.log(oldVal.son.age);
})
person.son.age = 10

watch(()=> person.name,(newVal,oldVal)=>{
    console.log(newVal,oldVal)
})

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
    console.log(val,val.firstName)
})
watch(name,(val)=>{
    console.log('当ref为一个对象的时候使用deep监听',val)
},{deep:true})

// 监听某一个值
watch(()=> name.value.firstName,(val)=>{
    console.log(val)
})

// 写成数组的形式
watch([count,()=> person.name],([newCount,newName])=>{
    console.log('数组',newCount,newName)
})

watchEffect(()=>{
    console.log('count发生了变化就执行watchEffect',unref(count))
    setTimeout(()=>{
        person.name = unref(count)+ '3'
        console.log('person.name的值也发生了变化')
    },3000)
})

const x = ref(1)
watch(()=> x.value + '123',(val)=>{
    console.log('value的值可以修改',val)
})
setTimeout(()=>x.value++,1000)

</script>

<template>
  <h2>{{ title }}</h2>
  <p>watch监听数据的变化,可以直接监听ref值，监听reactive和computed需要写成函数的形式,不加immediate第一次不会执行,支持数组的形式,watchEffect第一次也会进行监听，不需要指定监听的对象，只要watcheffect函数里面所依赖的响应式数据发生变化，就会触发执行。watchEffect有时候可以减少代码量，但可能导致监听关系不是很明确。</p>
  <button @click="count=count+1">点击递增:{{count}}</button>
  <input type="text" v-model="person.name" placeholder="输入姓名"> 
  <p>{{ person.name }}</p>

  <input type="text" v-model="name.firstName" placeholder="输入姓名"> 
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
