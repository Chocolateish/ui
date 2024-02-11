import "./container.scss"
import { Base } from "@chocolatelibui/core"

export abstract class Prompt extends Base {
    /**Returns the name used to define the element */
    static elementName() {
        return '@abstract@';
    }
    /**Returns the namespace override for the element*/
    static elementNameSpace() {
        return 'chocolatelibui-prompts';
    }

    constructor() {
        super();
    }
}