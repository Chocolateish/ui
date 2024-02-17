export let nameSpace: "http://www.w3.org/2000/svg" =
  "http://www.w3.org/2000/svg";

export function createSvgElement<K extends keyof SVGElementTagNameMap>(
  qualifiedName: K
): SVGElementTagNameMap[K] {
  return document.createElementNS<K>(nameSpace, qualifiedName);
}
