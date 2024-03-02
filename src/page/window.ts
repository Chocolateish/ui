import "./window.scss";
import { material_navigation_close_rounded } from "@src/asset";
import { Base, crel, defineElement } from "@src/base";
import { pxToRem, remToPx, themeRegisterContainer } from "@src/theme";
import { attachContextMenu } from "./contextmenu";

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
      this.layers[layer] = this.appendChild(crel("div"));
      this.layers[layer].style.zIndex = String(layer);
    }
    this.layers[layer].appendChild(window);
  }
}
defineElement(WindowContainer);

/**Viewport for fixed position */
window.windowContainer = document.documentElement.appendChild(
  new WindowContainer()
);

export let selectedWindow: WindowVirtual | undefined;

//################################################################################################
//################################################################################################
//################################################################################################
//   __          ___           _                 ______      _                        _
//   \ \        / (_)         | |               |  ____|    | |                      | |
//    \ \  /\  / / _ _ __   __| | _____      __ | |__  __  _| |_ ___ _ __ _ __   __ _| |
//     \ \/  \/ / | | '_ \ / _` |/ _ \ \ /\ / / |  __| \ \/ / __/ _ \ '__| '_ \ / _` | |
//      \  /\  /  | | | | | (_| | (_) \ V  V /  | |____ >  <| ||  __/ |  | | | | (_| | |
//       \/  \/   |_|_| |_|\__,_|\___/ \_/\_/   |______/_/\_\\__\___|_|  |_| |_|\__,_|_|
//################################################################################################
//################################################################################################
//################################################################################################
/**List of external windows */
let externalWindows: WindowExternal[] = [];

window.addEventListener("beforeunload", () => {
  for (let i = 0; i < externalWindows.length; i++) {
    //@ts-expect-error
    externalWindows[i].unload();
  }
});

export type WindowExternalOptions = {
  /**X position of new window on total screen area*/
  x: number;
  /**Y position of new window on total screen area*/
  y: number;
  width: number;
  height: number;
  content: Base;
};

/**Opens external window */
export function openWindowExternal(options: WindowExternalOptions) {
  let window = new WindowExternal(options);
  externalWindows.push(window);
  return window;
}

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

//################################################################################################
//################################################################################################
//################################################################################################
//   __          ___           _                __      ___      _               _
//   \ \        / (_)         | |               \ \    / (_)    | |             | |
//    \ \  /\  / / _ _ __   __| | _____      __  \ \  / / _ _ __| |_ _   _  __ _| |
//     \ \/  \/ / | | '_ \ / _` |/ _ \ \ /\ / /   \ \/ / | | '__| __| | | |/ _` | |
//      \  /\  /  | | | | | (_| | (_) \ V  V /     \  /  | | |  | |_| |_| | (_| | |
//       \/  \/   |_|_| |_|\__,_|\___/ \_/\_/       \/   |_|_|   \__|\__,_|\__,_|_|
//################################################################################################
//################################################################################################
//################################################################################################

type WindowVirtualSizeable =
  | true
  | `${"top" | ""}${"-bottom" | ""}${"-right" | ""}${"-left" | ""}${
      | "-visible"
      | ""}`;

