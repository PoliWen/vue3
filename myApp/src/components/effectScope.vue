
<script setup lang="ts">
import {watch, watchEffect, ref, effectScope, unref} from 'vue'
const props = defineProps({
  title: String
})
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
  <h2>{{ title }}</h2>
  <p>effectScope主要用来清除收集副作用函数，并且进行集中清除</p>
  <button @click="increment">增加{{count}}</button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
