<script lang="ts">
    import "@fortawesome/fontawesome-free/css/all.min.css";

    export let url: string;

    let failed = false;
    let lastUrl = "";

    function getHostname(url: string): string | null {
        try {
            const normalized = url.startsWith("http") ? url : `https://${url}`;
            return new URL(normalized).hostname;
        } catch {
            return null;
        }
    }

    function getMainIcons(hostname: string | null): string | null {
        if (!hostname) return null;

        if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
            return "fa-brands fa-youtube";
        }

        if (hostname.includes("wikipedia.org")) {
            return "fa-brands fa-wikipedia-w";
        }
        
        if (hostname.includes("github.com")) {
            return "fa-brands fa-github"; 
            // fa-solid fa-code-merge
            // fa-solid fa-code-commit
            // fa-brands fa-github
            // fa-brands fa-git
            // fa-brands fa-github-alt
            // fa-brands fa-square-github
            // fa-regular fa-file-code"
        }

        return null;
    }

    function favicon(url: string): string {
        try {
            const normalized = url.startsWith("http") ? url : `https://${url}`;
            const { hostname } = new URL(normalized);
            return `https://${hostname}/favicon.ico`;
        } catch {
            return "";
        }
    }

    $: hostname = getHostname(url);
    $: mainIcons = getMainIcons(hostname);

    $: if (url !== lastUrl) {
        failed = false;
        lastUrl = url;
    }

    $: src = favicon(url);
</script>

{#if mainIcons}
    <i class={mainIcons + " favicon fallback-icon"} aria-hidden="true"></i>
{:else if src && !failed}
    <img
        src={src}
        alt=""
        class="favicon"
        on:error={() => (failed = true)}
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