
<script setup lang="ts">
import {} from 'vue'
import subAttrs from './subAttrs.vue'
</script>

<template>
  <subAttrs v-slot="{message,count}">
    {{ message.split('').reverse() }}
    <button @click="count=count+1">{{count}}</button>
  </subAttrs>
</template>

