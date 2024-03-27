import { SVGViewport } from "@src/editor";
import { Content } from "@src/page";

export let svgViewportContent = new Content();
svgViewportContent.appendChild(new SVGViewport({}));
