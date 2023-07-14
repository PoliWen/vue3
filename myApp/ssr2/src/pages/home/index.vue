<template>
  <div>
    <Nav/>
    <h2> 首页：Vue3 + Vite + VueRouter</h2>
    <button @click="increment">{{ count }}</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Nav from '../../components/nav.vue'
import { storeToRefs } from "pinia";
import { useCountStore } from '../../store'
const countStore = useCountStore();
const { count } = storeToRefs(countStore);
const { increment } = countStore;

// 直接从pinia中解构出来的数据会丢失响应式，需要使用storeToRefs进行转化
</script>
<style lang="css" scoped>

</style>
