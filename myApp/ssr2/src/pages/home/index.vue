<template>
  <div>
    <Nav/>
    <h2> 首页：Vue3 + Vite + VueRouter + pinia 实现同构功能。 </h2>
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

</script>
<style lang="css" scoped>

</style>
