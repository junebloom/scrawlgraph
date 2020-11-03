# ScrawlGraph

ScrawlGraph is a spatial data format for modeling complex, dynamic (and possibly fictional) places.

This is what a ScrawlGraph looks like, as a JSON object:

```jsonc
{
  "vertices": {
    "a": [0, 0],
    "c": [8, 8],
    "b": [8, 0],
    "d": [0, 8],
    "e": [4, 4]
  },
  "paths": {
    // A little village.
    "f": { "vertices": ["a", "b", "c", "d", "a"], "name": "village" },
    // A basket in the village center, with an apple in it.
    "g": { "vertices": ["e"], "children": ["h"], "name": "Basket" }
  },
  "nodes": {
    // The apple.
    "h": { "name": "Apple" }
  }
}
```

ScrawlGraphs are fully JSON-compatible, so they can be serialized or deserialized with existing tools and used in any environment.

## Contents

- [Concepts](#concepts)
- [Specification](#specification)
  - [vertices](#1-vertices)
  - [paths](#2-paths)
  - [nodes](#3-nodes)
- [Use Cases](#use-cases)
  - [Why not GeoJSON or TopoJSON?](#why-not-geojson-or-topojson)
- [Typescript Definitions](#typescript-definitions)
  - [Immutability](#immutability)

# Concepts

A ScrawlGraph is a synthesis of two kinds of data structures. The primary structure is an undirected graph of spatial data.

Spatial information in the graph is modeled using `vertices` and `paths`. A vertex represents a 2d point and holds no data other than its position, while a path is three things:

- A sequence of one or more `vertices`.
- A container for data.
- The root `node` of a _tree_.

These trees are the secondary data structures. The child `nodes` in a tree are data containers who have no physical presence in the graph, but are semantically "inside" their parent.

In this way, paths act as the bridge between the undirected graph (for spatial data), and the trees (for hierarchical data), unifying them into a ScrawlGraph.

- TODO: Explanatory graphic

# Specification

A ScrawlGraph is an object with three properties:

```json
{
  "vertices": {},
  "paths": {},
  "nodes": {}
}
```

These properties are objects whose _keys_ are **unique string identifiers** and whose _values_ depend on their type:

### 1. `vertices`

A vertex is a location represented as a tuple of numeric components. It can be an ordered pair, or triple, etc. There is no further meaning to the vertex, and the application is free to choose whatever coordinate system is appropriate.

```json
{
  "a": [0, 0],
  "b": [0, 2],
  "c": [1, 1]
}
```

### 2. `paths`

A path associates some data with a series of one or more vertices on the graph. A path is an object with a `vertices` property and an _optional_ `children` property.

- `vertices` is an array of one or more vertices, _referenced by their string identifier_.
- `children` is an array of references to the path's child [nodes](#nodes).

```json
{
  "d": {
    "vertices": ["a"],
    "children": ["h"]
  }
}
```

Arbitrary data can be included as further properties of any valid JSON type.

```jsonc
{
  "d": {
    // ...
    "name": "Acute Town",
    "population": "you"
  }
}
```

Depending on the contents of its `vertices` array, a path can represent many kinds of features. Also note that multiple paths can utilize the same underlying vertices. The valid kinds of paths are as follows:

- #### 2.1 Points

  Paths with a single vertex, like the one above, are point paths. They are useful for attaching data to a single location.

- #### 2.2 Polylines

  Open paths with multiple vertices are polyline paths. A path is open if its first and last vertices are not the same _(or more generally, if no vertex appears in the path more than once)_. They are useful for describing roads, rivers, etc.

  ```json
  {
    "e": {
      "vertices": ["a", "c", "b"],
      "name": "Righteous River"
    }
  }
  ```

- #### 2.3 Polygons

  Closed paths with three or more vertices are polygon paths. A path is closed if its first vertex is the same as its last. They are useful for describing borders, shapes, buildings, large objects etc.

  ```json
  {
    "f": {
      "vertices": ["a", "b", "c", "a"],
      "name": "Tri-state"
    }
  }
  ```

- #### 2.4 Multipolygons

  Appending a second closed series of vertices to the end of the vertices array after a first closed series creates a multipolygon path. All of the vertices of the second polygon must lie inside the first. The inner polygon is to be treated as a "hole" or "cutout" in the outer polygon.

  ```json
  {
    "g": {
      "vertices": ["a", "b", "c", "a", "x", "y", "z", "x"],
      "name": "Donut County"
    }
  }
  ```

### 3. `nodes`

A node is a data container that can be used as a child by other nodes and paths.

Nodes are part of a _tree_, which always has a _path_ as its root. The other elements in the trees are always _nodes_. A node can have children of its own, to an arbitrary depth.

Nodes not associated with any particular vertices, except indirectly through their root path.

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

With this simple structure, a huge variety of places and worlds can be modeled in virtually any level of detail.

#### Simple Maps

For example, we could model a _very basic_ version of a map, where point paths represent towns and cities, polyline paths represent the connections between them, and any major features of the city could be represented as child nodes in its tree.

#### Detailed Maps

Or we could model the same place in _extreme detail_, where every physical feature of the towns and cities are represented by their own polyline and polygon paths, down to every building, even to the layout of each room, with each item of furniture modeled as a polygon path, and items in drawers and cabinets modeled as child nodes in those paths' trees.

#### Dynamic Worlds

And it doesn't end there; ScrawlGraphs are intended to be dynamic. You could model each inhabitant as a point path, and move them around as needed, with their possessions modeled as nodes in their tree. And because it is trivial to transform a node into a path and _vise versa_, items could be picked up and put down and inhabitants could even be moved into and out of vehicles represented by point or polygon paths, so that only the vehicle's vertices need to be repositioned as it moves.

### Further Thoughts

That much detail is probably excessive, but it illustrates that it's possible to use as much or as little detail as desired to model complex _worlds_, not just maps.

My intention with ScrawlGraph is to enable creative modeling of detailed fictional worlds in an interactive way, for building applications with a focus on creative world-building or other similar uses.

## Why not GeoJSON or TopoJSON?

The primary use-case for [GeoJSON](https://tools.ietf.org/html/rfc7946) and [TopoJSON](https://github.com/topojson/topojson-specification) is to represent mostly-static geo-spatial data. I can't hold a candle to them in that domain, they are very good at what they do. But they do have some limitations when it comes to modeling dynamic content.

#### Vertex References

The main problem is in how they treat vertices. Both have the limitation that vertices are represented _by value_, and can't be _referenced_. For example, imagine a path that represents a road, and one of the vertices of the path represents a city that the road passes through. Now imagine a user want to adjust the position of the city, keeping the city connected with the road.

With GeoJSON or TopoJSON, the city and the road would need to have their positions updated independently, because the two features can't share a single vertex. TopoJSON _almost_ solves this problem, using _arcs_, which are descriptions of paths that can be shared by reference by features, but a TopoJSON arc must have a minimum of two vertices, so point features like our city are still represented by a bare, non-reference-able position.

By making all vertices references, ScrawlGraph solves this problem.

#### Analysis

This has the secondary effect of making it possible to analyze the graph more richly, for example, we can traverse the edges in a path to determine every city that a particular road runs through, or to find neighboring cities. Without additional indexing, these kinds of operations may be somewhat expensive, but the point is that the information necessary to create such indexes exists in the first place.

#### Simplicity

ScrawlGraph also has the advantage of being very simple. It has a relatively flat structure for the format itself, while still allowing for deep relationships between elements. It's well-suited for having elements of the graph extracted and individually stored in a database or transferred over a network.

# TypeScript Definitions

This repository also provides an npm package with TypeScript type definitions for working with ScrawlGraphs.

You can include the definitions in your project with `yarn` or `npm`.

```shell
yarn add scrawlgraph
```

```shell
npm i -S scrawlgraph
```

Look in [`ScrawlGraph.d.ts`](/ScrawlGraph.d.ts) for the exact type definitions.

## Immutability

The definitions attempt to enforce immutability by making all properties readonly. The exception is if you provide mutable types as data fields in a path or node. You should still treat such values as immutable.

The reason for this is to enforce safe design patterns, and to ensure that ScrawlGraphs can be used seamlessly in places that expect immutable state, such as [React](https://github.com/facebook/react) or [Automerge](https://github.com/automerge/automerge).

Mutable type definitions may be provided later, but immutability is a first-class consideration driving the design of ScrawlGraph.