export type WindowVirtualOptions = {
  /**Opener element, used to determine in which window to open the virtual window, just pass Window if there is no opening element*/
  opener: HTMLElement;
  /**Layer for window, higher layer number will stay on top of lower even when they are selected*/
  layer?: number;
  /**If the window has a titlebar, default is true */
  bar?: boolean;
  /**If the window is closeable, default is true, if content provides overwrite for this, it will be used instead*/
  closable?: boolean;
  /**Symbol of window to put in title bar, if content provised overwrite for this, it will be used instead*/
  symbol?: () => SVGSVGElement;
  /**Title of window to put in title bar, if content provised overwrite for this, it will be used instead*/
  title?: string;
  /**Long title of window, only visible as a hover tooltip, if content provised overwrite for this, it will be used instead*/
  longTitle?: string;
  /**Window is auto closed when interacting outside window*/
  autoHide?: boolean;
  /**Window is auto closed when interacting outside window*/
  autoClose?: boolean;
  /**Makes the window modal, meaning it darkens background and captures tab and pointer and keyboard */
  modal?: boolean;
  /**Determines if content is shown */
  showContent?: boolean;
  /**Content to put in window */
  content: Base;
  /**Optional position for window */
  position?: {
    /**If the window is moveable, default is true */
    moveable?: boolean;
    /**left position of new window in viewport*/
    left?: number;
    /**left position of new window in viewport*/
    top?: number;
    /**right position of new window in viewport*/
    right?: number;
    /**bottom position of new window in viewport*/
    bottom?: number;
    /**Element to position window relative to*/
    element?: Element;
    /**Rotation of new window in degrees*/
    rotation?: number;
  };
  /**Optional size for window */
  size?: {
    /**If the window is sizeable, default is sizable, use visible flag for visible sizers*/
    sizeable?: WindowVirtualSizeable;
    /**Width of new window in rem*/
    width: number;
    /**Height of new window in rem*/
    height: number;
  };
};

/**Opens virtual window */
export function openWindowVirtual(options: WindowVirtualOptions) {
  let window = new WindowVirtual(options);
  options.opener.ownerDocument.defaultView?.windowContainer.appendWindow(
    window,
    options.layer || 0
  );
  selectedWindow = window;
  return window;
}

export class WindowVirtual extends Base {
  #titelContainer: HTMLDivElement;
  #titelSymbolContainer: HTMLDivElement;
  #titelTextContainer: HTMLDivElement;
  #titelCloserContainer: HTMLDivElement;
  #contentContainer: HTMLDivElement;
  #content?: Base;
  #sizers: HTMLDivElement;
  #width: number = 0;
  #height: number = 0;
  #leftRight: boolean = false;
  #topBottom: boolean = false;
  #leftRightPos: number = 0;
  #topBottomPos: number = 0;
  constructor(options: WindowVirtualOptions) {
    super();
    this.tabIndex = 0;
    this.addEventListener("pointerdown", this.select, { capture: true });
    this.#titelContainer = this.appendChild(crel("div"));
    attachContextMenu(this.#titelContainer, []);
    this.#titelSymbolContainer = this.#titelContainer.appendChild(crel("div"));
    this.#titelTextContainer = this.#titelContainer.appendChild(crel("div"));
    this.#titelCloserContainer = this.#titelContainer.appendChild(crel("div"));
    this.#titelCloserContainer.onpointerdown = (e) => {
      e.stopPropagation();
    };
    this.#titelCloserContainer.appendChild(material_navigation_close_rounded());
    this.#contentContainer = this.appendChild(crel("div"));
    this.#sizers = this.appendChild(crel("div"));
    this.#sizers.tabIndex = 0;
    this.content = options.content;
    if (typeof options.bar !== "undefined") this.bar = options.bar;
    if (typeof options.closable !== "undefined")
      this.closable = options.closable;
    if (options.symbol) this.symbol = options.symbol;
    if (options.position) {
      this.moveable = options.position.moveable ?? true;
      if (options.position.rotation) this.rotation = options.position.rotation;
      if (options.position.element) {
        let rect = options.position.element.getBoundingClientRect();
        this.left = rect.left;
        this.top = rect.top;
      } else {
        if (options.position.left) this.left = options.position.left;
        else if (options.position.right) this.right = options.position.right;
        if (options.position.top) this.top = options.position.top;
        else if (options.position.bottom) this.bottom = options.position.bottom;
      }
    }
    if (options.size) {
      this.sizeable = options.size.sizeable ?? true;
      this.width = options.size.width;
      this.height = options.size.height;
    }
  }
  static elementName() {
    return "window";
  }

