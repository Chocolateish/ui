import "./container.scss"
import { Base, defineElement } from "@chocolatelibui/core"
import { events, forDocuments } from "@chocolatelibui/document"

let containerZIndex = '99999999';
export let setContainerZIndex = (zIndex: number) => {
    containerZIndex = String(zIndex);
    forDocuments((doc) => {
        (<Container>(<any>doc)["@chocolatelibui/prompts"]).style.zIndex = containerZIndex;
    })
}

export class Container extends Base {
    /**Returns the name used to define the element */
    static elementName() {
        return 'container';
    }
    /**Returns the namespace override for the element*/
    static elementNameSpace() {
        return 'chocolatelibui-prompts';
    }

    constructor() {
        super();
        let preventer = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
        }
        this.oncontextmenu = preventer;
        this.onpointerdown = preventer;
        this.onpointerup = preventer;
        this.onpointercancel = preventer;
        this.onpointerenter = preventer;
        this.onpointerleave = preventer;
        this.onpointermove = preventer;
        this.onpointerout = preventer;
        this.onpointerout = preventer;
        this.onclick = preventer;
        this.style.zIndex = containerZIndex;
    }
}
defineElement(Container);

events.on('documentAdded', (e) => {
    (<any>e.data)["@chocolatelibui/prompts"] = e.data.documentElement.appendChild(new Container);
});
forDocuments((doc) => {
    (<any>doc)["@chocolatelibui/prompts"] = doc.documentElement.appendChild(new Container);
})