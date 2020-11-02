<h1 style="text-align:center;">ScrawlGraph</h1>

ScrawlGraph is a spatial data format for modeling complex and dynamic (fictional) places.

This is what a ScrawlGraph looks like, as an ECMAScript object:

```js
const graph = {
  vertices: {
    a: [0, 0],
    c: [8, 8],
    b: [8, 0],
    d: [0, 8],
    e: [4, 4],
  },
  links: {
    // A village.
    f: {
      type: "shape",
      vertices: ["a", "b", "c", "d"],
      data: { name: "village" },
    },
    // A basket in the middle of the village.
    g: {
      type: "point",
      vertex: "e",
      data: { name: "basket" },
    },
    // An apple inside the basket.
    h: {
      type: "child",
      parent: "g",
      data: { name: "apple" },
    },
  },
};
```

ScrawlGraphs are fully JSON-compatible, so they can be serialized or deserialized with existing tools and used in any environment.

# Concepts

A ScrawlGraph models spatial information using _vertices_ and _links_. A vertex represents a 2d point, and holds no data other than its position.

Links represent features of the graph. They can connect zero-or-more vertices into complex structures. Links are not edges as you may be familiar with from traditional graphs. A link is more abstract, and can describe:

- Zero vertices
- One vertex
- One edge (two vertices)
- Multiple edges (three or more vertices)

Additionally, every link with at least one vertex is the root node for a tree whose children are zero-vertex links.

- TODO: Explanatory graphic

# Data Types

Types are described here using TypeScript and JSON, but ScrawlGraph is language-independent.

## Id

Vertices and links are referenced by a unique string id.

```ts
type Id = string;
```

## Vertex

A vertex is a tuple with two numeric components. The vertex has no defined semantics other than representing a 2d location. Applications are free to choose a suitable coordinate system.

```ts
type Vertex = [number, number];
```

## Link

There are four types of links. All links are have the following properties:

```ts
interface ScrawlBaseLink {
  data: any;
  children?: Id[];
}
```

- Child links have no vertices, and can only exist as the child of another link.

```ts
interface ScrawlChild extends ScrawlBaseLink {
  type: "child";
  parent: Id;
}
```

- Point links are associated with a single vertex.

```ts
interface ScrawlPoint extends ScrawlBaseLink {
  type: "point";
  vertex: Id;
}
```

- Path links are associated with two or more vertices. They represent a "polyline".

```ts
interface ScrawlPath extends ScrawlBaseLink {
  type: "path";
  vertices: Id[];
}
```

- Shape links are associated with two or more vertices and represent a polygon.

```ts
interface ScrawlShape extends ScrawlBaseLink {
  type: "shape";
  vertices: Id[];
  contains?: Id[];
}
```

"Multipolygons" are not yet supported by ScrawlGraph, but are planned.

## Graph
