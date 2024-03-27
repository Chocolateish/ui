//Modifies the stroke color of a svg element
export function stroke(stroke: string, elem: SVGElement) {
  elem.setAttribute("stroke", stroke);
  return elem;
}

//Modifies the stroke-width of a svg element
export function strokeWidth(width: number, elem: SVGElement) {
  elem.setAttribute("stroke-width", String(width));
  return elem;
}

//Modifies the stroke and stroke-width of a svg element
export function strokeAndWidth(
  stroke: string,
  width: number,
  elem: SVGElement
) {
  elem.setAttribute("stroke", stroke);
  elem.setAttribute("stroke-width", String(width));
  return elem;
}

//Modifies the fill color of a svg element
export function fill(fill: string, elem: SVGElement) {
  elem.setAttribute("fill", fill);
  return elem;
}

//Modifies the stroke and fill color of a svg element
export function strokeFill(stroke: string, fill: string, elem: SVGElement) {
  elem.setAttribute("stroke", stroke);
  elem.setAttribute("fill", fill);
  return elem;
}

//Modifies the stroke, fill and stroke-width of a svg element
export function strokeFillWidth(
  stroke: string,
  fill: string,
  width: number,
  elem: SVGElement
) {
  elem.setAttribute("stroke", stroke);
  elem.setAttribute("fill", fill);
  elem.setAttribute("stroke-width", String(width));
  return elem;
}
