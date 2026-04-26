<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Sigma from 'sigma';
  import forceAtlas2 from 'graphology-layout-forceatlas2';
  import { DirectedGraph } from 'graphology';

  type GraphData = Record<string, { workbook: number; prereqs: string[] }>;

  let container: HTMLDivElement;
  let renderer: Sigma | null = null;

  onMount(() => {
    fetch('/graph.json')
      .then((res) => res.json())
      .then((graphData: GraphData) => {
        const graph = new DirectedGraph();

        Object.entries(graphData).forEach(([key, value]) => {
          graph.addNode(key, {
            label: key.replaceAll('_', ' '),
            workbook: value.workbook,
            url: `/Workbook-${value.workbook}.html#${key}`,
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200,
            size: value.prereqs.length * 1.75,
            color: value.prereqs.length === 0 ? '#2ecc71' : '#3498db',
          });
        });

        Object.entries(graphData).forEach(([topic, value]) => {
          value.prereqs.forEach((prereq) => {
            const edgeId = `${prereq}->${topic}`;
            if (
              graph.hasNode(prereq) &&
              graph.hasNode(topic) &&
              !graph.hasEdge(edgeId)
            ) {
              graph.addEdgeWithKey(edgeId, prereq, topic, {
                type: 'arrow',
                size: 0.25,
                color: '#c5c5c5',
              });
            }
          });
        });

        forceAtlas2.assign(graph, {
          iterations: 300,
          settings: {
            scalingRatio: 60,
            gravity: 0.2,
            adjustSizes: true,
            strongGravityMode: false,
          },
        });

        renderer = new Sigma(graph, container);

        renderer.on('clickNode', ({ node }) => {
          const url = graph.getNodeAttribute(node, 'url') as string;
          if (url) window.location.href = url;
        });
      })
      .catch((err) => {
        console.error('Failed to load graph.json:', err);
      });
  });

  onDestroy(() => {
    renderer?.kill();
  });
</script>

<div bind:this={container} style="width: 100%; height: 500px;"></div>
