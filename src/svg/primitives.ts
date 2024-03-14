import { nameSpace } from "./shared";
import { AnchorPoint } from "./anchorPoint";
import { degreesToRadians } from "@src/util/math";

/**This creates a svg circle
 * @param centerX x coordinate of center
 * @param centerY y coordinate of center
 * @param radius radius of circle*/
export function circle(centerX: number, centerY: number, radius: number) {
  let circle = <SVGCircleElement>crelNS(nameSpace, "circle");
  circle.setAttribute("cx", String(centerX));
  circle.setAttribute("cy", String(centerY));
  circle.setAttribute("r", String(radius));
  return circle;
}

/**This creates a svg ellipse
 * @param centerX x coordinate of center
 * @param centerY y coordinate of center
 * @param radiusX x radius of circle
 * @param radiusY y radius of circle*/
export function ellipse(
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number
) {
  let ellipse = <SVGEllipseElement>crelNS(nameSpace, "ellipse");
  ellipse.setAttribute("cx", String(centerX));
  ellipse.setAttribute("cy", String(centerY));
  ellipse.setAttribute("rx", String(radiusX));
  ellipse.setAttribute("ry", String(radiusY));
  return ellipse;
}

/**This draws parts of a circle/ellipse, the circle direction is reversed
 * @param centerX the center point on the x axis
 * @param centerY the center point on the y axis
 * @param radiusX radius in x axis
 * @param radiusY radius in y axis
 * @param startAngle start angle in radians
 * @param endAngle distance/amount of radians in circle*/
export function ellipseArc(
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  startAngle: number,
  endAngle: number
) {
  let circArc = <SVGPathElement>crelNS(nameSpace, "path");
  let startRadian = degreesToRadians(startAngle);
  endAngle = degreesToRadians(endAngle - startAngle);
  let sX = radiusX * Math.cos(startRadian) + centerX;
  let sY = radiusY * Math.sin(startRadian) + centerY;
  let eX = radiusX * Math.cos(startRadian + endAngle) + centerX;
  let eY = radiusY * Math.sin(startRadian + endAngle) + centerY;
  let fA = endAngle > Math.PI ? 1 : 0;
  let fS = endAngle > 0 ? 1 : 0;
  circArc.setAttribute(
    "d",
    `M ${sX} ${sY} A ${radiusX} ${radiusY} 0 ${fA} ${fS} ${eX} ${eY}`
  );
  return circArc;
}

/**This draws a triangle*/
export function group() {
  return <SVGGElement>crelNS(nameSpace, "g");
}

/**This creates a line element
 * @param startX start point on x axis
 * @param startY start point on y axis
 * @param endX end point on x axis
 * @param endY end point on y axis*/
export function line(
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  let line = <SVGLineElement>crelNS(nameSpace, "line");
  line.setAttribute("x1", String(startX));
  line.setAttribute("y1", String(startY));
  line.setAttribute("x2", String(endX));
  line.setAttribute("y2", String(endY));
  return line;
}

/**This creates a path element*/
export function path(path: string) {
  let node = <SVGPathElement>crelNS(nameSpace, "path");
  node.setAttribute("d", path);
  return node;
}

/**This creates a line with a path element
 * @param startX start point on x axis
 * @param startY start point on y axis
 * @param endX end point on x axis
 * @param endY end point on y axis*/
export function pathLine(
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  let line = <SVGPathElement>crelNS(nameSpace, "path");
  line.setAttribute("d", `M ${startX} ${startY} L ${endX} ${endY}`);
  return line;
}

/**This creates a rectangle with teh center as origin
 * @param centerX x coordinate of center
 * @param centerY y coordinate of center
 * @param width width
 * @param height height
 * @param cornerRadius radius of corner*/
export function rectangleFromCenter(
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  cornerRadius: number
) {
  let circle = <SVGRectElement>crelNS(nameSpace, "rect");
  circle.setAttribute("x", String(centerX - width / 2));
  circle.setAttribute("y", String(centerY - height / 2));
  circle.setAttribute("width", String(width));
  circle.setAttribute("height", String(height));
  circle.setAttribute("rx", String(cornerRadius));
  return circle;
}

/**This creates a rectangle with teh center as origin
 * @param startX x coordinate of center
 * @param startY y coordinate of center
 * @param width width
 * @param height height
 * @param cornerRadius radius of corner*/
export function rectangleFromCorner(
  startX: number,
  startY: number,
  width: number,
  height: number,
  cornerRadius: number
) {
  let circle = <SVGRectElement>crelNS(nameSpace, "rect");
  circle.setAttribute("x", String(startX));
  circle.setAttribute("y", String(startY));
  circle.setAttribute("width", String(width));
  circle.setAttribute("height", String(height));
  circle.setAttribute("rx", String(cornerRadius));
  return circle;
}

/** This returns an empty svg element
 * @param {number} width width of svg
 * @param {number} height height of svg
 * @param {string} viewbox viewbox of svg*/
