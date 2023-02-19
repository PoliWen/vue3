
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
const emit = defineEmits(['click'])
function changeSonName(){
    props.father.name = '大大大'
    // emit('click','clickEvent')
}
</script>

<template>
  <div :style="{background:'red'}">
   status:{{ buttonType }}
   <button @click.stop="changeSonName">{{props.father.name}}</button>
  </div>
</template>

