import { ScrawlGraph, isScrawlChild, isScrawlPoint } from "./ScrawlGraph";

const graph: ScrawlGraph = {
  vertices: {
    a: [0, 0],
    c: [8, 8],
    b: [8, 0],
    d: [0, 8],
    e: [4, 4],
  },
  nodes: {
    f: {
      type: "shape",
      vertices: ["a", "b", "c", "d"],
      data: {
        name: "village",
      },
    },
    g: {
      type: "point",
      vertex: "e",
      data: {
        name: "well",
      },
    },
    h: {
      type: "child",
      parent: "g",
      data: {
        name: "strange water",
      },
    },
    i: {
      type: "child",
      parent: "g",
      data: {
        name: "a lost bucket",
      },
    },
    j: {
      type: "child",
      parent: "i",
      data: {
        name: "secret treasure",
      },
    },
  },
};

console.log("\nVertices:");
Object.values(graph.vertices).forEach((vertex) => console.log(vertex));

console.log("\nNodes:");
Object.values(graph.nodes).forEach((node) => console.log(node));

const well = graph.nodes["g"];
if (well && isScrawlPoint(well)) {
  console.log("\nLocation of the well:");
  const vertex = graph.vertices[well.vertex];
  vertex && console.log(vertex);

  console.log("\nStuff in the well:");
  Object.values(graph.nodes)
    .filter((node) => isScrawlChild(node) && node.parent === "g")
    .forEach((child) => {
      console.log(child.data.name);
    });
}
