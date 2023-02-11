<script setup lang="ts">
import { ref } from 'vue'
// import setUpPlay from './components/setUpPlay.vue'
// import watch from './components/watch.vue'
import unwatch from './components/unWatch.vue'
import effectScope from './components/effectScope.vue'
</script>
<template>
    <effectScope title="effectScope的使用"/>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
