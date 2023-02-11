<script setup lang="ts">
import { ref } from 'vue'
import setUp from './setUp.vue'
import setUp1 from './setUp1.vue'
const visible = ref(true)
</script>
<template>
  <!-- <KeepAlive>
    <setUp v-if="visible" title="setup执行时机"></setUp>
  </KeepAlive> -->

  <setUp v-if="visible" title="setup执行时机"></setUp>
  <Suspense>
      <setUp1></setUp1>
      <template #fallback>
        isLoading
      </template>
  </Suspense>
  <div>
    <button @click="visible = !visible">切换setup组件</button>
  </div>
</template>

<style scoped>
</style>
