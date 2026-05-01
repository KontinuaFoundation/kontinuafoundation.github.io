<script lang="ts">
  import { onMount } from 'svelte';
  import Sigma from 'sigma';
  import { DirectedGraph } from 'graphology';

  type GraphData = Record<string, { workbook: number; prereqs: string[] }>;
  type ThemeColors = {
    topicNode: string;
    foundationNode: string;
    edge: string;
    label: string;
  };
  type HoverNodeData = {
    x: number;
    y: number;
    size: number;
    label?: string | null;
    hoverable?: boolean;
  };

  let container: HTMLDivElement;
  let renderer: Sigma | null = null;
  let graph: DirectedGraph | null = null;
  let active = false;

  function activate() {
    active = true;
  }

  function deactivate() {
    active = false;
  }

  function cssVar(name: string, fallback: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  }

  function getThemeColors(): ThemeColors {
    return {
      topicNode: cssVar('--graph-node-topic', '#3498db'),
      foundationNode: cssVar('--graph-node-foundation', '#2ecc71'),
      edge: cssVar('--graph-edge', '#d0d0d0'),
      label: cssVar('--graph-label', '#0f172a'),
    };
  }

  function drawGraphNodeHover(
    context: CanvasRenderingContext2D,
    data: HoverNodeData,
    settings: { labelSize: number; labelFont: string; labelWeight: string | number },
  ) {
    if (data.hoverable === false) return;

    const hoverBg = cssVar('--color-bg', '#ffffff');
    const hoverText = cssVar('--sdkblue', '#005FC6');
    const size = settings.labelSize;
    const font = settings.labelFont;
    const weight = settings.labelWeight;
    const padding = 2;

    context.font = `${weight} ${size}px ${font}`;
    context.fillStyle = hoverBg;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 8;
    context.shadowColor = '#000';

    if (typeof data.label === 'string') {
      const textWidth = context.measureText(data.label).width;
      const boxWidth = Math.round(textWidth + 5);
      const boxHeight = Math.round(size + 2 * padding);
      const radius = Math.max(data.size, size / 2) + padding;
      const angleRadian = Math.asin(boxHeight / 2 / radius);
      const xDeltaCoord = Math.sqrt(Math.abs(radius ** 2 - (boxHeight / 2) ** 2));

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
      context.arc(data.x, data.y, data.size + padding, 0, Math.PI * 2);
      context.closePath();
      context.fill();
    }

    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 0;

    if (typeof data.label === 'string') {
      context.fillStyle = hoverText;
      context.fillText(data.label, data.x + data.size + 3, data.y + size / 3);
    }
  }

  function applyGraphTheme() {
    if (!graph || !renderer) return;

    const colors = getThemeColors();
    graph.forEachNode((node, attributes) => {
      if (node.startsWith('workbook-')) return;
      const hasPrerequisites = Boolean(attributes.hasPrerequisites);
      graph!.setNodeAttribute(node, 'color', hasPrerequisites ? colors.topicNode : colors.foundationNode);
    });

    graph.forEachEdge((edge) => {
      graph!.setEdgeAttribute(edge, 'color', colors.edge);
    });

    renderer.setSetting('labelColor', { attribute: 'default', color: colors.label });
    renderer.refresh();
  }

  onMount(() => {
    const onThemeChange = () => applyGraphTheme();
    const themeObserver = new MutationObserver(onThemeChange);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    const systemThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    systemThemeMediaQuery.addEventListener('change', onThemeChange);

    fetch('/graph.json')
      .then((res) => res.json())
      .then((graphData: GraphData) => {
        graph = new DirectedGraph();
        const colors = getThemeColors();

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
          const mid = (chapters.length - 1) / 2;

          chapters.forEach(([key, value], index) => {
            graph!.addNode(key, {
              label: key.replaceAll('_', ' '),
              workbook: value.workbook,
              hasPrerequisites: value.prereqs.length > 0,
              hoverable: true,
              url: `#workbook/${String(value.workbook).padStart(2, '0')}/topic/${key}`,
              x: (workbook - 1) * X_SPACING,
              y: (index - mid) * -Y_SPACING,
              size: 5,
              color: value.prereqs.length === 0 ? colors.foundationNode : colors.topicNode,
            });
          });
        }

        Object.entries(graphData).forEach(([key, value]) => {
          value.prereqs.forEach((prereq) => {
            const prereqNode = graphData[prereq];
            if (!prereqNode) return;

            if (prereqNode.workbook !== value.workbook) {
              graph!.addEdge(prereq, key, {
                color: colors.edge,
                size: 0.25,
              });
            }
          });
        });

        const maxY = Math.max(...graph.nodes().map((node) => graph!.getNodeAttribute(node, 'y')));
        const workbookLabelY = maxY + 120;

        for (const [workbook] of byWorkbook) {
          graph.addNode(`workbook-${workbook}`, {
            label: `${String(workbook).padStart(2, '0')}`,
            hoverable: false,
            x: (workbook - 1) * X_SPACING - 120,
            y: workbookLabelY,
            size: 10,
            color: 'rgba(0,0,0,0)',
          });
        }

        renderer = new Sigma(graph, container, {
          labelFont: 'Inter, system-ui, sans-serif',
          labelSize: 12,
          labelWeight: '500',
          labelColor: { attribute: 'default', color: colors.label },
          defaultDrawNodeHover: drawGraphNodeHover,
        });

        renderer.on('clickNode', ({ node }) => {
          const url = graph!.getNodeAttribute(node, 'url') as string;
          if (url) window.location.hash = url.slice(1);
        });

        applyGraphTheme();
      })
      .catch((error) => {
        console.error('Failed to load graph.json:', error);
      });

    return () => {
      themeObserver.disconnect();
      systemThemeMediaQuery.removeEventListener('change', onThemeChange);
      renderer?.kill();
      renderer = null;
      graph = null;
    };
  });
</script>

<div class="graph-wrapper" on:mouseleave={deactivate} role="application" aria-label="Topic dependency graph">
  <div bind:this={container} class="graph-canvas"></div>
  {#if !active}
    <div
      class="graph-overlay"
      on:click={activate}
      role="button"
      tabindex="0"
      on:keydown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activate();
        }
      }}
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
    background: var(--color-bg);
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
    transition: background 0.15s ease;
  }

  .graph-overlay:hover {
    background: var(--graph-overlay-hover);
  }

  .graph-overlay span {
    background: var(--graph-overlay-badge-bg);
    color: var(--graph-overlay-badge-text);
    font-size: 0.85rem;
    padding: 0.45rem 0.9rem;
    border-radius: 999px;
    border: 1px solid var(--color-bg-secondary);
    pointer-events: none;
  }
</style>
