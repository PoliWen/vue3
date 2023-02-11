
<script setup lang="ts">
import { ref } from 'vue'
const name = ref()
const vFocus = {
    mounted:(el:HTMLElement)=>{
        el.focus()
    }
}
const vColor = {
    mounted:(el:HTMLElement, binding)=>{
        console.log(binding)
        el.style.color = binding.value
    }
}

const vClickOutside = {
    mounted(el, binding){
        const clickHandler = (ev)=>{
            if(el.contains(ev.target)){

                return
            }
            if(binding.value && typeof binding.value === 'function'){
                binding.value()
            }
        }
        el._clickOutside = clickHandler
        document.addEventListener('click',el._clickOutside)
    },
    unmounted(el) {
        document.removeEventListener('click', el._clickOutside)
        delete el._clickOutside;
    },
}

function clickoutside(){
    console.log('点击了外面')
}
</script>

<template>
    <h1>自定义指令的使用</h1>
    <input type="text" v-model="name" placeholder="输入名称" v-focus v-click-outside="clickoutside">
    {{ name }}
    <p v-color:a.a="'red'">自定义指令修改颜色</p>
</template>

