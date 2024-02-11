import { nameSpace } from "../shared";

/**This draws a triangle*/
export let group = () => {
    return <SVGGElement>document.createElementNS(nameSpace, "g");
}
