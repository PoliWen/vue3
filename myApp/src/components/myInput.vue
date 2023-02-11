
<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
const props = defineProps({
    modelValue: String,
    modelModifiers:{default:()=>({})}
})
const emit = defineEmits(['update:value'])
function updateModelValue(e){
    let value = e.target.value
    if(props.modelModifiers.capitalize){
        value = value.charAt(0).toUpperCase() +  value.slice(1)
    }
    e.target.value = value
    emit('update:value',value)
}

</script>

<template>
   <input type="text" :value="modelValue" @input="updateModelValue">
</template>

