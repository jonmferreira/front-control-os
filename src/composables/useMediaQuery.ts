import { onBeforeUnmount, onMounted, ref } from 'vue';

export function useMediaQuery(query: string) {
  const matches = ref(false);
  let mediaQuery: MediaQueryList | undefined;

  const update = () => {
    if (mediaQuery) {
      matches.value = mediaQuery.matches;
    }
  };

  onMounted(() => {
    if (typeof window === 'undefined') {
      return;
    }

    mediaQuery = window.matchMedia(query);
    update();

    mediaQuery.addEventListener('change', update);
  });

  onBeforeUnmount(() => {
    mediaQuery?.removeEventListener('change', update);
  });

  return matches;
}
