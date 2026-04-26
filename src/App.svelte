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

<main>
  <h1>Graph</h1>
  <Graph />
  <h1>Table of Contents for Digital Resources</h1>

  {#each workbooks as wb (wb.href)}
    <section>
      <h2>
        <a href={wb.href}>{wb.title}</a>
      </h2>
      <ul>
        {#each wb.chapters as ch (ch.id)}
          <li>
            <a href={`${wb.href}#${ch.id}`}>
              {ch.chap_num}: {ch.title}
            </a>
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</main>