export function svgsvg(
  width: number,
  height: number,
  viewbox: string = `0 0 ${width} ${height}`
) {
  let svg = <SVGSVGElement>crelNS(nameSpace, "svg");
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("viewBox", String(viewbox));
  return svg;
}

/**Creates a text nodes for an svg
 * @param x x coordinate of text
 * @param y y coordinate of text
 * @param text text
 * @param size size of text in px
 * @param anchor anchor point of text*/
export function text(
  x: number,
  y: number,
  text: string,
  size: number,
  anchor: AnchorPoint
) {
  let textElem = <SVGTextElement>crelNS(nameSpace, "text");
  textElem.setAttribute("x", String(x));
  textElem.setAttribute("y", String(y));
  textElem.setAttribute("font-size", String(size));
  textElem.innerHTML = text;
  switch (anchor) {
    case AnchorPoint.bottomLeft:
    case AnchorPoint.middleLeft:
    case AnchorPoint.topLeft: {
      textElem.setAttribute("text-anchor", "start");
      break;
    }
    case AnchorPoint.topCenter:
    case AnchorPoint.bottomCenter:
    case AnchorPoint.middleCenter: {
      textElem.setAttribute("text-anchor", "middle");
      break;
    }
    case AnchorPoint.topRight:
    case AnchorPoint.middleRight:
    case AnchorPoint.bottomRight: {
      textElem.setAttribute("text-anchor", "end");
      break;
    }
  }
  switch (anchor) {
    case AnchorPoint.bottomLeft:
    case AnchorPoint.bottomRight:
    case AnchorPoint.bottomCenter: {
      textElem.setAttribute("dominant-baseline", "auto");
      break;
    }
    case AnchorPoint.middleLeft:
    case AnchorPoint.middleRight:
    case AnchorPoint.middleCenter: {
      textElem.setAttribute("dominant-baseline", "central");
      break;
    }
    case AnchorPoint.topLeft:
    case AnchorPoint.topCenter:
    case AnchorPoint.topRight: {
      textElem.setAttribute("dominant-baseline", "hanging");
      break;
    }
  }
  return textElem;
}

/**Creates a text nodes for an svg
 * @param x x coordinate of text
 * @param y y coordinate of text
 * @param width width of text
 * @param height height of text
 * @param text text
 * @param size size of text in px
 * @param anchor anchor point of */
export function multiLineText(
  x: number,
  y: number,
  width: number,
  height: number,
  text: string,
  size: number,
  anchor: AnchorPoint
) {
  let text2 = <SVGForeignObjectElement>crelNS(nameSpace, "foreignObject");
  let textDiv = text2.appendChild(crel("div"));
  text2.setAttribute("width", String(width));
  text2.setAttribute("height", String(height));
  text2.setAttribute("x", String(x));
  text2.setAttribute("y", String(y));
  textDiv.style.fontSize = size + "px";
  textDiv.style.width = "100%";
  textDiv.style.height = "100%";
  textDiv.style.display = "flex";
  textDiv.innerHTML = text;
  switch (anchor) {
    case AnchorPoint.bottomLeft:
    case AnchorPoint.middleLeft:
    case AnchorPoint.topLeft: {
      textDiv.style.textAlign = "start";
      textDiv.style.justifyContent = "flex-start";
      break;
    }
    case AnchorPoint.topCenter:
    case AnchorPoint.bottomCenter:
    case AnchorPoint.middleCenter: {
      textDiv.style.textAlign = "center";
      textDiv.style.justifyContent = "center";
      break;
    }
    case AnchorPoint.topRight:
    case AnchorPoint.middleRight:
    case AnchorPoint.bottomRight: {
      textDiv.style.textAlign = "end";
      textDiv.style.justifyContent = "flex-end";
      break;
    }
  }
  switch (anchor) {
    case AnchorPoint.bottomLeft:
    case AnchorPoint.bottomRight:
    case AnchorPoint.bottomCenter: {
      textDiv.style.alignItems = "flex-end";
      break;
    }
    case AnchorPoint.middleLeft:
    case AnchorPoint.middleRight:
    case AnchorPoint.middleCenter: {
      textDiv.style.alignItems = "center";
      break;
    }
    case AnchorPoint.topLeft:
    case AnchorPoint.topCenter:
    case AnchorPoint.topRight: {
      textDiv.style.alignItems = "flex-start";
      break;
    }
  }
  return text2;
}

/**This draws a triangle
 * @param centerX x coordinate of center
 * @param centerY y coordinate of center
 * @param width width
 * @param height height*/
export function isoscelesTriangle(
  centerX: number,
  centerY: number,
  width: number,
  height: number
) {
  let trig = <SVGPathElement>crelNS(nameSpace, "path");
  let halfW = width / 2;
  let halfH = height / 2;
  trig.setAttribute(
    "d",
    "M" +
      (centerX - halfW) +
      "," +
      (centerY + halfH) +
      " " +
      (centerX + halfW) +
      "," +
      (centerY + halfH) +
      " " +
      centerX +
      "," +
      (centerY - halfH) +
      "Z"
  );
  return trig;
}
