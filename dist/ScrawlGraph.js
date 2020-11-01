export function isScrawlChild(node) {
    return node.type === "child";
}
export function isScrawlPoint(node) {
    return node.type === "point";
}
export function isScrawlPath(node) {
    return node.type === "path";
}
export function isScrawlShape(node) {
    return node.type === "shape";
}
