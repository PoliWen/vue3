import { createSSRApp, ref } from 'vue'
const myComponent = {
  template: `
  <h3>{{ title }}</h3>
  <button @click="count++">{{ count }}</button>`,
  setup(){
    const count = ref(1)
    function increment(){
      count.value++
    }
    const title = 'Vue 3.0 SSR'
    return {
      title,
      count,
      increment
    }
  }
}
export function createApp() {
  return createSSRApp(myComponent)
}