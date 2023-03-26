import { ref, watch, unref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { usePreferredDark } from './usePreferredDark';

export function useDark() {
  const isDark = ref(false)
  const mode = ref('')

  if (typeof window !== 'undefined') {
    const preferredDark = usePreferredDark()
    mode.value = preferredDark.value ? 'dark' : 'light'

    const isDarkStore = useLocalStorage('isDark', null)

    if (isDarkStore.value === null) {
      isDark.value = preferredDark.value
    } else {
      isDark.value = JSON.parse(isDarkStore.value)
    }

    watch(isDark, (value: boolean) => {
      document.documentElement.classList.toggle('dark', value)
      isDarkStore.value = value
    }, { immediate: true })

    watch(preferredDark,(value)=> {
      if (isDarkStore.value === null) {
        isDark.value = value
      }
    })
  }
  function toggleDark() {
    isDark.value = !isDark.value;
  }

  return { isDark, mode, toggleDark }
}