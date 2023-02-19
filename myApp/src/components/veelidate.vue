<template>
  <div>
    <input v-model="formData.address" type="text" @blur="xxx"/>
    <span>{{ errorMessage }}</span>
  </div>
</template>
<script setup lang='ts'>
import { ref, unref,reactive, watch } from 'vue'
import { useField } from 'vee-validate';
import * as yup from 'yup';
const formData = reactive({
    address:'10'
})
function validateEpaperNumber(value:string) {
    if (value && value.trim()) {
        return true;
    }
    return 'This is required66';
}
const { errorMessage, value: address, validate } = useField('fieldName', validateEpaperNumber,{
    initialValue: formData.address,
    syncVModel: false,
});
watch(formData,(val)=>{
    address.value = val.address
})
function xxx(){
    validate()
    console.log(unref(address))
}
</script>