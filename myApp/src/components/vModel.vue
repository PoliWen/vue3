
<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
    firstName:String,
    lastName:String
})
const emit = defineEmits(['update:firstName','update:lastName'])
</script>

<template>
   <h3>组件传递多个参数</h3>
   <input type="text" :value="firstName" @input="$emit('update:firstName',$event.target!.value)">
   <input type="text" :value="lastName" @input="$emit('update:lastName',$event.target!.value)">
</template>

