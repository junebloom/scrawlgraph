// Type definitions for the ScrawlGraph spatial data format.
// All types are immutable.

// A unique identifier for a vertex or node.
export type Id = string;

// A 2D map location, with no further semantics.
export type Vertex = readonly [number, number];

// A collection of nodes and vertices, associated as a graph.
export interface ScrawlGraph {
  readonly vertices: { readonly [id: string]: Vertex };
  readonly nodes: { readonly [id: string]: ScrawlNode };
}

// Nodes

// A node in the ScrawlGraph. Note that this base interface only exists to be
// extended, and by itself is not a valid type for a node in a graph.
export interface ScrawlBaseNode {
  // (The compiler can't catch mutations of mutable types on the user-provided
  // `data` property of a node, but you should treat it as immutable.)
  readonly data: any;
  readonly children?: ReadonlyArray<Id>;
}

// A child node. Any type of node can be a parent, but only a ScrawlChild can
// be a child.
export interface ScrawlChild extends ScrawlBaseNode {
  readonly type: "child";
  readonly parent: Id;
}

// A point node. Associates node data and children with a vertex on the map.
export interface ScrawlPoint extends ScrawlBaseNode {
  readonly type: "point";
  readonly vertex: Id;
}

// A path node. Associates node data and children with a series of vertices.
// A ScrawlPath represents an open "polyline".
export interface ScrawlPath extends ScrawlBaseNode {
  readonly type: "path";
  readonly vertices: ReadonlyArray<Id>;
}

// A shape node. Associates node data and children with a series of vertices.
// A ScrawlShape represents a closed polygon.
export interface ScrawlShape extends ScrawlBaseNode {
  readonly type: "shape";
  readonly vertices: ReadonlyArray<Id>;
  readonly contains?: ReadonlyArray<Id>;
}

// A union type used where any type of node is acceptable.
type ScrawlNode = ScrawlChild | ScrawlPoint | ScrawlPath | ScrawlShape;

// Type guards
export function isScrawlChild(node: ScrawlNode): node is ScrawlChild {
  return node.type === "child";
}
export function isScrawlPoint(node: ScrawlNode): node is ScrawlPoint {
  return node.type === "point";
}
export function isScrawlPath(node: ScrawlNode): node is ScrawlPath {
  return node.type === "path";
}
export function isScrawlShape(node: ScrawlNode): node is ScrawlShape {
  return node.type === "shape";
}