  set content(content: Base) {
    this.#content = content;
    this.#contentContainer.replaceChildren(content);
  }
  get content(): Base | undefined {
    return this.#content;
  }

  select() {
    if (selectedWindow !== this) {
      this.parentElement?.appendChild(this);
      selectedWindow = this;
    }
  }

  /**Sets if title bar is visible */
  set bar(bar: boolean) {
    this.#titelContainer.hidden = !bar;
  }
  get bar(): boolean {
    return !this.#titelContainer.hidden;
  }
  /**Sets if the window is closable*/
  set closable(closable: boolean) {
    this.#titelCloserContainer.hidden = !closable;
  }
  get closable(): boolean {
    return !this.#titelCloserContainer.hidden;
  }

  /**Changes symbol for window */
  set symbol(symbol: () => SVGSVGElement) {
    this.#titelSymbolContainer.replaceChildren(symbol());
  }

  /**Sets window title*/
  set title(title: string) {
    this.#titelTextContainer.textContent = title;
  }
  get title(): string {
    return this.#titelTextContainer.textContent || "";
  }

  //    _____          _ _   _
  //   |  __ \        (_) | (_)
  //   | |__) |__  ___ _| |_ _  ___  _ __
  //   |  ___/ _ \/ __| | __| |/ _ \| '_ \
  //   | |  | (_) \__ \ | |_| | (_) | | | |
  //   |_|   \___/|___/_|\__|_|\___/|_| |_|
  /**Sets if the windows is movable */
  set moveable(moveable: boolean) {
    if (moveable) {
      this.#titelContainer.onpointerdown = (e) => {
        this.#titelContainer.setPointerCapture(e.pointerId);
        let x = e.clientX - remToPx(this.left);
        let y = e.clientY - remToPx(this.top);
        this.#titelContainer.onpointermove = (ev) => {
          this.style.left = pxToRem(ev.clientX - x) + "rem";
          this.style.top = pxToRem(ev.clientY - y) + "rem";
        };
        this.#titelContainer.onpointerup = () => {
          this.#titelContainer.releasePointerCapture(e.pointerId);
          this.#titelContainer.onpointerup = null;
          this.#titelContainer.onpointermove = null;
        };
      };
    } else {
      this.#titelContainer.onpointerdown = null;
    }
  }
  get moveable(): boolean {
    return this.#titelContainer.onpointerdown !== null;
  }

  /**Sets top position of window */
  set top(top: number) {
    this.style.bottom = "";
    this.style.top = top + "rem";
    this.#topBottom = false;
    this.#topBottomPos = top;
  }
  get top(): number {
    return this.#topBottom
      ? pxToRem(this.getBoundingClientRect().top)
      : this.#topBottomPos;
  }

  /**Sets bottom position of window */
  set bottom(bottom: number) {
    this.style.top = "";
    this.style.bottom = bottom + "rem";
    this.#topBottom = true;
    this.#topBottomPos = bottom;
  }
  get bottom(): number {
    return this.#topBottom
      ? this.#topBottomPos
      : pxToRem(this.getBoundingClientRect().bottom);
  }

  /**Sets left position of window */
  set left(left: number) {
    this.style.right = "";
    this.style.left = left + "rem";
    this.#leftRight = false;
    this.#leftRightPos = left;
  }
  get left(): number {
    return this.#leftRight
      ? pxToRem(this.getBoundingClientRect().left)
      : this.#leftRightPos;
  }

  /**Sets right position of window */
  set right(right: number) {
    this.style.left = "";
    this.style.right = right + "rem";
    this.#leftRight = true;
    this.#leftRightPos = right;
  }
  get right(): number {
    return this.#leftRight
      ? this.#leftRightPos
      : pxToRem(this.getBoundingClientRect().right);
  }

  /**Sets rotation of window */
  set rotation(degrees: number) {
    this.style.rotate = degrees + "deg";
  }
  get rotation(): number {
    return parseFloat(this.style.rotate);
  }

  //     _____ _
  //    / ____(_)
  //   | (___  _ _______
  //    \___ \| |_  / _ \
  //    ____) | |/ /  __/
  //   |_____/|_/___\___|
  set sizeable(sizeable: WindowVirtualSizeable) {
    this.#sizers.replaceChildren();
    this.#sizers.className = "";
    let sizers: string[];
    let visible = false;
    if (typeof sizeable === "boolean" || sizeable === "top-bottom-right-left")
      sizers = [
        "top",
        "bottom",
        "right",
        "left",
        "top-right",
        "top-left",
        "bottom-right",
        "bottom-left",
      ];
    else {
      sizers = sizeable.split("-");
      if (sizers.includes("visible")) {
        sizers.pop();
        visible = true;
      }
      if (sizers.includes("top")) {
        if (sizers.includes("right")) sizers.push("top-right");
        if (sizers.includes("left")) sizers.push("top-left");
      }
      if (sizers.includes("bottom")) {
        if (sizers.includes("right")) sizers.push("bottom-right");
        if (sizers.includes("left")) sizers.push("bottom-left");
      }
    }
    this.#sizers.replaceChildren(
      ...sizers.map((direction) => {
        let sizer = crel("div");
        sizer.className = direction;
        switch (direction) {
          case "top":
            sizer.onpointerdown = (e) => {
              let topBottom = this.#topBottom;
              sizer.setPointerCapture(e.pointerId);
              if (!topBottom)
                this.bottom =
                  pxToRem(this.ownerDocument.defaultView!.innerHeight) -
                  (this.top + this.height);
              let y = e.clientY + remToPx(this.height);
              sizer.onpointermove = (ev) => {
                this.height = pxToRem(y - ev.clientY);
              };
              sizer.onpointerup = () => {
                if (!topBottom)
                  this.top = pxToRem(this.getBoundingClientRect().top);
                sizer.releasePointerCapture(e.pointerId);
                sizer.onpointerup = null;
                sizer.onpointermove = null;
              };
            };
            break;
          case "right":
            sizer.onpointerdown = (e) => {
              sizer.setPointerCapture(e.pointerId);
              let x = e.clientX - remToPx(this.width);
              sizer.onpointermove = (ev) => {
                this.width = pxToRem(ev.clientX - x);
              };
              sizer.onpointerup = () => {
                sizer.releasePointerCapture(e.pointerId);
                sizer.onpointerup = null;
                sizer.onpointermove = null;
              };
            };
            break;
          case "bottom":
            sizer.onpointerdown = (e) => {
              sizer.setPointerCapture(e.pointerId);
              let y = e.clientY - remToPx(this.height);
              sizer.onpointermove = (ev) => {
                this.height = pxToRem(ev.clientY - y);
              };
              sizer.onpointerup = () => {
                sizer.releasePointerCapture(e.pointerId);
                sizer.onpointerup = null;
                sizer.onpointermove = null;
              };
            };
            break;
          case "bottom-right":
            sizer.onpointerdown = (e) => {
              sizer.setPointerCapture(e.pointerId);
              let x = e.clientX - remToPx(this.width);
              let y = e.clientY - remToPx(this.height);
              sizer.onpointermove = (ev) => {
                this.width = pxToRem(ev.clientX - x);
                this.height = pxToRem(ev.clientY - y);
              };
              sizer.onpointerup = () => {
                sizer.releasePointerCapture(e.pointerId);
                sizer.onpointerup = null;
                sizer.onpointermove = null;
              };
            };
            break;
        }
        return sizer;
      })
    );
    if (visible) this.#sizers.className = "visible";
  }

  /**Sets the width of the window */
  set width(width: number) {
    this.style.width = width + "rem";
  }
  get width(): number {
    return parseFloat(this.style.width);
  }

  /**Sets the height of the window */
  set height(height: number) {
    this.style.height = height + "rem";
  }
  get height(): number {
    return parseFloat(this.style.height);
  }
}
defineElement(WindowVirtual);
