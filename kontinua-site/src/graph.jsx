import { useEffect, useRef } from "react";
import Graph from "graphology";
import Sigma from "sigma";
import forceAtlas2 from "graphology-layout-forceatlas2";
import graphData from "./graphData";

export default function GraphView() {
  const containerRef = useRef(null);

  useEffect(() => {
    const graph = new Graph();

    // add all nodes
    Object.entries(graphData).forEach(([key, value]) => {
      graph.addNode(key, {
        label: key.replaceAll("_", " "),
        workbook: value.workbook,
        url: `/Workbook-${value.workbook}.html#${key}`,
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
        size: Math.sqrt(value.prereqs.length) * 4,
        color: value.prereqs.length === 0 ? "#2ecc71" : "#3498db",
      });
    });

    // add edges from prereq -> topic
    Object.entries(graphData).forEach(([topic, value]) => {
      value.prereqs.forEach((prereq) => {
        const edgeId = `${prereq}->${topic}`;
        if (
          graph.hasNode(prereq) &&
          graph.hasNode(topic) &&
          !graph.hasEdge(edgeId)
        ) {
          graph.addEdgeWithKey(edgeId, prereq, topic);
        }
      });
    });

    forceAtlas2.assign(graph, {
      iterations: 300, settings: {
  scalingRatio: 60,
  gravity: 0.2,
  adjustSizes: true,
  strongGravityMode: false,
},
    });

    const renderer = new Sigma(graph, containerRef.current);

    renderer.on("clickNode", ({ node }) => {
      const url = graph.getNodeAttribute(node, "url");
      if (url) window.location.href = url;
    });

    return () => renderer.kill();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "500px" }}
    />
  );
}