import { nameSpace } from "../shared";

/**This creates a path element*/
export let path = (path: string) => {
    let node = <SVGPathElement>document.createElementNS(nameSpace, "path");
    node.setAttribute("d", path);
    return node;
};

/**This creates a line with a path element
 * @param startX start point on x axis
 * @param startY start point on y axis
 * @param endX end point on x axis
 * @param endY end point on y axis*/
export let pathLine = (startX: number, startY: number, endX: number, endY: number) => {
    let line = <SVGPathElement>document.createElementNS(nameSpace, "path");
    line.setAttribute("d", `M ${startX} ${startY} L ${endX} ${endY}`);
    return line;
};