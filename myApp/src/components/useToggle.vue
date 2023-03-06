
<script setup lang="ts">
import { ref } from 'vue'
function useToggle(initValue:boolean){
  const state = ref(initValue)
  function toggle(){
    state.value = !state.value
  }
  return {
    state,
    toggle
  }
}
const {state,toggle} = useToggle(false)
</script>

<template>
 <p>{{state ? 'on' : 'off'}}</p>
 <p @click="toggle">Toggle State</p>
</template>

