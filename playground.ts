const graph = {
  vertices: {
    a: [0, 0],
    c: [8, 8],
    b: [8, 0],
    d: [0, 8],
    e: [4, 4],
  },
  paths: {
    f: {
      // A village.
      vertices: ["a", "b", "c", "d", "a"],
      name: "village",
    },
    g: {
      // A basket at the village center, with an apple in it.
      vertices: ["e"],
      children: ["h"],
      name: "basket",
    },
  },
  nodes: {
    h: {
      name: "apple",
    },
  },
};

// console.log(JSON.stringify(graph));

console.log("\nVertices:");
Object.values(graph.vertices).forEach((vertex) => console.log(vertex));

console.log("\nPaths:");
Object.values(graph.paths).forEach((path) => console.log(path));

console.log("\nNodes:");
Object.values(graph.nodes).forEach((node) => console.log(node));

const basket = graph.paths["g"];
console.log(`\nLocation of the ${basket.name}:`);
console.log(graph.vertices[basket.vertices[0]]);

console.log(`\nStuff in the ${basket.name}:`);
basket.children.forEach((id) => console.log(graph.nodes[id]));
