import { crelns } from "@src/base";

export let nameSpace: "http://www.w3.org/2000/svg" = "http://www.w3.org/2000/svg";

export function crsvgel<K extends keyof SVGElementTagNameMap>(qualifiedName: K): SVGElementTagNameMap[K] {
  return crelns<K>(nameSpace, qualifiedName);
}
