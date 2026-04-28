<script lang="ts">
  import type { Workbook, TopicMeta } from './types';

  export let workbook: Workbook;
  export let topicIndex: Record<string, TopicMeta>;
</script>

<div class="workbook-detail">
  <div class="workbook-header">
    <h1>{workbook.title}</h1>
    <a href={workbook.pdf} target="_blank" class="pdf-btn">Download PDF</a>
  </div>

  {#each workbook.chapters as chapter (chapter.id)}
    <section class="chapter" id={chapter.id}>
      <h2>Chapter {chapter.chap_num}: {chapter.title}</h2>
      <a href="{chapter.id}.pdf" class="chapter-pdf">PDF</a>

      {#if chapter.files.length > 0}
        <h3>Downloads</h3>
        <ul>
          {#each chapter.files as file (file.path)}
            <li><a href={file.link}>{file.desc}</a></li>
          {/each}
        </ul>
      {/if}

      {#if chapter.covers.length > 0}
        <h3>Objectives</h3>
        {#each chapter.covers as topic (topic.id)}
          <div class="topic" id={topic.id}>
            <h4>{topic.desc || topic.id}</h4>
            {#if topic.videos.length > 0 || topic.references.length > 0}
              <ul>
                {#each topic.videos as v (v.url)}
                  <li>Video: <a href={v.url} target="_blank" rel="noopener">{v.title}</a></li>
                {/each}
                {#each topic.references as r (r.url)}
                  <li>Reference: <a href={r.url} target="_blank" rel="noopener">{r.title}</a></li>
                {/each}
              </ul>
            {/if}
          </div>
        {/each}
      {/if}

      {#if chapter.requires.length > 0}
        <h3>Prerequisites</h3>
        <ul>
          {#each chapter.requires as topicId (topicId)}
            {#if topicIndex[topicId]}
              {@const meta = topicIndex[topicId]}
              <li>
                <a href="#workbook/{meta.workbookNum}#{topicId}">
                  {meta.desc}
                </a>
                from Chapter {meta.chapterNum}: "{meta.chapterTitle}" in Workbook {meta.workbookNum}
              </li>
            {:else}
              <li>{topicId}</li>
            {/if}
          {/each}
        </ul>
      {/if}
    </section>
    <hr />
  {/each}
</div>

<style>
  .workbook-detail {
    padding: 1rem 0;
  }

  .workbook-header {
    display: flex;
    align-items: baseline;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .workbook-header h1 {
    margin: 0;
  }

  .pdf-btn {
    font-size: 0.85rem;
    padding: 0.3rem 0.8rem;
    white-space: nowrap;
  }

  .chapter {
    display: block;
    margin-bottom: 1.5rem;
  }

  .chapter-pdf {
    font-size: 0.8rem;
    margin-left: 0.5rem;
  }

  .topic {
    margin-bottom: 0.75rem;
  }

  .topic h4 {
    margin: 0.5rem 0 0.25rem;
  }

  .topic ul {
    margin: 0.25rem 0 0.25rem 1.5rem;
    padding: 0;
  }

  .topic li {
    font-size: 0.9rem;
    line-height: 1.6;
  }

  ul {
    padding-left: 1.5rem;
  }

  li {
    line-height: 1.7;
  }

  a {
    font-weight: normal;
  }
</style>
