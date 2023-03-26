import { ref, onMounted, watchEffect ,Ref, unref, watch, ComputedRef, computed} from 'vue';

type MaybeRef<T> = Ref<T> | T
type MaybeComputedRef<T> = MaybeRef<T> | (()=> T) | ComputedRef<T>
function resolveRef<T>(input: MaybeRef<T>): Ref<T> {
  return typeof input === 'function'
     ? computed(input)
     : ref(input)
}

export function useTitle(
    newTitle: MaybeComputedRef<string | null | undefined>
) {
  const title = ref(resolveRef(newTitle ?? document.title))
  watch(title,(t)=>{
    if(t !== null)
        document.title = t;
  },{ immediate: true })

  return {
    title,
  };
}