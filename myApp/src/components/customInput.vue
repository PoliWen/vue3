
<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const value = computed({
    get(value){
        return props.modelValue
    },
    set(newVal){
        emit('update:modelValue',newVal)
    }
})
</script>

<template>
   <input type="text" v-model="value">
</template>

