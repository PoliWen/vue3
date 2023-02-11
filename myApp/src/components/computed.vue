
<script setup lang="ts">
import { computed, ref, watch} from 'vue'
const firstName = ref('刘')
const lastName = ref('德华')
const fullName = computed({
    get(){
        return firstName.value + lastName.value
    },
    set(newVal){
        [firstName.value,lastName.value] = newVal.split(' ')
    }
})
watch(fullName,(val)=>{
    console.log(val)
})
setTimeout(()=>{fullName.value = '王 麻子'},1000)
</script>

<template>
  姓：{{ firstName }}<br>
  名：{{ lastName }}<br>
  姓名: {{ fullName }}<br>
  <input type="text" v-model="fullName">
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
