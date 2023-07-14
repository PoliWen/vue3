<template>
  <div>
    <h1>SSR 同构渲染原理学习</h1>
    <router-link :to="item.path" v-for="item in nav">{{ item.name }}</router-link>
  </div>
</template>

<script lang="ts" setup>
const nav = [
  {
    name:'首页',
    path:'/'
  },
  {
    name:'文章列表页',
    path:'/article-list'
  }
]
</script>
<style lang="css" scoped>
a{
  margin: 0 20px;
}
</style>
