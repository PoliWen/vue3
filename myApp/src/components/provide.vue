
<script setup lang="ts">
import { inject } from 'vue'
const {count,increaseCount} = inject('count') 
</script>

<template>
  <div>
   <button @click.stop="increaseCount">{{count}}</button>
  </div>
</template>

