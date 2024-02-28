import "./window.scss";
import { Base, defineElement, themeRegisterContainer } from "..";

let virtualLayer: HTMLDivElement[] = [];
let virtualLayerFixed: HTMLDivElement[] = [];
let externalWindows: WindowExternal[] = [];

window.addEventListener("beforeunload", () => {
  for (let i = 0; i < externalWindows.length; i++) {
    //@ts-expect-error
    externalWindows[i].unload();
  }
});

export function openWindowVirtual(options: WindowVirtualOptions) {
  let window = new WindowVirtual();
  //this.#windowVirtuals.push(window);
  return window;
}
export function openWindowExternal(options: WindowExternalOptions) {
  let window = new WindowExternal(options);
  externalWindows.push(window);
  return window;
}

export type WindowVirtualOptions = {
  /**Opener element, used to determine in which window to open the virtual window, just pass Window if there is no opening element*/
  opener: HTMLElement;
  /**X position of new window on total screen area*/
  x: number;
  /**Y position of new window on total screen area*/
  y: number;
  width: number;
  height: number;
  content: HTMLElement;
};

export class WindowVirtual extends Base {
  #content?: HTMLElement;
  constructor() {
    super();
  }
  static elementName() {
    return "window";
  }

  set content(content: HTMLElement) {
    this.#content = content;
    this.replaceChildren(content);
  }

  get content(): HTMLElement | undefined {
    return this.#content;
  }
}
defineElement(WindowVirtual);

export type WindowExternalOptions = {
  /**X position of new window on total screen area*/
  x: number;
  /**Y position of new window on total screen area*/
  y: number;
  width: number;
  height: number;
  content: Base;
};

export class WindowExternal {
  #virtualLayer: HTMLDivElement[] = [];
  #virtualLayerFixed: HTMLDivElement[] = [];
  #window: Window;
  constructor(options: WindowExternalOptions) {
    let generatedWindow = window.open(
      "",
      "",
      "status=no,width=" +
        options.width +
        ",height=" +
        options.height +
        ",left=" +
        options.x +
        ",top=" +
        options.y
    );
    if (generatedWindow) {
      this.#window = generatedWindow;
    } else {
      throw new Error("Failed to open window");
    }
    themeRegisterContainer(this.#window.document.documentElement);
    if (typeof options.content !== "undefined") this.content = options.content;
    generatedWindow.onbeforeunload = () => {
      this.return();
    };
  }
  /**Set the content of the window*/
  set content(content: Base) {
    this.#window.document.body.appendChild(content);
  }
  /**Get the content of the window*/
  get content(): Base | undefined {
    return undefined;
  }
  async close() {}
  /**Returns window to main window as virtual window */
  return() {
    this.unload();
  }

  private unload() {
    let index = externalWindows.indexOf(this);
    if (index !== -1) {
      externalWindows.splice(index, 1);
    }
    this.#window.close();
  }
}
