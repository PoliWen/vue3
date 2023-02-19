
<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
const props = defineProps({
    buttonType:{
        type:String,
        validator(value: string) {
            // The value must match one of these strings
            return ['success', 'warning', 'danger'].includes(value)
        },
        require:true
    },
    father:{
        type: Object,
        require: true
    }
})
function changeSonName(){
    props.father.name = '大大大'
}
</script>

<template>
   status:{{ buttonType }}
   <button @click="changeSonName">{{props.father.name}}</button>
</template>

