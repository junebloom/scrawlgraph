export declare type Id = string;
export declare type Vertex = readonly [number, number];
export interface ScrawlGraph {
    readonly vertices: {
        readonly [id: string]: Vertex;
    };
    readonly nodes: {
        readonly [id: string]: ScrawlNode;
    };
}
export interface ScrawlBaseNode {
    readonly data: any;
    readonly children?: ReadonlyArray<Id>;
}
export interface ScrawlChild extends ScrawlBaseNode {
    readonly type: "child";
    readonly parent: Id;
}
export interface ScrawlPoint extends ScrawlBaseNode {
    readonly type: "point";
    readonly vertex: Id;
}
export interface ScrawlPath extends ScrawlBaseNode {
    readonly type: "path";
    readonly vertices: ReadonlyArray<Id>;
}
export interface ScrawlShape extends ScrawlBaseNode {
    readonly type: "shape";
    readonly vertices: ReadonlyArray<Id>;
    readonly contains?: ReadonlyArray<Id>;
}
export declare type ScrawlNode = ScrawlChild | ScrawlPoint | ScrawlPath | ScrawlShape;
export declare function isScrawlChild(node: ScrawlNode): node is ScrawlChild;
export declare function isScrawlPoint(node: ScrawlNode): node is ScrawlPoint;
export declare function isScrawlPath(node: ScrawlNode): node is ScrawlPath;
export declare function isScrawlShape(node: ScrawlNode): node is ScrawlShape;
