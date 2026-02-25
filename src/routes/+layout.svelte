<script lang="ts">
  import { onMount } from 'svelte';

  type Theme = 'dark' | 'light';

  const setThemeAttr = (value: Theme) => {
    if (typeof document === 'undefined') return;
    if (document.body) {
      document.body.setAttribute('data-theme', value);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        document.body?.setAttribute('data-theme', value);
      }, { once: true });
    }
  };

  const getStoredTheme = (): Theme | null => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = window.localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // ignore
    }
    return null;
  };

  const resolvePreferredTheme = (): Theme => {
    if (typeof window === 'undefined') return 'dark';
    const stored = getStoredTheme();
    if (stored) return stored;
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
    return prefersDark ? 'dark' : 'light';
  };

  const initialTheme: Theme = (() => {
    const next = resolvePreferredTheme();
    setThemeAttr(next);
    return next;
  })();

  let theme: Theme = initialTheme;

  const persistTheme = (next: Theme) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('theme', next);
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    theme = next;
    setThemeAttr(next);
    persistTheme(next);
  };

  onMount(() => {
    const preferred = resolvePreferredTheme();
    if (preferred !== theme) {
      theme = preferred;
      setThemeAttr(preferred);
    }
  });
</script>

<div class="layout-root">
  <div class="theme-toggle" aria-label="Toggle theme">
    <button on:click={toggleTheme} class="theme-btn" title="Toggle theme">
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </button>
  </div>
  <slot />
</div>

<style>
  :global(:root) {
    --bg: #0f0f0f;
    --bg-card: #1a1a1a;
    --text: #f2f2f2;
    --text-muted: rgba(242, 242, 242, 0.75);
    --shadow: rgba(0, 0, 0, 0.6);
    --shadow-hover: rgba(0, 0, 0, 0.8);
  }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family:
      "Noto Serif",
      Georgia,
      "Times New Roman",
      serif,
      system-ui,
      -apple-system,
      "Inter",
      Roboto,
      sans-serif;
    background: var(--bg);
    color: var(--text);
  }

  /* Layout helper */
.layout-root { min-height: 100%; }

.theme-toggle {
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 999;
}

.theme-btn {
  background: var(--bg-card);
  color: var(--text);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.theme-btn:hover { transform: translateY(-1px); }

  :global(body[data-theme="light"]) {
    --bg: #f8f8f8;
    --bg-card: #ffffff;
    --text: #0f0f0f;
    --text-muted: rgba(15,15,15,0.75);
    --shadow: rgba(0,0,0,0.08);
    --shadow-hover: rgba(0,0,0,0.15);
  }

  :global(body[data-theme="dark"] svg),
  :global(body[data-theme="dark"] img[src$=".svg"]) {
    filter: invert(1);
  }
</style>
