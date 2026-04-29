<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import Sigma from "sigma";
    import forceAtlas2 from "graphology-layout-forceatlas2";
    import { DirectedGraph } from "graphology";

    type GraphData = Record<string, { workbook: number; prereqs: string[] }>;

    let container: HTMLDivElement;
    let wrapper: HTMLDivElement;
    let renderer: Sigma | null = null;
    let active = false;

    function activate() {
        active = true;
    }

    function deactivate() {
        active = false;
    }
    onMount(() => {
        fetch("/graph.json")
            .then((res) => res.json())
            .then((graphData: GraphData) => {
              const graph = new DirectedGraph();
   
               const X_SPACING = 180;
               const Y_SPACING = 240;
  
               
               const byWorkbook = new Map<number, Array<[string, GraphData[string]]>>();
   
               
               Object.entries(graphData).forEach(([key, value]) => {
                   if (!byWorkbook.has(value.workbook)) {
                       byWorkbook.set(value.workbook, []);
                   }
                   byWorkbook.get(value.workbook)!.push([key, value]);
               });
   
               for (const [workbook, chapters] of byWorkbook) {
                   const chaps = chapters.length;
                   const mid = (chaps - 1) / 2;
   
                   chapters.forEach(([key, value], index) => {
                       graph.addNode(key, {
                           label: key.replaceAll("_", " "),
                           workbook: value.workbook,
                           url: `#workbook/${String(value.workbook).padStart(2, "0")}/topic/${key}`,
                           x: (workbook - 1) * X_SPACING,
                           y: (index - mid) * - Y_SPACING,
                           size: 5,
                           color: value.prereqs.length === 0 ? "#2ecc71" : "#3498db",
                       });
                       
                   });
               }
      
               Object.entries(graphData).forEach(([key, value]) => {
                   value.prereqs.forEach((prereq) => {
                       const prereqNode = graphData[prereq];
                       if (!prereqNode) return;
               
                       if (prereqNode.workbook != value.workbook) {
                           graph.addEdge(prereq, key, {
                               color: "#d0d0d0",
                               size: 0.25,
                           });
                       }
                   });
               });
               const maxY = Math.max(
                   ...graph.nodes().map((n) => graph.getNodeAttribute(n, "y"))
               );
               
               const WORKBOOK_ICON_Y = maxY + 120;
               for (const [workbook] of byWorkbook) {
                 graph.addNode(`workbook-${workbook}`, {
                     label: `${String(workbook).padStart(2, "0")}`,
                     x: ((workbook - 1) * X_SPACING) - 120,
                     y: WORKBOOK_ICON_Y,
                     size: 10,
                     color: "rgba(0,0,0,0)"
                 });
               }
                // Object.entries(graphData).forEach(([topic, value]) => {
                //     value.prereqs.forEach((prereq) => {
                //         const edgeId = `${prereq}->${topic}`;
                //         if (
                //             graph.hasNode(prereq) &&
                //             graph.hasNode(topic) &&
                //             !graph.hasEdge(edgeId)
                //         ) {
                //             graph.addEdgeWithKey(edgeId, prereq, topic, {
                //                 type: "arrow",
                //                 size: 0.25,
                //                 color: "#c5c5c5",
                //             });
                //         }
                //     });
                // });

                // forceAtlas2.assign(graph, {
                //     iterations: 300,
                //     settings: {
                //         scalingRatio: 60,
                //         gravity: 0.2,
                //         adjustSizes: true,
                //         strongGravityMode: false,
                //     },
                // });

                const renderer = new Sigma(graph, container, {
                    labelFont: "Inter, system-ui, sans-serif",
                    labelSize: 12,
                    labelWeight: "500",
                });

                renderer.on("clickNode", ({ node }) => {
                    const url = graph.getNodeAttribute(node, "url") as string;
                    if (url) window.location.hash = url.slice(1); // strip leading #
                });
            })
            .catch((err) => {
                console.error("Failed to load graph.json:", err);
            });
    });

    onDestroy(() => {
        renderer?.kill();
    });
</script>

<div
    class="graph-wrapper"
    bind:this={wrapper}
    on:mouseleave={deactivate}
    role="application"
    aria-label="Topic dependency graph"
>
    <div bind:this={container} class="graph-canvas"></div>
    {#if !active}
        <div
            class="graph-overlay"
            on:click={activate}
            role="button"
            tabindex="0"
            on:keydown={(e) => e.key === "Enter" && activate()}
        >
            <span>Click to interact</span>
        </div>
    {/if}
</div>

<style>
    .graph-wrapper {
        position: relative;
        width: 100%;
        height: 500px;
        border: 1px solid var(--color-bg-secondary);
        border-radius: var(--border-radius);
        overflow: hidden;
    }

    .graph-canvas {
        width: 100%;
        height: 100%;
    }

    .graph-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.15);
        cursor: pointer;
        transition: background 0.15s;
    }

    .graph-overlay:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    .graph-overlay span {
        background: rgba(0, 0, 0, 0.55);
        color: #fff;
        font-size: 0.85rem;
        padding: 0.4rem 0.9rem;
        border-radius: 999px;
        pointer-events: none;
    }
</style>
