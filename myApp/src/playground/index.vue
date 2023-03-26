
<script setup lang="ts">
import { MaybeRef } from '@vueuse/core';
import { ref, computed, unref, Ref, ComputedRef} from 'vue'
import { useDark, useTitle } from '../composables/index'
const { isDark, toggleDark } = useDark()
const title = ref('hello world')
useTitle(title)

function changeTitle(){
    title.value = 'change title'
}

function add(a: Ref<number>, b: Ref<number>){
    return computed(()=> a.value + b.value)
}
const a = ref(1)
const b = ref(2)
const c = add(a,b)
console.log(unref(c)) // 3

a.value = 2
console.log(unref(c)) // 4

type MaybeComputedRef<T> = MaybeRef<T> | (()=> T) | ComputedRef<T>

</script>

<template>
  <button @click="toggleDark">is dark {{isDark}}</button>
  <button @click="changeTitle">{{ title }}</button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
