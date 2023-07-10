import { createSSRApp, ref } from 'vue'

import { renderToString } from 'vue/server-renderer'

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

const app = createSSRApp(myComponent)

renderToString(app).then((html) => {
  console.log(html)
})
