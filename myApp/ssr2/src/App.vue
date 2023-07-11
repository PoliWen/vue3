<script setup lang="ts">
import { ref } from 'vue'
const title = ref('Vue 3 + Vite + TS + SSR')
const count = ref(0)
function increment() {
  count.value++
}
</script>

<template>
 <div>
    <h3>{{ title }}</h3>
    <button @click="increment">{{count}}</button>
 </div>
</template>

<style scoped>
</style>
