import { computed, ref, watch } from 'vue';

type ThemeKey = 'light' | 'dark';

const STORAGE_KEY = 'app-theme';
const PRIME_THEME_LINK_ID = 'prime-theme';

const THEMES: Record<ThemeKey, { name: string; href: string }> = {
  light: {
    name: 'lara-light-blue',
    href: '/lara-light-blue.css'
  },
  dark: {
    name: 'lara-dark-blue',
    href: '/lara-dark-blue.css'
  }
};

const theme = ref<ThemeKey>(getInitialTheme());

if (typeof window !== 'undefined') {
  applyTheme(theme.value);
}

watch(theme, (value) => {
  if (typeof window === 'undefined') {
    return;
  }

  applyTheme(value);
});

function getInitialTheme(): ThemeKey {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeKey | null;

  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;

  return prefersDark ? 'dark' : 'light';
}

function applyTheme(value: ThemeKey) {
  const link = document.getElementById(PRIME_THEME_LINK_ID) as HTMLLinkElement | null;
  const { href } = THEMES[value];

  if (link) {
    link.href = href;
  } else {
    const newLink = document.createElement('link');
    newLink.id = PRIME_THEME_LINK_ID;
    newLink.rel = 'stylesheet';
    newLink.href = href;
    document.head.appendChild(newLink);
  }

  document.documentElement.classList.toggle('dark', value === 'dark');
  window.localStorage.setItem(STORAGE_KEY, value);
}

export function useTheme() {
  const isDark = computed(() => theme.value === 'dark');

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
  };

  const setTheme = (value: ThemeKey) => {
    theme.value = value;
  };

  return {
    theme,
    isDark,
    toggleTheme,
    setTheme
  };
}
