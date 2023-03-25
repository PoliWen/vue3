
<script setup lang="ts">
import { useX} from '../composables/index'
const { x, increase } = useX()

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
