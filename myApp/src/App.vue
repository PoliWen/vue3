<script setup lang="ts">
import { ref } from 'vue'
import setUpPlay from './components/setUpPlay.vue'
import watch from './components/watch.vue'
import unwatch from './components/unWatch.vue'
import effectScope from './components/effectScope.vue'
import computedCom from './components/computed.vue'
import useMouse from './components/useMouse.vue'
import reactive from './components/reactive.vue'
import customRef from './components/customRef.vue'
import directive from './components/directive.vue'
import myInput from './components/myInput.vue'
const count = ref('')
const age = ref(0)
</script>
<template>
    <myInput v-model.capitalize="count"/>
    <input type="text" v-model.number="age">
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
