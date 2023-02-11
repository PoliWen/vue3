<script setup lang="ts">
import { watch, ref} from 'vue'

function delay(){
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      const res = {
          status:1,
          data:{
            msg:'成功'
          }
      }
      resolve(res)
    },2000)
  })
}
const res = await delay()
console.log('setUp里面执行await函数',res)

const props = defineProps({
  title: String
})
const count = ref(0)
watch(count,(val)=>{
  console.log('count的值发生了变化',val)
},{immediate:true})

</script>

<template>
    <h2>{{ title }}</h2>
    <h3>setup的执行时机，在beforeCreared之前</h3>
    <button @click="count=count+1">点击递增:{{count}}</button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
