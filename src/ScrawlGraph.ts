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

// Links

// A link in the ScrawlGraph. Note that this base interface only exists to be
// extended, and by itself is not a valid type for a link in a graph.
export interface ScrawlBaseLink {
  // (The compiler can't catch mutations of mutable types on the user-provided
  // `data` property of a link, but you should treat it as immutable.)
  readonly data: any;
  readonly children?: ReadonlyArray<Id>;
}

// A child link. Any type of link can be a parent, but only a ScrawlChild can
// be a child.
export interface ScrawlChild extends ScrawlBaseLink {
  readonly type: "child";
  readonly parent: Id;
}

// A point link. Associates link data and children with a vertex on the map.
export interface ScrawlPoint extends ScrawlBaseLink {
  readonly type: "point";
  readonly vertex: Id;
}

// A path link. Associates link data and children with a series of vertices.
// A ScrawlPath represents an open "polyline".
export interface ScrawlPath extends ScrawlBaseLink {
  readonly type: "path";
  readonly vertices: ReadonlyArray<Id>;
}

// A shape link. Associates link data and children with a series of vertices.
// A ScrawlShape represents a closed polygon.
export interface ScrawlShape extends ScrawlBaseLink {
  readonly type: "shape";
  readonly vertices: ReadonlyArray<Id>;
  readonly contains?: ReadonlyArray<Id>;
}

// A union type used where any type of link is acceptable.
export type ScrawlLink = ScrawlChild | ScrawlPoint | ScrawlPath | ScrawlShape;

// Type guards
export function isScrawlChild(link: ScrawlLink): link is ScrawlChild {
  return link.type === "child";
}
export function isScrawlPoint(link: ScrawlLink): link is ScrawlPoint {
  return link.type === "point";
}
export function isScrawlPath(link: ScrawlLink): link is ScrawlPath {
  return link.type === "path";
}
export function isScrawlShape(link: ScrawlLink): link is ScrawlShape {
  return link.type === "shape";
}
