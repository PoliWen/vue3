<script setup lang="ts">
</script>

<template>
 <div class="main">
  <Suspense>
    <RouterView></RouterView>
  </Suspense>
 </div>
</template>

<style scoped>
.main{
  max-width: 800px;
  margin: 0 auto;
}
</style>
