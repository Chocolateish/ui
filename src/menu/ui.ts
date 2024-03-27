import "./ui.scss";
import { Base, crel, defineElement } from "@src/base";
import { Menubar, UIMenu } from "@src/menu";
import { openWindowVirtual } from "../page/window";

export class UI extends Base {
  static elementName() {
    return "ui";
  }
  readonly menubar: Menubar;
  #contentContainer: HTMLDivElement = crel("div");
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
    let test2 = new Base();
    test2.innerHTML = "UI Menu";
    test2.onclick = () => {
      uiMenu.hide = !uiMenu.hide;
    };
    let uiMenu = openWindowVirtual({
      opener: document.body,
      bar: false,
      hide: true,
      autoHide: true,
      layer: 9999,
      position: {
        moveable: false,
        element: test2,
        left: 2,
        top: 2,
      },
      size: {
        sizeable: "bottom-visible",
        width: 20,
        height: 20,
      },
      content: new UIMenu(),
    });
    this.menubar.appendItem(test2, "start");
  }

  set content(content: HTMLElement) {
    this.#contentContainer.replaceChildren(content);
  }
  get content(): HTMLElement {
    return this.#contentContainer.firstElementChild as HTMLElement;
  }
}
defineElement(UI);
