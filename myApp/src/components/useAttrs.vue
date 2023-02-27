
<script setup lang="ts">
import {} from 'vue'
import subAttrs from './subAttrs.vue'
function clickFn(){
  alert(123)
}
</script>

<template>
  <subAttrs v-slot="{message,count}" @click.native="clickFn">
    {{ message.split('').reverse() }}
    <button @click="count=count+1">{{count}}</button>
  </subAttrs>
</template>

