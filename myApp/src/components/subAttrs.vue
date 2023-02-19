
<script setup lang="ts">
import { useAttrs,useSlots,ref } from 'vue'
const attrs = useAttrs()
console.log(attrs.class)
const slots = useSlots()
// console.log(slots.default()[0].children)
const count = ref(0)
</script>

<template>
  <div @click.stop="attrs.onClick">
    <slot :message="'hello'" :count="count"></slot>
    {{attrs}}
  </div>
</template>

