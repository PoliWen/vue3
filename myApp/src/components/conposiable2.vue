
<script setup lang="ts">
import { useState} from '../useHooks/index'
const { x, increase } = useState()()

</script>

<template>
  x:{{ x }}
  <button @click="increase">x</button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
