import { ref, watchEffect, onScopeDispose } from 'vue'

export function useMediaQuery(query: string) {
  const mediaQuery = window.matchMedia(query)
  const matches = ref(mediaQuery.matches)

  const update = () => {
    matches.value = mediaQuery.matches
  }

  mediaQuery.addEventListener('change',update)

  function cleanUp(){
    mediaQuery.removeEventListener('change', update)
  }
  onScopeDispose(cleanUp)

  return matches
}