import { ref } from "vue";
import { defineStore } from "pinia";

export const useCountStore = defineStore("count", () => {
  const count = ref(0);
  function increment(){
    count.value++
  };

  if (import.meta.env.SSR) {
    count.value = 3; // 服务端渲染时 count 的初始值为 3
  }

  return { count, increment };
});
