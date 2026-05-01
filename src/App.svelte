<script lang="ts">
  import { onMount } from 'svelte';
  import MoonStar from 'lucide-svelte/icons/moon-star';
  import Sun from 'lucide-svelte/icons/sun';
  import Graph from './lib/Graph.svelte';
  import WorkbookDetail from './lib/WorkbookDetail.svelte';
  import type { Workbook, TopicMeta } from './lib/types';

  type ThemeMode = 'light' | 'dark';
  const THEME_STORAGE_KEY = 'kontinua-theme';
  const THEME_META_SELECTOR = 'meta[name="theme-color"]';

  let workbooks: Workbook[] = [];
  let currentWorkbookNum: string | null = null;
  let anchor: string | null = null;
  let theme: ThemeMode = 'light';
  let followsSystemTheme = true;

  $: currentWorkbook = workbooks.find((wb) => wb.num === currentWorkbookNum) ?? null;

  $: topicIndex = buildTopicIndex(workbooks);

  function buildTopicIndex(wbs: Workbook[]): Record<string, TopicMeta> {
    const index: Record<string, TopicMeta> = {};
    for (const wb of wbs) {
      for (const ch of wb.chapters) {
        for (const topic of ch.covers) {
          index[topic.id] = {
            workbookNum: wb.num,
            chapterNum: ch.chap_num,
            chapterTitle: ch.title,
            desc: topic.desc,
          };
        }
      }
    }
    return index;
  }

  function parseHash() {
    // Hash format: #workbook/01  or  #workbook/01#topic-id
    // window.location.hash gives e.g. "#workbook/01"
    // A second # within the hash value isn't possible in URLs, so we use
    // the format #workbook/01/topic/stats_mean for topic deep-links
    const raw = window.location.hash.slice(1);
    const topicMatch = raw.match(/^workbook\/(\d+)\/topic\/(.+)$/);
    const wbMatch = raw.match(/^workbook\/(\d+)/);
    if (topicMatch) {
      currentWorkbookNum = topicMatch[1];
      anchor = topicMatch[2];
    } else if (wbMatch) {
      currentWorkbookNum = wbMatch[1];
      anchor = null;
    } else {
      currentWorkbookNum = null;
      anchor = null;
    }
  }

  function scrollToAnchor(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function updateBrowserThemeColor(nextTheme: ThemeMode) {
    const meta = document.querySelector<HTMLMetaElement>(THEME_META_SELECTOR);
    if (meta) meta.content = nextTheme === 'dark' ? '#0e1220' : '#ffffff';
  }

  function applyTheme(nextTheme: ThemeMode) {
    theme = nextTheme;
    document.documentElement.dataset.theme = nextTheme;
    updateBrowserThemeColor(nextTheme);
  }

  function readStoredTheme(): ThemeMode | null {
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      return stored === 'dark' || stored === 'light' ? stored : null;
    } catch (error) {
      console.warn('Unable to read saved theme preference.', error);
      return null;
    }
  }

  function persistTheme(nextTheme: ThemeMode) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (error) {
      console.warn('Unable to store theme preference.', error);
    }
  }

  function applySystemTheme(prefersDark?: boolean) {
    const shouldUseDark = prefersDark ?? window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(shouldUseDark ? 'dark' : 'light');
  }

  function toggleTheme() {
    followsSystemTheme = false;
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    persistTheme(nextTheme);
  }

  onMount(() => {
    const storedTheme = readStoredTheme();
    followsSystemTheme = storedTheme === null;
    if (storedTheme) {
      applyTheme(storedTheme);
    } else {
      applySystemTheme();
    }

    const systemThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemThemeChange = (event: MediaQueryListEvent) => {
      if (followsSystemTheme) {
        applySystemTheme(event.matches);
      }
    };
    systemThemeMediaQuery.addEventListener('change', onSystemThemeChange);

    const onHashChange = () => {
      parseHash();
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);

    const loadWorkbooks = async () => {
      const res = await fetch('./workbooks.json');
      workbooks = await res.json();
      parseHash();
    };
    void loadWorkbooks().catch((error) => {
      console.error('Failed to load workbook data:', error);
    });

    return () => {
      window.removeEventListener('hashchange', onHashChange);
      systemThemeMediaQuery.removeEventListener('change', onSystemThemeChange);
    };
  });

  $: if (currentWorkbook && anchor) {
    setTimeout(() => scrollToAnchor(anchor!), 50);
  }
</script>

