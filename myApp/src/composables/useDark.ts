import { ref, watch, unref } from 'vue';
import { useLocalStorage } from '@vueuse/core';

export function useDark() {
  const isDark = ref(false);
  const colorScheme = ref('');

  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    colorScheme.value = mediaQuery.matches ? 'dark' : 'light';

    const storedValue = useLocalStorage('isDark', null);

    if (storedValue.value === null) {
      isDark.value = mediaQuery.matches;
    } else {
      isDark.value = JSON.parse(storedValue.value);
      console.log('xxxx', typeof unref(isDark))
    }

    watch(isDark, (value: boolean) => {
      console.log('value', typeof value, value)
      document.documentElement.classList.toggle('dark', value);
      console.log('value',value)
      storedValue.value = Boolean(value);
    }, { immediate: true });

    mediaQuery.addListener((event) => {
      storedValue.value = event.matches;
      colorScheme.value = event.matches ? 'dark' : 'light';
      if (storedValue.value === null) {
        isDark.value = event.matches;
      }
    });
  }
  function toggleDark() {
    isDark.value = !isDark.value;
  }

  return { isDark, colorScheme, toggleDark };
}