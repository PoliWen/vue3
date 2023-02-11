
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

const stopWatch = watchEffect(()=>{
    console.log('watchEffect,监听count',count.value)
    if(count.value > 10){
        stopWatch()
    }
})




</script>

<template>
  <h2>{{ title }}</h2>
  <p>调用watch跟watcheffect的回调函数可以停止当前监听</p>
  <button @click="count=count+1">点击递增:{{count}}</button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
