<script lang="ts">
    import "@fortawesome/fontawesome-free/css/all.min.css";

    export let url: string;

    let failed = false;
    let lastUrl = "";

    function favicon(url: string): string {
        try {
            const normalized = url.startsWith("http") ? url : `https://${url}`;
            const { hostname } = new URL(normalized);
            return `https://${hostname}/favicon.ico`;
        } catch {
            return "";
        }
    }

    $: if (url !== lastUrl) {
        failed = false;
        lastUrl = url;
    }

    $: src = favicon(url);
</script>

{#if src && !failed}
    <img
        src={src}
        alt=""
        class="favicon"
        on:error={() => {
            failed = true;
        }}
    />
{:else}
    <i class="fa-solid fa-book favicon fallback-icon" aria-hidden="true"></i>
{/if}

<style>
    .favicon {
        width: 14px;
        height: 14px;
        flex-shrink: 0;
        opacity: 0.8;
    }

    .fallback-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        line-height: 1;
    }
</style>