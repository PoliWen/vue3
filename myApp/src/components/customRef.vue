
<script setup lang="ts">
import { customRef } from 'vue'
function useDebouncedRef<T>(value:T, delay = 200){
    let timer:number
    return customRef((track,trigger)=>{
        return {
            get(){
                track()
                return value
            },
            set(newVal: T){
                clearTimeout(timer)
                timer = setTimeout(() => {
                    value = newVal
                    trigger()
                }, delay)
            }
        }
    })
}
const name = useDebouncedRef('刘德华')
console.log(name.value)
</script>

<template>
    <h1>用customRef定义一个防抖函数</h1>
    <input type="text" v-model="name" placeholder="输入名称">
    {{ name }}
</template>

