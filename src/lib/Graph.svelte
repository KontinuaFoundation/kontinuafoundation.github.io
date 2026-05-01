<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import Sigma from "sigma";
    import { DirectedGraph } from "graphology";
    import type { EdgeDisplayData, NodeDisplayData } from "sigma/types";
    import FA2Layout from "graphology-layout-forceatlas2/worker";
    import forceAtlas2 from "graphology-layout-forceatlas2";

    type GraphData = Record<string, { workbook: number; prereqs: string[] }>;

    let container: HTMLDivElement;
    let wrapper: HTMLDivElement;
    let renderer: Sigma | null = null;
    let graph: DirectedGraph | null = null;
    let active = false;
    let layout: ForceSupervisor | null = null;

    // https://www.sigmajs.org/storybook/?path=/story/use-reducers--story
    interface State {
        hoveredNode?: string;
        searchQuery: string;
        selectedNode?: string;
        suggestions?: Set<string>;
        hoveredNeighbors?: Set<string>;
    }

    const state: State = { searchQuery: "" };
    // https://www.sigmajs.org/storybook/?path=/story/use-reducers--story
    function setHoveredNode(node?: string) {
        if (!graph || !renderer) return;

        if (node) {
            state.hoveredNode = node;
            state.hoveredNeighbors = new Set(graph.neighbors(node));
        } else {
            state.hoveredNode = undefined;
            state.hoveredNeighbors = undefined;
        }

        renderer.refresh({
            skipIndexation: true,
        });
    }

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
                graph = new DirectedGraph();

                const X_SPACING = 180;
                const Y_SPACING = 240;

                const byWorkbook = new Map<
                    number,
                    Array<[string, GraphData[string]]>
                >();

                Object.entries(graphData).forEach(([key, value]) => {
                    if (!byWorkbook.has(value.workbook)) {
                        byWorkbook.set(value.workbook, []);
                    }
                    byWorkbook.get(value.workbook)!.push([key, value]);
                });

                for (const [workbook, chapters] of byWorkbook) {
                    const chaps = chapters.length;

                    // const mid = (chaps - 1) / 2;

                    chapters.forEach(([key, value], index) => {
                        graph!.addNode(key, {
                            label: key.replaceAll("_", " "),
                            workbook: value.workbook,
                            url: `/workbook/${value.workbook}/topic/${key}`,
                            x: (Math.random() - 0.5) * 300,
                            y: (Math.random() - 0.5) * 200,
                            size: 6,
                            color:
                                value.prereqs.length === 0
                                    ? "#2ecc71"
                                    : "#3498db",
                        });
                    });
                }

                Object.entries(graphData).forEach(([key, value]) => {
                    value.prereqs.forEach((prereq) => {
                        const prereqNode = graphData[prereq];
                        if (!prereqNode) return;

                        if (prereqNode.workbook !== value.workbook) {
                            graph!.addEdge(prereq, key, {
                                color: "#d0d0d0",
                                size: 0.1,
                            });
                        }
                    });
                });

                const maxY = Math.max(
                    ...graph
                        .nodes()
                        .map((n) => graph!.getNodeAttribute(n, "y") as number),
                );

                // // WORKBOOK NUMBER ICON NODES
                // const sdkBlue = getComputedStyle(document.documentElement)
                //     .getPropertyValue("--sdkblue")
                //     .trim();

                // const WORKBOOK_ICON_Y = maxY + 120;

                // for (const [workbook] of byWorkbook) {
                //     graph.addNode(`workbook-${workbook}`, {
                //         label: `${String(workbook).padStart(2, "0")}`,
                //         url: `#workbook/${String(workbook).padStart(2, "0")}`,

                //         x: (workbook - 1) * X_SPACING,
                //         y: WORKBOOK_ICON_Y,
                //         size: 10,
                //         color: "rgba(0,0,0,0)",
                //         kind: "workbook",
                //     });
                // }

                // renderer.setSetting("labelColor", {
                //     color: sdkBlue,
                // });

                renderer = new Sigma(graph, container, {
                    labelFont: "Inter, system-ui, sans-serif",
                    labelSize: 12,
                    labelWeight: "500",
                });
                
                const sensibleSettings = forceAtlas2.inferSettings(graph);

                layout = new FA2Layout(graph, {
                    settings: {
                        ...sensibleSettings,
                        gravity: 1.5,
                        scalingRatio: 8,
                        strongGravityMode: true,
                        slowDown: 2,
                    },
                });

                layout.start();
                // this is what hides other nodes and edges
                renderer.setSetting("nodeReducer", (node, data) => {
                    const res: Partial<NodeDisplayData> = { ...data };

                    const kind = graph!.getNodeAttribute(node, "kind");

                    // Keep workbook labels always visible and unaffected:
                    if (graph!.getNodeAttribute(node, "kind") === "workbook") {
                        res.color = "rgba(0,0,0,0)"; // no circle
                        res.forceLabel = true; // always show label
                    }

                    if (
                        state.hoveredNeighbors &&
                        !state.hoveredNeighbors.has(node) &&
                        state.hoveredNode !== node
                    ) {
                        res.hidden = true;
                    }

                    return res;
                });

                renderer.setSetting("edgeReducer", (edge, data) => {
                    const res: Partial<EdgeDisplayData> = { ...data };

                    if (
                        state.hoveredNode &&
                        !graph!
                            .extremities(edge)
                            .every(
                                (n) =>
                                    n === state.hoveredNode ||
                                    graph!.areNeighbors(n, state.hoveredNode!),
                            )
                    ) {
                        res.hidden = true;
                    }

                    return res;
                });

                renderer.on("enterNode", ({ node }) => {
                    if (graph!.getNodeAttribute(node, "kind") === "workbook")
                        return;
                    setHoveredNode(node);
                });

                renderer.on("leaveNode", () => {
                    setHoveredNode(undefined);
                });

                renderer.on("clickNode", ({ node }) => {
                    const url = graph!.getNodeAttribute(node, "url") as
                        | string
                        | undefined;
                    if (url) window.location.hash = url.slice(1);
                });
            })

            .catch((err) => {
                console.error("Failed to load graph.json:", err);
            });
    });

    onDestroy(() => {
        layout?.kill();
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
