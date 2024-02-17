import "./window.scss";
import { Base, defineElement } from "..";
import { DocumentHandler } from "./document";

declare global {
  interface Window {
    windowManager: typeof WindowManager;
  }
}

export class WindowManager extends Base {
  #windowContainer: HTMLDivElement;
  #content?: Base;
  constructor(documentHandler: DocumentHandler) {
    super();
    this.#windowContainer = this.appendChild(document.createElement("div"));
  }
  static elementName() {
    return "windowmanager";
  }
  set content(content: Base) {
    this.#content = content;
    this.replaceChildren(content);
  }

  get content(): Base | undefined {
    return this.#content;
  }
}
defineElement(WindowManager);

export class WindowVirtual extends Base {
  #content?: Base;
  constructor() {
    super();
  }
  static elementName() {
    return "window";
  }

  set content(content: Base) {
    this.#content = content;
    this.replaceChildren(content);
  }

  get content(): Base | undefined {
    return this.#content;
  }
}
defineElement(WindowVirtual);

export type WindowContainerOptions = {
  width: number;
  height: number;
  left: number;
  top: number;
};

export class WindowContainer {
  #window: Window;
  constructor(options: WindowContainerOptions) {
    let generatedWindow = window.open(
      "",
      "",
      "status=no,width=" +
        options.width +
        ",height=" +
        options.height +
        ",left=" +
        options.left +
        ",top=" +
        options.top
    );
    if (generatedWindow) {
      this.#window = generatedWindow;
    } else {
      throw new Error("Failed to open window");
    }
  }
}
