
<script setup lang="ts">
import {ref, computed } from 'vue'
import Home from './Home.vue';
import About from './About.vue';
import NotFound from './404.vue'
const routes = {
    '/': Home,
    '/about': About
}
const currentPath = ref(window.location.hash)
const currentView = computed(()=>{
    return routes[currentPath.value.slice(1) || '/'] || NotFound
})
window.addEventListener('hashchange',()=>{
    currentPath.value = window.location.hash
})

</script>

<template>
  <div>
    <a href="#/">Home</a>
    <a href="#/about">About</a>
    <a href="#/non-existent-path">Broken link</a>
  </div>
  
  <component :is="currentView"></component>
</template>

<style scoped>
</style>
