// Type definitions for the ScrawlGraph spatial data format.
// All types are immutable.

// A unique identifier for a vertex or path.
export type Id = string;

// A 2D map location, with no further semantics.
export type Vertex = readonly [number, number];

// A collection of paths and vertices, associated as a graph.
export interface ScrawlGraph {
  readonly vertices: { readonly [id: string]: Vertex };
  readonly paths: { readonly [id: string]: ScrawlPath };
  readonly children: { readonly [id: string]: ScrawlChild };
}

// Represents the root node of a tree.
interface ScrawlNode {
  // (The compiler can't catch mutations of mutable types on the user-provided
  // `data` property, but you should treat it as immutable.)
  readonly data: any;
  readonly children?: ReadonlyArray<Id>;
}

// Represents a child node in a tree.
export interface ScrawlChild extends ScrawlNode {
  readonly parent: Id;
}

// Represents a feature composed of vertices in the graph.
export interface ScrawlPath extends ScrawlNode {
  readonly vertices: ReadonlyArray<Id>;
  readonly within?: ReadonlyArray<Id>;
  readonly contains?: ReadonlyArray<Id>;
}
