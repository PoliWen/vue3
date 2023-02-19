
<script setup lang="ts">
import { useAttrs,useSlots } from 'vue'
const attrs = useAttrs()
console.log(attrs.class)
const slots = useSlots()
console.log(slots.default()[0].children)
</script>

<template>
  <div @click.stop="attrs.onClick">
    <slot></slot>
    {{attrs}}
  </div>
</template>

