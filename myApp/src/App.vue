<script setup lang="ts">
import { ref, provide } from 'vue'
import type {Ref} from 'vue'
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
import veelidate from './components/veelidate.vue'
import propsValidate from './components/propsValidate.vue'
import providePlay from './components/provide.vue'
import attrs from './components/useAttrs.vue'
import customInput from './components/customInput.vue'
import vModel from './components/vModel.vue'
import composiable from './components/composiable.vue'
import composiable2 from './components/conposiable2.vue'
import vueRouter from './components/vueRouter.vue'
import Modal from './components/Modal.vue'
const count = ref(0)
const age = ref(0)
const father = ref({
  name: '大大',
  age:30,
  children:{
    name:'小小',
    age: 3
  }
})
function clickFn(n:string){
  alert(`nativeClick${n}`)
}
function clickSub(n:string){
  alert(n)
}

provide('count',{
  count,
  increaseCount(){
    count.value++
  }
})
function onClick(){
  alert(123)
}
const firstName = ref('')
const lastName = ref('')

const year = ref('2020') as Ref<string | number>
</script>
<template>
   
    <myInput v-model.capitalize="count"/>
    <input type="text" v-model.number="age">
    <veelidate/>
    <propsValidate button-type="success" :father="father" @click.native="clickFn" @click="clickSub"/>
    {{ father.name }}

    <providePlay/>
    <attrs class="attrs" @click="onClick" data-stats="gggg"/>
    <customInput v-model="count"/>
    <vModel v-model:firstName="firstName" v-model:lastName="lastName"/>
    {{ firstName }} {{ lastName }}
    <composiable/>
    <composiable2/>
    <vueRouter/>
 
    <name>main</name>
    <ul class="skip-links">
      <li>
        <a href="#main" ref="skipLink" class="skip-link">Skip to main content</a>
      </li>
    </ul> 

    <Modal>
      <div class="slot">slot</div>
    </modal>
    
</template>

<style scoped lang="scss">
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
:deep(.modal-title){
  background: red;
  .modal-title{
    background: red;
  }
}
</style>
