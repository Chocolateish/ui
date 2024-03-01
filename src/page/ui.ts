import "./ui.scss";
import { Base, defineElement } from "@src/base";
import { Menubar } from "@src/menu";

export class UI extends Base {
  readonly menubar: Menubar;
  #contentContainer: HTMLDivElement = document.createElement("div");
  constructor() {
    super();
    this.menubar = this.appendChild(new Menubar());
    let test = new Base();
    test.innerHTML = "Test";
    setInterval(() => {
      test.innerHTML = new Date().toLocaleTimeString();
    }, 1000);
    this.menubar.appendItem(test, "end");
    this.appendChild(this.#contentContainer);
  }
  static elementName() {
    return "ui";
  }

  set content(content: HTMLElement) {
    this.#contentContainer.replaceChildren(content);
  }
  get content(): HTMLElement {
    return this.#contentContainer.firstElementChild as HTMLElement;
  }
}
defineElement(UI);
