
<script setup lang="ts">
import { useMouse } from '../composables/index'
const {x, y} = useMouse()

</script>

<template>
  x:{{x}}, y:{{y}}
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
