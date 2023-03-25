
<script setup lang="ts">
// import Modal from './Modal.vue'
import { inject } from 'vue'
const {count,increaseCount} = inject('count') 

</script>

<template>

  <div class="provide">
  <div>
   <button @click.stop="increaseCount">{{count}}</button>
  </div>
  <teleport to='body'>
  <Modal>
      <div class="slot">slot</div>
    </modal>
  </teleport>
</div>
    
</template>

