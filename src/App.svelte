<script lang="ts">
  import { onMount } from 'svelte';
  import Graph from './lib/Graph.svelte';

  interface Workbook {
    title: string;
    href: string;
    pdf: string;
    chapters: Array<{
      id: string;
      title: string;
      chap_num: number;
    }>;
  }

  let workbooks: Workbook[] = [];

  onMount(async () => {
    const res = await fetch('./workbooks.json');
    workbooks = await res.json();
  });
</script>

<header class="site-header">
  <img src="./color_spiral.svg" alt="Kontinua logo" class="site-logo" />
  <div class="site-title">
    <h1>Kontinua</h1>
    <p>Open curriculum for science and mathematics</p>
  </div>
</header>

<main>
  <section class="graph-section">
    <h2>Topic Graph</h2>
    <Graph />
  </section>

  <section class="toc-section">
    <h2>Table of Contents</h2>
    <div class="workbook-grid">
      {#each workbooks as wb (wb.href)}
        <div class="workbook-card">
          <h3>
            <a href={wb.href}>{wb.title}</a>
          </h3>
          <ol>
            {#each wb.chapters as ch (ch.id)}
              <li>
                <a href={`${wb.href}#${ch.id}`}>{ch.title}</a>
              </li>
            {/each}
          </ol>
        </div>
      {/each}
    </div>
  </section>
</main>

<style>
  .site-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem 2rem;
    border-bottom: 2px solid var(--sdkblue);
    max-width: var(--width-content);
    margin: 0 auto;
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
    padding-left: 1.2rem;
  }

  .workbook-card li {
    font-size: 0.85rem;
    line-height: 1.6;
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
    text-decoration: none;
  }

  .workbook-card h3 a:hover {
    text-decoration: underline;
  }
</style>