<header class="site-header">
  <a href="#/" class="brand">
    <img src="./color_spiral.svg" alt="Kontinua logo" class="site-logo" />
    <div class="site-title">
      <h1>Kontinua</h1>
      <p>Open curriculum for science and mathematics</p>
    </div>
  </a>
  <div class="header-actions">
    {#if currentWorkbook}
      <nav class="breadcrumb">
        <a href="#/">← All Workbooks</a>
      </nav>
    {/if}
    <button
      type="button"
      class="theme-toggle"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-pressed={theme === 'dark'}
      on:click={toggleTheme}
    >
      {#if theme === 'dark'}
        <Sun />
      {:else}
        <MoonStar />
      {/if}
    </button>
  </div>
</header>

<main>
  {#if currentWorkbook}
    <WorkbookDetail workbook={currentWorkbook} {topicIndex} />
  {:else}
    <section class="graph-section">
      <h2>Topic Graph</h2>
      <Graph />
    </section>

    <section class="toc-section">
      <h2>Table of Contents</h2>
      <div class="workbook-grid">
        {#each workbooks as wb (wb.num)}
          <div class="workbook-card">
            <h3>
              <a href="#workbook/{wb.num}">{wb.title}</a>
            </h3>
            <ol>
              {#each wb.chapters as ch (ch.id)}
                <li>
                  <a href="#workbook/{wb.num}/topic/{ch.id}">{ch.title}</a>
                </li>
              {/each}
            </ol>
          </div>
        {/each}
      </div>
    </section>
  {/if}
</main>

<style>
  .site-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.5rem 2rem;
    border-bottom: 2px solid var(--sdkblue);
    max-width: var(--width-content);
    margin: 0 auto;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    text-decoration: none;
    font-weight: normal;
  }

  .site-logo {
    width: 64px;
    height: auto;
    flex-shrink: 0;
  }

  .site-title h1 {
    margin: 0;
    font-size: 1.8rem;
    color: var(--sdkblue);
  }

  .site-title p {
    margin: 0.2rem 0 0;
    color: var(--color-text-secondary);
    font-size: 0.9rem;
  }

  .header-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.8rem;
    flex-wrap: nowrap;
  }

  .breadcrumb {
    margin: 0;
    display: flex;
    align-items: center;
  }

  .breadcrumb a {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    text-decoration: none;
    font-weight: normal;
    margin: 0;
    padding: 0;
  }

  .breadcrumb a:hover {
    color: var(--color-link);
  }

  .theme-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    min-height: 44px;
    margin: 0;
    padding: 0;
    border: 1px solid var(--color-bg-secondary);
    border-radius: 50%;
    background: var(--color-bg);
    color: var(--color-text);
    box-shadow: 0 10px 24px -20px var(--color-link);
    transition: none;
  }

  .theme-toggle:hover {
    border-color: var(--color-bg-secondary);
    box-shadow: 0 10px 24px -20px var(--color-link);
  }

  .theme-toggle:focus-visible {
    outline: 3px solid var(--color-link);
    outline-offset: 2px;
  }

  .theme-toggle :global(svg) {
    width: 1.1rem;
    height: 1.1rem;
    flex-shrink: 0;
    transition: none;
  }

  .graph-section,
  .toc-section {
    display: block;
    padding: 1.5rem 2rem;
    max-width: var(--width-content);
    margin: 0 auto;
  }

  .graph-section h2,
  .toc-section h2 {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  .workbook-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  .workbook-card {
    border: 1px solid var(--color-bg-secondary);
    border-radius: var(--border-radius);
    padding: 1rem 1.25rem;
  }

  .workbook-card h3 {
    margin: 0 0 0.5rem;
    text-indent: 0;
    font-size: 1rem;
  }

  .workbook-card ol {
    margin: 0;
    padding-left: 0;
    list-style: none;
    counter-reset: item;
  }

  .workbook-card li {
    font-size: 0.85rem;
    line-height: 1.6;
    display: flex;
    gap: 0.3rem;
  }

  .workbook-card li::before {
    content: counter(item) ".";
    counter-increment: item;
    flex-shrink: 0;
    color: var(--color-text-secondary);
  }



  .workbook-card a {
    font-weight: normal;
    text-decoration: none;
    color: var(--color-text);
  }

  .workbook-card a:hover {
    color: var(--color-link);
    text-decoration: underline;
  }

  .workbook-card h3 a {
    font-weight: bold;
    color: var(--sdkblue);
  }

  .workbook-card h3 a:hover {
    text-decoration: underline;
  }

  @media (max-width: 700px) {
    .site-header {
      align-items: flex-start;
      flex-direction: column;
      padding: 1.2rem 1.2rem 1rem;
    }

    .header-actions {
      width: 100%;
      justify-content: space-between;
    }
  }
</style>
