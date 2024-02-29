import "./ui.scss";
import { Base, defineElement } from "@src/base";
import { Menubar } from "@src/menu";
import { windowVirtualContainer } from "./window";

export class UI extends Base {
  readonly menubar: Menubar;
  constructor() {
    super();
    this.menubar = this.appendChild(new Menubar());
    this.appendChild(windowVirtualContainer);
    let test = new Base();
    test.innerHTML = "Test";
    setInterval(() => {
      test.innerHTML = new Date().toLocaleTimeString();
    }, 1000);
    this.menubar.appendItem(test, "end");
  }
  static elementName() {
    return "ui";
  }
}
defineElement(UI);
