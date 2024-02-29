import "./window.scss";
import { Base, defineElement, themeRegisterContainer } from "..";

declare global {
  interface Window {
    windowContainer: WindowContainer;
  }
}

export class WindowContainer extends Base {
  layers: HTMLDivElement[] = [];

  static elementName() {
    return "windowcontainer";
  }

  appendWindow(window: WindowVirtual, layer: number) {
    if (!this.layers[layer]) {
      this.layers[layer] = this.appendChild(document.createElement("div"));
      this.layers[layer].style.zIndex = String(layer);
    }
    this.layers[layer].appendChild(window);
  }
}
defineElement(WindowContainer);

/**Viewport for relative position */
export let windowVirtualContainer = (window.windowContainer =
  new WindowContainer());

/**Viewport for fixed position */
let windowVirtualFixedContainer = document.documentElement.appendChild(
  new WindowContainer()
);

/**List of external windows */
let externalWindows: WindowExternal[] = [];

window.addEventListener("beforeunload", () => {
  for (let i = 0; i < externalWindows.length; i++) {
    //@ts-expect-error
    externalWindows[i].unload();
  }
});

export function openWindowVirtual(options: WindowVirtualOptions) {
  let window = new WindowVirtual(options);
  if (options.fixed)
    windowVirtualFixedContainer.appendWindow(window, options.layer || 0);
  else
    options.opener.ownerDocument.defaultView?.windowContainer.appendWindow(
      window,
      options.layer || 0
    );
  return window;
}
export function openWindowExternal(options: WindowExternalOptions) {
  let window = new WindowExternal(options);
  externalWindows.push(window);
  return window;
}

//   __          ___           _                 ______      _                        _
//   \ \        / (_)         | |               |  ____|    | |                      | |
//    \ \  /\  / / _ _ __   __| | _____      __ | |__  __  _| |_ ___ _ __ _ __   __ _| |
//     \ \/  \/ / | | '_ \ / _` |/ _ \ \ /\ / / |  __| \ \/ / __/ _ \ '__| '_ \ / _` | |
//      \  /\  /  | | | | | (_| | (_) \ V  V /  | |____ >  <| ||  __/ |  | | | | (_| | |
//       \/  \/   |_|_| |_|\__,_|\___/ \_/\_/   |______/_/\_\\__\___|_|  |_| |_|\__,_|_|
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
    this.#window.document.documentElement.appendChild(new WindowContainer());
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

//   __          ___           _                __      ___      _               _
//   \ \        / (_)         | |               \ \    / (_)    | |             | |
//    \ \  /\  / / _ _ __   __| | _____      __  \ \  / / _ _ __| |_ _   _  __ _| |
//     \ \/  \/ / | | '_ \ / _` |/ _ \ \ /\ / /   \ \/ / | | '__| __| | | |/ _` | |
//      \  /\  /  | | | | | (_| | (_) \ V  V /     \  /  | | |  | |_| |_| | (_| | |
//       \/  \/   |_|_| |_|\__,_|\___/ \_/\_/       \/   |_|_|   \__|\__,_|\__,_|_|

export type WindowVirtualOptions = {
  /**Opener element, used to determine in which window to open the virtual window, just pass Window if there is no opening element*/
  opener: HTMLElement;
  /**If true coordinates are fixed in viewport, if false coordinates are relative*/
  fixed?: boolean;
  /**Layer for window, higher layer number will stay on top of lower even when they are selected*/
  layer?: number;
  /**X position of new window in viewport*/
  x: number;
  /**Y position of new window in viewport*/
  y: number;
  /**Width of new window in rem*/
  width: number;
  /**Height of new window in rem*/
  height: number;
  content: HTMLElement;
};

export class WindowVirtual extends Base {
  #sizers: HTMLDivElement;
  #titelContainer: HTMLDivElement;
  #contentContainer: HTMLDivElement;
  #content?: HTMLElement;
  constructor(options: WindowVirtualOptions) {
    super();
    this.#titelContainer = this.appendChild(document.createElement("div"));
    this.#contentContainer = this.appendChild(document.createElement("div"));
    this.#sizers = this.appendChild(document.createElement("div"));
    this.content = options.content;
    this.width = options.width;
    this.height = options.height;
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

  set width(width: number) {
    this.style.width = width + "rem";
  }
  get width(): number {
    return parseFloat(this.style.width);
  }

  set height(height: number) {
    this.style.height = height + "rem";
  }
  get height(): number {
    return parseFloat(this.style.height);
  }
}
defineElement(WindowVirtual);
