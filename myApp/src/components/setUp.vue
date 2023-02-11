<script lang="ts">
export default{
  name:'setup',
  beforeCreate() {
    console.log('beforeCreated',this.title)
    console.log()
  },
  created(){
    console.log('created')
  },
}

</script>
<script setup lang="ts">
import { onActivated,onDeactivated, onBeforeMount, onMounted, onUnmounted,onUpdated, onBeforeUpdate, ref,onBeforeUnmount,watch} from 'vue'
console.log('setup');
const props = defineProps({
  title: String
})
onBeforeMount(()=>{
  console.log(`组件挂载之前,也可以获取到属性${props.title}`)
})
onMounted(()=>{
  console.log(`组件挂载成功,可以获取props属性${props.title}`)
})
onBeforeUpdate(()=>{
  console.log('组件数据更新之前执行')
})
onUpdated(()=>{
  console.log('组件数据更新之后执行')
})
onBeforeUnmount(()=>{
  console.log('组件被销毁之前执行')
})
onUnmounted(()=>{
  console.log('组件被销毁')
})
onActivated(()=>{
  console.log('onActivated 结合keepalive组件使用,当组件被激活的时候触发')
})

onDeactivated(()=>{
  console.log('onDeactivated')
})
const count = ref(0)
watch(count,(val)=>{
  console.log('count的值发生了变化',val)
})
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
