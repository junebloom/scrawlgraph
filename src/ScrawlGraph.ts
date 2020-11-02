// Type definitions for the ScrawlGraph spatial data format.
// All types are immutable.

// A unique identifier for a vertex, node, or path.
export type Id = string;

// A 2d position, with no further semantics.
export type Vertex = readonly [number, number];

// A collection of vertices, paths, and nodes, associated as a graph.
export interface ScrawlGraph {
  readonly vertices: { readonly [id: string]: Vertex };
  readonly paths: { readonly [id: string]: ScrawlPath };
  readonly nodes: { readonly [id: string]: ScrawlNode };
}

// Represents a node of a tree.
export interface ScrawlNode {
  readonly children?: ReadonlyArray<Id>;
  // (The compiler can't catch mutations of mutable types on the user-provided
  // data properties, but you should treat them as immutable.)
  readonly [key: string]: any;
}

// Represents a feature composed of vertices in the graph.
export interface ScrawlPath extends ScrawlNode {
  readonly vertices: ReadonlyArray<Id>;
  readonly within?: ReadonlyArray<Id>;
  readonly contains?: ReadonlyArray<Id>;
}
