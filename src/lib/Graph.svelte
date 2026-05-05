<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import Sigma from "sigma";
    import { drawDiscNodeLabel } from "sigma/rendering";
    import type { Settings } from "sigma/settings";
    import { DirectedGraph } from "graphology";
    import type {
        EdgeDisplayData,
        NodeDisplayData,
        PartialButFor,
    } from "sigma/types";
    import FA2Layout from "graphology-layout-forceatlas2/worker";
    import forceAtlas2 from "graphology-layout-forceatlas2";

    type GraphData = Record<string, { workbook: number; prereqs: string[] }>;
    type GraphPositions = Record<string, { x: number; y: number }>;
    type ThemeMode = "light" | "dark";
    // props
    export let theme: ThemeMode = "light";
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
    let hoverFocus = 0;
    let hoverAnimationFrame: number | null = null;

    const HOVER_FADE_DURATION_MS = 420;
    const HOVER_FADE_RATE = 1.18;
    const HIDE_THRESHOLD = 0.985;

    // https://www.sigmajs.org/storybook/?path=/story/use-reducers--story
    interface State {
        hoveredNode?: string;
        searchQuery: string;
        selectedNode?: string;
        suggestions?: Set<string>;
        hoveredNeighbors?: Set<string>;
    }

    const state: State = { searchQuery: "" };
    function colorWithAlpha(color: string, alpha: number): string {
        const clampedAlpha = Math.max(0, Math.min(1, alpha));
        if (clampedAlpha >= 1) return color;

        if (color.startsWith("#")) {
            const hex = color.slice(1);
            const normalized =
                hex.length === 3
                    ? hex
                          .split("")
                          .map((ch) => ch + ch)
                          .join("")
                    : hex.length >= 6
                      ? hex.slice(0, 6)
                      : "";
            if (normalized.length === 6) {
                const r = Number.parseInt(normalized.slice(0, 2), 16);
                const g = Number.parseInt(normalized.slice(2, 4), 16);
                const b = Number.parseInt(normalized.slice(4, 6), 16);
                return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
            }
        }

        if (color.startsWith("rgb(")) {
            const values = color
                .slice(4, -1)
                .split(",")
                .map((v) => v.trim());
            if (values.length === 3) {
                return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${clampedAlpha})`;
            }
        }

        if (color.startsWith("rgba(")) {
            const values = color
                .slice(5, -1)
                .split(",")
                .map((v) => v.trim());
            if (values.length >= 3) {
                return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${clampedAlpha})`;
            }
        }

        return color;
    }
    function animateHoverFocus(target: number, afterDone?: () => void) {
        if (!renderer) return;
        if (hoverAnimationFrame !== null) {
            cancelAnimationFrame(hoverAnimationFrame);
            hoverAnimationFrame = null;
        }

        const from = hoverFocus;
        const delta = target - from;
        const startedAt = performance.now();

        const tick = (now: number) => {
            const elapsed = now - startedAt;
            const t = Math.min(1, elapsed / HOVER_FADE_DURATION_MS);
            const eased = 0.5 - Math.cos(t * Math.PI) / 2;
            hoverFocus = from + delta * eased;

            renderer?.refresh({ skipIndexation: true });

            if (t < 1) {
                hoverAnimationFrame = requestAnimationFrame(tick);
                return;
            }

            hoverFocus = target;
            hoverAnimationFrame = null;
            renderer?.refresh({ skipIndexation: true });
            afterDone?.();
        };

        hoverAnimationFrame = requestAnimationFrame(tick);
    }
    // https://www.sigmajs.org/storybook/?path=/story/use-reducers--story
    function setHoveredNode(node?: string) {
        if (!graph || !renderer) return;

        if (node) {
            state.hoveredNode = node;
            state.hoveredNeighbors = new Set(graph.neighbors(node));
            animateHoverFocus(1);
        } else {
            animateHoverFocus(0, () => {
                state.hoveredNode = undefined;
                state.hoveredNeighbors = undefined;
            });
        }
    }
    function getCSSVar(name: string) {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(name)
            .trim();
    }
    function drawThemeNodeHover(
        context: CanvasRenderingContext2D,
        data: PartialButFor<
            NodeDisplayData,
            "x" | "y" | "size" | "label" | "color"
        >,
        settings: Settings,
    ) {
        const size = settings.labelSize;
        const font = settings.labelFont;
        const weight = settings.labelWeight;
        context.font = `${weight} ${size}px ${font}`;

        context.fillStyle = theme === "dark" ? "rgba(8, 12, 20, 0.92)" : "#FFF";
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 8;
        context.shadowColor = "#000";

        const PADDING = 2;
        if (typeof data.label === "string") {
            const textWidth = context.measureText(data.label).width;
            const boxWidth = Math.round(textWidth + 5);
            const boxHeight = Math.round(size + 2 * PADDING);
            const radius = Math.max(data.size, size / 2) + PADDING;
            const angleRadian = Math.asin(boxHeight / 2 / radius);
            const xDeltaCoord = Math.sqrt(
                Math.abs(Math.pow(radius, 2) - Math.pow(boxHeight / 2, 2)),
            );

            context.beginPath();
            context.moveTo(data.x + xDeltaCoord, data.y + boxHeight / 2);
            context.lineTo(data.x + radius + boxWidth, data.y + boxHeight / 2);
            context.lineTo(data.x + radius + boxWidth, data.y - boxHeight / 2);
            context.lineTo(data.x + xDeltaCoord, data.y - boxHeight / 2);
            context.arc(data.x, data.y, radius, angleRadian, -angleRadian);
            context.closePath();
            context.fill();
        } else {
            context.beginPath();
            context.arc(data.x, data.y, data.size + PADDING, 0, Math.PI * 2);
            context.closePath();
            context.fill();
        }

        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 0;

        drawDiscNodeLabel(context, data, settings);
    }
    function applyThemeColors() {
        if (!graph || !renderer) return;

        const topicColor = getCSSVar("--graph-node-topic");
        const foundationColor = getCSSVar("--graph-node-foundation");
        const edgeColor = getCSSVar("--graph-edge");
        const labelColor =
            theme === "dark" ? "#ffffff" : getCSSVar("--graph-label");

        graph.forEachNode((node) => {
            if (graph!.getNodeAttribute(node, "kind") === "workbook") return;
            const nodeType = graph!.getNodeAttribute(node, "nodeType");
            graph!.setNodeAttribute(
                node,
                "color",
                nodeType === "foundation" ? foundationColor : topicColor,
            );
        });

        graph.forEachEdge((edge) => {
            graph!.setEdgeAttribute(edge, "color", edgeColor);
        });

        renderer.setSetting("labelColor", { color: labelColor });
        renderer.refresh({ skipIndexation: true });
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
        Promise.all([
            fetch("/graph.json").then((res) => res.json()),
            fetch("/graph-positions.json").then((res) => res.json()), // FIXME graph-positions.json will not be updated 
        ])
            .then(([rawGraphData, positions]: [GraphData, GraphPositions]) => {
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

                for (const [, chapters] of byWorkbook) {
                    chapters.forEach(([key, value]) => {
                        const pos = positions[key];

                        if (
                            typeof pos?.x !== "number" ||
                            typeof pos?.y !== "number"
                        ) {
                            console.warn(`Missing position for node: ${key}`);
                            return;
                        }

                        graph!.addNode(key, {
                            label: key.replaceAll("_", " "),
                            workbook: value.workbook,
                            nodeType:
                                value.prereqs.length === 0
                                    ? "foundation"
                                    : "topic",
                            url: `/workbook/${value.workbook}/topic/${key}`,
                            x: pos.x,
                            y: pos.y,
                            size: 6,
                            color:
                                value.prereqs.length === 0
                                    ? getCSSVar("--graph-node-foundation")
                                    : getCSSVar("--graph-node-topic"),
                        });
                    });
                }

                Object.entries(graphData).forEach(([key, value]) => {
                    if (!graph!.hasNode(key)) return;

                    value.prereqs.forEach((prereq) => {
                        if (!graph!.hasNode(prereq)) return;
                        if (graph!.hasEdge(prereq, key)) return;

                        graph!.addEdge(prereq, key, {
                            color: getCSSVar("--graph-edge"),
                            size: 1.5,
                        });
                    });
                });

                renderer = new Sigma(graph, container, {
                    labelFont: "Inter, system-ui, sans-serif",
                    labelSize: 12,
                    labelWeight: "500",
                    defaultDrawNodeHover: drawThemeNodeHover,
                });

                applyThemeColors();

                const sensibleSettings = forceAtlas2.inferSettings(graph);

                layout = new FA2Layout(graph, {
                    settings: {
                        ...sensibleSettings,
                        gravity: 1.5,
                        scalingRatio,
                        strongGravityMode: true,
                        slowDown: 2,
                    },
                });

                layout.start();

                setTimeout(() => {
                    layout?.stop();

                    const nextPositions: GraphPositions = {};

                    graph!.forEachNode((node) => {
                        nextPositions[node] = {
                            x: graph!.getNodeAttribute(node, "x") as number,
                            y: graph!.getNodeAttribute(node, "y") as number,
                        };
                    });

                    // console.log(JSON.stringify(nextPositions, null, 2));

                    renderer?.refresh();
                }, 2000);

                renderer.setSetting("nodeReducer", (node, data) => {
                    const res: Partial<NodeDisplayData> = { ...data };

                    if (graph!.getNodeAttribute(node, "kind") === "workbook") {
                        res.color = "rgba(0,0,0,0)";
                        res.forceLabel = true;
                    }

                    if (
                        state.hoveredNeighbors &&
                        !state.hoveredNeighbors.has(node) &&
                        state.hoveredNode !== node
                    ) {
                        const alpha = Math.max(
                            0,
                            1 - hoverFocus * HOVER_FADE_RATE,
                        );

                        res.color = colorWithAlpha(data.color, alpha);
                        res.hidden = hoverFocus > HIDE_THRESHOLD;

                        if (hoverFocus > HIDE_THRESHOLD) res.label = null;
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
                        const alpha = Math.max(
                            0,
                            1 - hoverFocus * HOVER_FADE_RATE,
                        );

                        res.color = colorWithAlpha(data.color, alpha);
                        res.hidden = hoverFocus > HIDE_THRESHOLD;
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
                console.error("Failed to load graph:", err);
            });
    });

    $: if (graph && renderer) {
        theme;
        applyThemeColors();
    }

    onDestroy(() => {
        if (hoverAnimationFrame !== null) {
            cancelAnimationFrame(hoverAnimationFrame);
            hoverAnimationFrame = null;
        }
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
        background: var(--graph-overlay);
        cursor: pointer;
        transition: background 0.15s;
    }

    .graph-overlay:hover {
        background: var(--graph-overlay-hover);
    }

    .graph-overlay span {
        background: var(--graph-overlay-badge-bg);
        color: var(--graph-overlay-badge-text);
        font-size: 0.85rem;
        padding: 0.4rem 0.9rem;
        border-radius: 999px;
        pointer-events: none;
    }
</style>
