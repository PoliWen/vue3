
<script setup lang="ts">
import { useDark } from '../composables/index'
const { isDark,toggleDark } = useDark()
</script>

<template>
  <button @click="toggleDark">is dark {{isDark}}</button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
