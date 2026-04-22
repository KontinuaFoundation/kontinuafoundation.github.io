import { useEffect, useRef } from "react";
import Sigma from "sigma";
import forceAtlas2 from "graphology-layout-forceatlas2";
import { DirectedGraph } from "graphology";

export default function GraphView() {
  const containerRef = useRef(null);

  useEffect(() => {
    let renderer;

    fetch("/graph.json")
      .then((res) => res.json())
      .then((graphData) => {
        const graph = new DirectedGraph();

        Object.entries(graphData).forEach(([key, value]) => {
          graph.addNode(key, {
            label: key.replaceAll("_", " "),
            workbook: value.workbook,
            url: `/Workbook-${value.workbook}.html#${key}`,
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200,
            size: value.prereqs.length * 1.75,
            color: value.prereqs.length === 0 ? "#2ecc71" : "#3498db",
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
                type: "arrow",
                size: .25,
                color: "#c5c5c5",
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

        if (containerRef.current) {
          renderer = new Sigma(graph, containerRef.current);

          renderer.on("clickNode", ({ node }) => {
            const url = graph.getNodeAttribute(node, "url");
            if (url) window.location.href = url;
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load graph.json:", err);
      });

    return () => {
      if (renderer) renderer.kill();
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "500px" }} />;
}