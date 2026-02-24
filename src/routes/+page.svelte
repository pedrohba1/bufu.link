<script lang="ts">
  import { onMount } from "svelte";
  import figlet from "figlet";

  const links = [
    {
      title: "Copyparty",
      url: "https://your-domain/copyparty",
      img: "/images/copyparty.png",
      desc: "Upload and share files instantly.",
    },
    {
      title: "Minecraft Server",
      url: "https://your-domain/minecraft",
      img: "/images/minecraft.png",
      desc: "See who's online and join the server.",
    },
    {
      title: "Snac2 ActivityPub",
      url: "https://your-domain/snac2",
      img: "/images/activitypub.png",
      desc: "Follow my updates on ActivityPub.",
    },
    {
      title: "Homelab Dashboard",
      url: "https://your-domain/homelab",
      img: "/images/dashboard.png",
      desc: "Monitor services and system status.",
    },
  ];

  const TEXT = "HOMELAB";
  const FONT = "3-D";

  let ascii = "";

  // Initialize and apply theme based on user preference
  let theme: "dark" | "light" = "dark";
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("theme");
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = (saved as string) ?? (prefersDark ? "dark" : "light");
      theme = (initial === "dark" || initial === "light") ? initial : "dark";
      if (document && document.body) {
        document.body.setAttribute("data-theme", theme);
      }
    } catch {
      // ignore storage errors
    }
  }

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    theme = next;
    if (typeof document !== "undefined" && document.body) {
      document.body.setAttribute("data-theme", next);
    }
    try {
      localStorage.setItem("theme", next);
    } catch {
      // ignore
    }
  };

  onMount(() => {
    figlet.text(
      TEXT,
      { font: FONT, horizontalLayout: "default", verticalLayout: "default" },
      (err, data) => {
        if (err || !data) return;
        ascii = data;
      },
    );
    // Determine initial theme
    if (typeof window !== "undefined" && window.localStorage) {
      const saved = localStorage.getItem("theme");
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = (saved as string) ?? (prefersDark ? "dark" : "light");
      theme = (initial === "dark" || initial === "light") ? initial : "dark";
      document.body.setAttribute("data-theme", theme);
    }
  });
</script>

<div class="theme-toggle" aria-label="Toggle theme">
  <button on:click={toggleTheme} class="theme-btn" title="Toggle theme">
    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
  </button>
</div>

<div class="hero">
  <h1 class="sr-only">Homelab</h1>
  <p>This is my own piece of internet land.</p>

  {#if ascii}
    <pre class="ascii-header">{ascii}</pre>
  {/if}

  <p>
    I cover many topics of interest in this website, in no particular order.
    Such as: making your own infrastructure, music, computer science wizardry,
    self-hosting experiments, and whatever else I feel like tinkering with.
  </p>
</div>

<style>
  /* --------------------------------------
     THEME: Dark mode by default
     -------------------------------------- */
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

  .hero {
    text-align: center;
    padding: 4rem 1rem 3rem;
  }

  .hero p {
    font-size: 1.1rem;
    max-width: 600px;
    margin: 0.5rem auto 0;
    line-height: 1.6;
    opacity: 0.85;
  }

  .ascii-header {
    font-family: "JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular,
      Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: 12px;
    line-height: 1.1;
    text-align: center;
    margin: 2.5rem 0 1.5rem;
    white-space: pre;
    /* Gradient text */
    background: linear-gradient(90deg, #4fd1c5, #63b3ed, #b794f4, #f687b3);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    width: 100%;
    max-width: 1200px;
    margin: 2rem auto 4rem;
    padding: 0 1rem;
  }

  .card {
    background: var(--bg-card);
    border-radius: 14px;
    padding: 1rem;
    box-shadow: 0 6px 16px var(--shadow);
    text-align: center;
    transition:
      transform 0.12s ease,
      box-shadow 0.12s ease;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px var(--shadow-hover);
  }

  .card img {
    width: 90%;
    border-radius: 10px;
    margin-bottom: 0.8rem;
  }

  .card h3 {
    margin: 0.4rem 0;
    font-size: 1.3rem;
  }

  .card p {
    font-size: 0.95rem;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  /* Accessible-only h1 */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

  /* Theme toggle styling and positioning */
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

  .theme-btn:hover {
    transform: translateY(-1px);
  }

  /* Light theme overrides */
  :global(body[data-theme="light"]) {
    --bg: #f8f8f8;
    --bg-card: #ffffff;
    --text: #0f0f0f;
    --text-muted: rgba(15, 15, 15, 0.75);
    --shadow: rgba(0, 0, 0, 0.08);
    --shadow-hover: rgba(0, 0, 0, 0.15);
  }
</style>
