
import { createSharedComposable } from './createSharedComposable'
import { ref } from 'vue'
export const useX = createSharedComposable(()=>{
    const x = ref(0)
    function increase(){
        x.value = x.value+1
    }
    return {
        x,
        increase
    }
    
})