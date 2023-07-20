<template>
  <div>
      <Nav/>
      <h1>文章列表页</h1>
      <ul>
        <li v-for="item,index in articleList">{{ item?.title }}</li>
      </ul>
      <button @click="router.back()">返回</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Nav from '../../components/nav.vue'
import { useFetch } from '../../composables/useFetch'
import { useRouter } from 'vue-router';
interface ArticleItem{
  userId: number;
  id: number;
  title: string;
  body: string;
}
const router = useRouter()
const articleList = ref<ArticleItem[]>()
async function getArticleList(){
  const  data =  await useFetch('http://jsonplaceholder.typicode.com/posts')
  articleList.value = data
}

await getArticleList()
</script>
<style lang="css" scoped>
li{
  text-align: left;
  line-height: 28px;
}
</style>
../../composables/useFetch