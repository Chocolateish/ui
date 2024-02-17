import "./ui.scss";
import { WindowManager } from "./window";
import { DocumentHandler } from "./document";
import { Base, defineElement } from "@src/base";
import { Menubar } from "@src/menu";
import { ThemeEngine } from "@src/theme";

export class UI extends Base {
  readonly menubar: Menubar;
  readonly windowManager: WindowManager;
  constructor() {
    super();
    let documentHandler = new DocumentHandler();
    new ThemeEngine(documentHandler);
    this.menubar = this.appendChild(new Menubar());
    this.windowManager = this.appendChild(new WindowManager(documentHandler));
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
