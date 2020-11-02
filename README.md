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
    f: {
      // A village.
      data: { name: "village" },
      vertices: ["a", "b", "c", "d", "a"],
    },
    g: {
      // A basket at the village center.
      data: { name: "basket" },
      vertices: ["e"],
    },
  },
  children: {
    h: {
      // An apple inside the basket.
      data: { name: "apple" },
      parent: "g",
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

These trees are the secondary data structures. The **children** in these trees are data containers who have no physical presence in the graph, but are hierarchically "inside" the parent.

In this way, paths act as the bridge between the undirected graph (for spatial data), and the trees (for hierarchical data), unifying them into a ScrawlGraph.

- TODO: Explanatory graphic

# The Format

A ScrawlGraph is an object with three properties:

```json
{
  "vertices": {},
  "paths": {},
  "children": {}
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

A path associates some data with a series of one or more vertices on the graph. A path is represented by an object with a `vertices` array property and a `data` property of any valid JSON type, usually an object.

```json
{
  "d": {
    "data": { "name": "Acute Town", "population": "you" },
    "vertices": ["a"]
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
      "data": { "name": "Righteous River" },
      "vertices": ["a", "c", "b"]
    }
  }
  ```

- #### Polygons

  Closed paths with three or more vertices are polygon paths. A path is closed if its first vertex is the same as its last. They are useful for describing borders, shapes, buildings, large objects etc.

  ```json
  {
    "f": {
      "data": { "name": "Tri-state" },
      "vertices": ["a", "b", "c", "a"]
    }
  }
  ```

- #### Multipolygons

  Appending a second closed series of vertices to the end of the vertices array after a first closed series creates a multipolygon path. All of the vertices of the second polygon must lie inside the first. The inner polygon is to be treated as a "hole" or "cutout" in the outer polygon.

  ```json
  {
    "g": {
      "data": { "name": "Donut County" },
      "vertices": ["a", "b", "c", "a", "x", "y", "z", "x"]
    }
  }
  ```

### Child

A child is a data container nested inside of a path's tree. It has no associated vertices. Any path or child is a valid parent, though a child can't be its own parent.

```json
{
  "h": {
    "data": { "name": "Triangle Man" },
    "parent": "f"
  },
  "i": {
    "data": { "name": "Hatred" },
    "parent": "h"
  }
}
```

# Use Cases

## Why not GeoJSON or TopoJSON?

# TypeScript Implementation
