import "./menubar.scss";
import { Base, crel, defineElement } from "..";

export class Menubar extends Base {
  #start: HTMLDivElement;
  #mid: HTMLDivElement;
  #end: HTMLDivElement;
  constructor() {
    super();
    this.#start = this.appendChild(crel("div"));
    this.#mid = this.appendChild(crel("div"));
    this.#end = this.appendChild(crel("div"));
  }
  /**Returns the name used to define the element */
  static elementName() {
    return "menubar";
  }

  appendItem(item: Base, position: "start" | "mid" | "end" = "start") {
    switch (position) {
      case "start":
        this.#start.appendChild(item);
        break;
      case "mid":
        this.#mid.appendChild(item);
        break;
      case "end":
        this.#end.appendChild(item);
        break;
    }
  }
}
defineElement(Menubar);
