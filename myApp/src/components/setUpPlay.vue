<script setup lang="ts">
import { ref } from 'vue'
import setUp from './setUp.vue'
const visible = ref(true)
</script>
<template>
  <KeepAlive>
    <setUp v-if="visible" title="setup执行时机"></setUp>
  </KeepAlive>

  <div>
    <button @click="visible = !visible">切换setup组件</button>
  </div>
</template>

<style scoped>
</style>
