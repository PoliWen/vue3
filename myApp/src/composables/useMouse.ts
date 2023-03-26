import {onMounted, onUnmounted, ref} from 'vue'
function useEventListener(target:EventTarget,event:string, callback:(e: any )=> void){
    const cleanup = ()=>{
        target.removeEventListener(event,callback)
    }
    onMounted(()=>{
        target.addEventListener(event,callback)
    })
    onUnmounted(()=>{
        cleanup
    })
    return cleanup
}

export function useMouse(){
    const x = ref(0)
    const y = ref(0)
    useEventListener(document,'mousemove',(ev)=>{
        x.value = ev.pageX
        y.value = ev.pageY
    })
    return{
        x,
        y
    }
}