<h1 style="text-align:center;">ScrawlGraph</h1>

ScrawlGraph is a spatial data format for modeling features of complex, dynamic (and possibly fictional) places.

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
  paths: {
    // A village.
    f: {
      vertices: ["a", "b", "c", "d", "a"],
      name: "village",
    },
    // A basket at the village center, with an apple in it.
    g: {
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
```

ScrawlGraphs are fully JSON-compatible, so they can be serialized or deserialized with existing tools and used in any environment.

# Concepts

A ScrawlGraph is a synthesis of two kinds of data structures. The primary structure is an undirected graph of spatial data.

Spatial information in the graph is modeled using **vertices** and **paths**. A vertex represents a 2d point and holds no data other than its position, while a path is three things:

- A sequence of one or more vertices.
- A container for data.
- The root node of a tree.

These trees are the secondary data structures. The child **nodes** in these trees are data containers who have no physical presence in the graph, but are semantically "inside" the parent.

In this way, paths act as the bridge between the undirected graph (for spatial data), and the trees (for hierarchical data), unifying them into a ScrawlGraph.

- TODO: Explanatory graphic

# The Format

A ScrawlGraph is an object with three properties:

```json
{
  "vertices": {},
  "paths": {},
  "nodes": {}
}
```

These properties are objects whose keys are unique string identifiers and whose values are as follows:

### Vertices

A vertex is a location in 2d space. It is represented by an ordered pair of numeric components. There is no further meaning to the vertex, and the application is free to choose whatever coordinate system and units are appropriate.

```json
{
  "a": [0, 0],
  "b": [0, 2],
  "c": [1, 1]
}
```

### Paths

A path associates some data with a series of one or more vertices on the graph. A path is represented by an object with a `vertices` property which is a array of vertex identifiers (strings). Arbitrary data can be included as further properties of any valid JSON type.

```json
{
  "d": {
    "vertices": ["a"],
    "name": "Acute Town",
    "population": "you"
  }
}
```

Depending on the contents of its vertices array, a path can represent many kinds of features. Also note that multiple paths can utilize the same underlying vertices.

- #### Points

  Paths with a single vertex, like the one above, are point paths. They are useful for attaching data to a single location.

- #### Polylines

  Open paths with multiple vertices are polyline paths. A path is open if its first and last vertices are not the same _(or more generally, if no vertex appears in the path more than once)_. They are useful for describing roads, rivers, etc.

  ```json
  {
    "e": {
      "vertices": ["a", "c", "b"],
      "name": "Righteous River"
    }
  }
  ```

- #### Polygons

  Closed paths with three or more vertices are polygon paths. A path is closed if its first vertex is the same as its last. They are useful for describing borders, shapes, buildings, large objects etc.

  ```json
  {
    "f": {
      "vertices": ["a", "b", "c", "a"],
      "name": "Tri-state"
    }
  }
  ```

- #### Multipolygons

  Appending a second closed series of vertices to the end of the vertices array after a first closed series creates a multipolygon path. All of the vertices of the second polygon must lie inside the first. The inner polygon is to be treated as a "hole" or "cutout" in the outer polygon.

  ```json
  {
    "g": {
      "vertices": ["a", "b", "c", "a", "x", "y", "z", "x"],
      "name": "Donut County"
    }
  }
  ```

### Nodes

A node is a data container, not associated with any particular vertices, that can be used as tree children by other nodes and paths.

```json
{
  "h": {
    "children": ["i"],
    "name": "Triangle Man"
  },
  "i": {
    "name": "Hatred"
  }
}
```

# Use Cases

## Why not GeoJSON or TopoJSON?

# TypeScript Utilities

## Immutability
