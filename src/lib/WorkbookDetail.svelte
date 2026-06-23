<script lang="ts">
  import Graph from "./Graph.svelte";
  import type { Workbook, TopicMeta } from "./types";
  import ResourceIcon from "./ResourceIcon.svelte";

  import {
    dedupByUrl,
    dedupStrings,
    loadPageCounts
  } from "./pdfHelpers";


  export let workbook: Workbook;
  export let topicIndex: Record<string, TopicMeta>;
  export let theme: "light" | "dark" = "light";

  $: curr = Math.min(
    36,
    Math.max(1, Number.isNaN(Number(workbook?.num)) ? 1 : Number(workbook.num)),
  );
  let activeGraphChapter: string | null = null;
  let chapterPages: Record<string, number> = {};
  let workbookPages: number | null = null;

  $: if (workbook) {
    (async () => {
      const { chapterPages: pages, workbookPages: total } = await loadPageCounts(workbook);
      chapterPages = pages;
      workbookPages = total;
    })();
  }
</script>

<div class="workbook-detail">
  <div class="workbook-header">
    <div>
      <h1>{workbook.title}</h1>
      <div class="title-row">
        {#if workbookPages}
          <span class="page-count">{workbookPages} pages</span>
        {/if}
      </div>
    </div>
    <a href={workbook.pdf} target="_blank" rel="noopener" class="pdf-btn">
      Download Workbook PDF
    </a>
  </div>

  {#each workbook.chapters as chapter (chapter.id)}
    <div class="chapter-card" id={chapter.id}>
      <div class="chapter-header">
        <h2>Chapter {chapter.chap_num}: {chapter.title}</h2>
        <a
          href={`${chapter.id}.pdf`}
          target="_blank"
          rel="noopener"
          class="chapter-pdf-link"
        >
          PDF
        </a>

        {#if chapterPages[chapter.id]}
          <span class="page-count">{chapterPages[chapter.id]} pages</span>
        {/if}
      </div>

      {#if chapter.files.length > 0}
        <div class="section">
          <h3>Downloads</h3>
          <ul class="link-list">
            {#each chapter.files as file (file.path)}
              <li>
                <ResourceIcon url={file.link}></ResourceIcon>
                <a href={file.link} target="_blank" rel="noopener"
                  >{file.desc}</a
                >
              </li>
            {/each}
          </ul>
        </div>
      {/if}

      {#if chapter.covers.length > 0}
        <div class="section">
          <h3>Objectives</h3>
          {#each chapter.covers as topic (topic.id)}
            <div class="topic" id={topic.id}>
              <p class="topic-desc">{topic.desc || topic.id}</p>
              {#if topic.videos.length > 0 || topic.references.length > 0}
                <ul class="link-list">
                  {#each dedupByUrl(topic.videos) as v (v.url)}
                    <li>
                      <ResourceIcon url={v.url}></ResourceIcon>
                      <a href={v.url} target="_blank" rel="noopener"
                        >{v.title}</a
                      >
                    </li>
                  {/each}
                  {#each dedupByUrl(topic.references) as r (r.url)}
                    <li>
                      <ResourceIcon url={r.url}></ResourceIcon>
                      <a href={r.url} target="_blank" rel="noopener"
                        >{r.title}</a
                      >
                    </li>
                  {/each}
                </ul>
              {/if}
            </div>
          {/each}
        </div>
      {/if}

      {#if chapter.requires.length > 0}
        <div class="section prereqs">
          <h3>Prerequisites</h3>
          <ul class="prereq-list">
            {#each dedupStrings(chapter.requires) as topicId (topicId)}
              {#if topicIndex[topicId]}
                {@const meta = topicIndex[topicId]}
                <li>
                  <a href="#workbook/{meta.workbookNum}/topic/{topicId}"
                    >{meta.desc}</a
                  >
                  <span class="prereq-source">
                    — Ch. {meta.chapterNum}: "{meta.chapterTitle}", Workbook {meta.workbookNum}
                  </span>
                </li>
              {:else}
                <li class="missing">{topicId}</li>
              {/if}
            {/each}
          </ul>
        </div>
      {/if}
      <div class="chapter-graph">
        <h3>Chapter Graph</h3>

        {#if activeGraphChapter === chapter.id}
          <Graph
            {theme}
            originChapter={chapter.id}
            maxDepth={2}
            scalingRatio={100}
            heightPx={200}
          />
          <!-- maxDepth could be changed to 1 for simpler prerequisite visualization -->
        {:else}
          <button
            class="chapter-graph-button"
            on:click={() => (activeGraphChapter = chapter.id)}
          >
            Load Chapter Graph
          </button>
        {/if}
      </div>
    </div>
  {/each}
  <!-- next workbook buttons here :) -->
  <div class="workbook-nav">
    <a
      href={curr > 1 ? `#workbook/${String(curr - 1).padStart(2, "0")}` : "#"}
      aria-disabled={curr === 1}
      class="next-workbook-href"
    >
      ← Previous Workbook
    </a>

    <a
      href={curr < 36 ? `#workbook/${String(curr + 1).padStart(2, "0")}` : "#"}
      aria-disabled={curr === 36}
      class="next-workbook-href"
    >
      Next Workbook →
    </a>
  </div>
</div>

<style>
  .workbook-detail {
    padding: 1.5rem 0.5rem;
  }

  .workbook-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--sdkblue);
  }

  .workbook-header h1 {
    margin: 0;
    color: var(--sdkblue);
  }

  /* Changed to be consistent with other buttons, here is the previous css */
  /* .pdf-btn {
    display: inline-block;
    padding: 0.4rem 1rem;
    background: var(--sdkblue);
    color: #fff;
    border-radius: var(--border-radius);
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 600;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .pdf-btn:hover {
    filter: brightness(1.15);
  } */
  .pdf-btn {
    appearance: none;
    background: transparent;
    font-family: inherit;
    cursor: pointer;

    display: inline-block;
    padding: 0.1rem 0.45rem;
    font-size: 0.9rem;
    padding: 0.3rem 0.8rem; 
    font-weight: 600;
    color: var(--sdkblue);
    white-space: nowrap;
    text-decoration: none;

    border: 2px solid var(--sdkblue);
    border-radius: 6px;

    opacity: 0.75;
    transition:
      opacity 0.15s,
      background 0.15s,
      color 0.15s;
  }

  .pdf-btn:hover {
    opacity: 1;
    background: var(--sdkblue);
    color: #fff;
  }

  .chapter-card {
    border: 1px solid var(--color-bg-secondary);
    border-radius: var(--border-radius);
    padding: 1.25rem 1.5rem;
    margin-bottom: 1.25rem;
  }

  .chapter-header {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .chapter-header h2 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--sdkblue);
    text-indent: 0;
  }

  .chapter-pdf-link {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--sdkblue);
    text-decoration: none;
    white-space: nowrap;
    border: 1.5px solid var(--sdkblue);
    border-radius: 4px;
    padding: 0.1rem 0.45rem;
    opacity: 0.75;
    transition:
      opacity 0.15s,
      background 0.15s,
      color 0.15s;
  }

  .chapter-pdf-link:hover {
    opacity: 1;
    background: var(--sdkblue);
    color: #fff;
  }

  .section {
    margin-top: 0.75rem;
  }

  .section h3 {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-secondary);
    margin: 0 0 0.4rem;
    text-indent: 0;
  }

  .topic {
    margin-bottom: 0.6rem;
  }

  .topic-desc {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0 0 0.2rem;
    color: var(--color-text);
  }

  .link-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .link-list li {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.85rem;
    line-height: 1.7;
    padding-left: 0.5rem;
  }

  .link-list a {
    font-weight: normal;
    color: var(--color-link);
    text-decoration: none;
  }

  .link-list a:hover {
    text-decoration: underline;
  }

  .prereqs {
    border-top: 1px solid var(--color-bg-secondary);
    padding-top: 0.75rem;
    margin-top: 0.75rem;
  }

  .prereq-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .prereq-list li {
    font-size: 0.85rem;
    line-height: 1.7;
    padding-left: 0.5rem;
  }

  .prereq-list a {
    font-weight: 600;
    text-decoration: none;
    color: var(--color-link);
  }

  .prereq-list a:hover {
    text-decoration: underline;
  }

  .prereq-source {
    color: var(--color-text-secondary);
    font-weight: normal;
  }

  .missing {
    color: var(--color-text-secondary);
    font-size: 0.85rem;
  }

  .chapter-graph {
    border-top: 1px solid var(--color-bg-secondary);
    padding-top: 0.75rem;
    margin-top: 0.75rem;
  }
  .chapter-graph h3 {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-secondary);
    margin: 0 0 0.4rem;
    text-indent: 0;
  }
  .chapter-graph-button {
    appearance: none;
    background: transparent;
    font-family: inherit;
    cursor: pointer;

    font-size: 0.7rem;
    font-weight: 600;
    color: var(--sdkblue);
    white-space: nowrap;
    border: 1.5px solid var(--sdkblue);
    border-radius: 4px;
    padding: 0.1rem 0.45rem;
    opacity: 0.75;
    transition:
      opacity 0.15s,
      background 0.15s,
      color 0.15s;
  }

  .chapter-graph-button:hover {
    opacity: 1;
    background: var(--sdkblue);
    color: #fff;
  }

  .workbook-nav {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .next-workbook-href {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--sdkblue);
    text-decoration: none;
    white-space: nowrap;
    border: 1.5px solid var(--sdkblue);
    border-radius: 4px;
    padding: 0.1rem 0.45rem;
    opacity: 0.75;
    transition:
      opacity 0.15s,
      background 0.15s,
      color 0.15s;
  }
  .next-workbook-href:hover {
    opacity: 1;
    background: var(--sdkblue);
    color: #fff;
  }
  .title-row {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .page-count {
    font-size: 0.8rem;
    margin-top: 0.5rem;
    color: var(--color-text-secondary);
    white-space: nowrap;
  }
</style>
