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
    // Object.keys(graphData).forEach((key) => {
    //   graph.addNode(key, {
    //     label: key,
    //     x: Math.random(),
    //     y: Math.random(),
    //     size: 8,
    //     color: "#666",
    //   });
    // });

    // add edges from prereq -> topic
    Object.entries(graphData).forEach(([topic, prereqs]) => {
      graph.addNode(topic, {
        label: topic.replaceAll("_", " "),
        x: Math.random(),
        y: Math.random(),
        size: prereqs.length,
        color: prereqs.length === 0 ? "#2ecc71" : "#3498db",
      });

      prereqs.forEach((prereq) => {
        if (graph.hasNode(prereq) && graph.hasNode(topic)) {
          graph.addEdge(prereq, topic);
        }
      });
    });

    forceAtlas2.assign(graph, {
      iterations: 200,
      settings: {
        scalingRatio: 15,   // ↑ BIGGEST factor (try 10–50)
        gravity: 0.35,      
        strongGravityMode: false,
      },
    });

    const renderer = new Sigma(graph, containerRef.current);

    return () => renderer.kill();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "500px" }}
    />
  );
}