// Type definitions for the ScrawlGraph spatial data format.
// All types are immutable.

// A unique identifier for a vertex or link.
export type Id = string;

// A 2D map location, with no further semantics.
export type Vertex = readonly [number, number];

// A collection of links and vertices, associated as a graph.
export interface ScrawlGraph {
  readonly vertices: { readonly [id: string]: Vertex };
  readonly links: { readonly [id: string]: ScrawlLink };
}

// Represents the root node of a tree.
interface ScrawlRootNode {
  // (The compiler can't catch mutations of mutable types on the user-provided
  // `data` property, but you should treat it as immutable.)
  readonly data: any;
  readonly children?: ReadonlyArray<Id>;
}

// Represents a child in a tree.
export interface ScrawlChild extends ScrawlRootNode {
  readonly parent: Id;
}

// Represents a feature composed of vertices in the graph.
export interface ScrawlLink extends ScrawlRootNode {
  readonly vertices: ReadonlyArray<Id>;
  readonly contains?: ReadonlyArray<Id>;
}

// A union type used where any type of node is acceptable.
export type ScrawlNode = ScrawlChild | ScrawlLink;

// Type guards
export function isScrawlChild(node: ScrawlNode): node is ScrawlChild {
  return (node as ScrawlChild).parent !== undefined;
}
export function isScrawlLink(node: ScrawlNode): node is ScrawlLink {
  return (node as ScrawlLink).vertices !== undefined;
}
