<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import Sigma from "sigma";
    import { DirectedGraph } from "graphology";
    import type { EdgeDisplayData, NodeDisplayData } from "sigma/types";
    import FA2Layout from "graphology-layout-forceatlas2/worker";
    import forceAtlas2 from "graphology-layout-forceatlas2";
    import { get } from "svelte/store";

    type GraphData = Record<string, { workbook: number; prereqs: string[] }>;
    // props
    export let originChapter: string | null = null;
    export let maxDepth = 1;
    export let scalingRatio = 8; // default of 8
    export let heightPx = 500; // default height
    let container: HTMLDivElement;
    let wrapper: HTMLDivElement;
    let renderer: Sigma | null = null;
    let graph: DirectedGraph | null = null;
    let active = false;
    let layout: FA2Layout | null = null;

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
    function getCSSVar(name: string) {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(name)
            .trim();
    }
    function createSubgraph(
        graphData: GraphData,
        root: string | null,
        maxDepth: number,
    ): GraphData {
        if (!root) return graphData;
        if (!graphData[root]) return graphData;

        const allowed = new Set<string>();
        const queue: Array<{ key: string; depth: number }> = [
            { key: root, depth: 0 },
        ];

        while (queue.length) {
            const { key, depth } = queue.shift()!;
            if (allowed.has(key)) continue;
            if (!graphData[key]) continue;

            allowed.add(key);

            if (depth < maxDepth) {
                for (const prereq of graphData[key].prereqs) {
                    if (graphData[prereq] && !allowed.has(prereq)) {
                        queue.push({ key: prereq, depth: depth + 1 });
                    }
                }
            }
        }

        const filtered: GraphData = {};

        for (const key of allowed) {
            filtered[key] = {
                ...graphData[key],
                prereqs: graphData[key].prereqs.filter((p) => allowed.has(p)),
            };
        }

        return filtered;
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
            .then((rawGraphData: GraphData) => {
                const graphData = createSubgraph(
                    rawGraphData,
                    originChapter,
                    maxDepth,
                );

                graph = new DirectedGraph();

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
                                    ? getCSSVar("--graph-node-foundation")
                                    : getCSSVar("--graph-node-topic"),
                        });
                    });
                }

                Object.entries(graphData).forEach(([key, value]) => {
                    value.prereqs.forEach((prereq) => {
                        if (!graphData[prereq]) return;
                        if (graph!.hasEdge(prereq, key)) return;

                        graph!.addEdge(prereq, key, {
                            color: getCSSVar("--graph-edge"),
                            size: 1.5,
                        });
                    });
                });

                // const maxY = Math.max(
                //     ...graph
                //         .nodes()
                //         .map((n) => graph!.getNodeAttribute(n, "y") as number),
                // );

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
                        scalingRatio: scalingRatio,
                        strongGravityMode: true,
                        slowDown: 2,
                    },
                });

                layout.start();
                setTimeout(() => {
                    layout?.stop();
                    renderer?.refresh();
                }, 500);

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
    style={`height: ${heightPx}px`}
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
