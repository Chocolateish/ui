import "./window.scss";
import { material_navigation_close_rounded } from "@src/asset";
import { Base, BaseOptions, crel, defineElement } from "@src/base";
import { pxToRem, remToPx, themeRegisterContainer } from "@src/theme";
import { ContextMenuItemList, attachContextMenu } from "./contextmenu";

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
let windowAutoCloseHide = () => {
  //selectedWindow?.close();
};
document.addEventListener("pointerdown", windowAutoCloseHide, {
  passive: true,
});
window.addEventListener("blur", windowAutoCloseHide, {
  passive: true,
});

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

type WindowVirtualMoveable = boolean | "x" | "y" | "xy";
type Bot = "-bottom" | "";
type Left = "-left" | "";
type Right = "-right" | "";
type Vis = "-visible" | "";
type WindowVirtualSizeable =
  | true
  | `${"top"}${Bot}${Left}${Right}${Vis}`
  | `${"bottom"}${Left}${Right}${Vis}`
  | `${"left"}${Right}${Vis}`
  | `${"right"}${Vis}`
  | "visible";

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
  /**Tooltip for window, only visible as a hover tooltip, if content provised overwrite for this, it will be used instead*/
  toolTip?: string;
  /**Window is auto closed when interacting outside window*/
  autoHide?: boolean;
  /**Window is auto closed when interacting outside window*/
  autoClose?: boolean;
  /**Makes the window modal, meaning it darkens background and captures tab and pointer and keyboard */
  modal?: boolean;
  /**Determines if content is shown */
  showContent?: boolean;
  /**Content to put in window */
  content?: Base;
  /**Optional position for window */
  position?: {
    /**If the window is moveable, default is moveable */
    moveable?: WindowVirtualMoveable;
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
} & BaseOptions;

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
  #toolTip?: string;
  constructor(options: WindowVirtualOptions) {
    super();
    this.tabIndex = 0;
    this.addEventListener("pointerdown", this.select, { capture: true });
    this.setAttribute("empty", "");
    //    _  __          _                         _
    //   | |/ /         | |                       | |
    //   | ' / ___ _   _| |__   ___   __ _ _ __ __| |
    //   |  < / _ \ | | | '_ \ / _ \ / _` | '__/ _` |
    //   | . \  __/ |_| | |_) | (_) | (_| | | | (_| |
    //   |_|\_\___|\__, |_.__/ \___/ \__,_|_|  \__,_|
    //              __/ |
    //             |___/
    this.onkeyup = (e) => {
      if (e.key === "Escape") this.close();
    };
    this.#titelContainer = this.appendChild(crel("div"));
    //     _____            _            _     __  __
    //    / ____|          | |          | |   |  \/  |
    //   | |     ___  _ __ | |_ _____  _| |_  | \  / | ___ _ __  _   _
    //   | |    / _ \| '_ \| __/ _ \ \/ / __| | |\/| |/ _ \ '_ \| | | |
    //   | |___| (_) | | | | ||  __/>  <| |_  | |  | |  __/ | | | |_| |
    //    \_____\___/|_| |_|\__\___/_/\_\\__| |_|  |_|\___|_| |_|\__,_|
    attachContextMenu(this.#titelContainer, () => {
      let items: ContextMenuItemList = [];
      if (this.#toolTip)
        items.push({
          label: this.#toolTip,
          action: () => {
            navigator.clipboard.writeText(this.toolTip);
          },
        });
      if (this.closable)
        items.push({
          label: "Close",
          action: () => {
            this.close();
          },
        });
      if (this.#content) {
        items.push({
          label: "Pop Out",
          action: () => {
            openWindowExternal({
              x: window.screenX + remToPx(this.left),
              y:
                window.screenY +
                window.outerHeight -
                window.innerHeight +
                remToPx(this.top),
              width: remToPx(this.width),
              height: remToPx(this.height),
              content: this.#content!,
            });
            this.close();
          },
        });
      }
      if (this.title)
        items.push({
          label: "Copy Title",
          action: () => {
            navigator.clipboard.writeText(this.title);
          },
        });
      return items;
    });

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
    if (options.content) this.content = options.content;
    if (typeof options.bar !== "undefined") this.bar = options.bar;
    if (typeof options.closable !== "undefined")
      this.closable = options.closable;
    if (options.symbol) this.symbol = options.symbol;
    if (options.title) this.title = options.title;
    if (options.toolTip) this.toolTip = options.toolTip;
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

  set content(content: Base | undefined) {
    this.#content = content;
    if (content) {
      this.#contentContainer.replaceChildren(content);
      this.removeAttribute("empty");
    } else {
      this.#contentContainer.replaceChildren();
      this.setAttribute("empty", "");
    }
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
  /**Sets window tooltip, shown when hovering on title bar*/
  set toolTip(title: string | undefined) {
    this.#toolTip = title;
  }
  get toolTip(): string {
    return this.#toolTip || "";
  }
  //     _____ _                _
  //    / ____| |              (_)
  //   | |    | | ___  ___  ___ _ _ __   __ _
  //   | |    | |/ _ \/ __|/ _ \ | '_ \ / _` |
  //   | |____| | (_) \__ \  __/ | | | | (_| |
  //    \_____|_|\___/|___/\___|_|_| |_|\__, |
  //                                     __/ |
  //                                    |___/
  /**Closes the window */
  async close() {
    this.remove();
  }
  //    _____          _ _   _
  //   |  __ \        (_) | (_)
  //   | |__) |__  ___ _| |_ _  ___  _ __
  //   |  ___/ _ \/ __| | __| |/ _ \| '_ \
  //   | |  | (_) \__ \ | |_| | (_) | | | |
  //   |_|   \___/|___/_|\__|_|\___/|_| |_|
  /**Sets if the windows is movable */
  set moveable(moveable: WindowVirtualMoveable) {
    if (moveable) {
      this.setAttribute("moveable", "");
      this.#titelContainer.onpointerdown = (e) => {
        this.#titelContainer.setPointerCapture(e.pointerId);
        let x = pxToRem(e.clientX) - this.left;
        let y = pxToRem(e.clientY) - this.top;
        this.#titelContainer.onpointermove =
          moveable === "y"
            ? (ev) => {
                this.topInternal = pxToRem(ev.clientY) - y;
              }
            : moveable === "x"
            ? (ev) => {
                this.leftInternal = pxToRem(ev.clientX) - x;
              }
            : (ev) => {
                this.leftInternal = pxToRem(ev.clientX) - x;
                this.topInternal = pxToRem(ev.clientY) - y;
              };
        this.#titelContainer.onpointerup = () => {
          this.#titelContainer.releasePointerCapture(e.pointerId);
          this.#titelContainer.onpointerup = null;
          this.#titelContainer.onpointermove = null;
        };
      };
    } else {
      this.removeAttribute("moveable");
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
  private set topInternal(top: number) {
    this.top = Math.max(
      Math.min(top, pxToRem(this.window!.innerHeight) - 3),
      0
    );
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
      : pxToRem(this.window!.innerHeight - this.getBoundingClientRect().bottom);
  }

  /**Sets left position of window */
  set left(left: number) {
    this.style.right = "";
    this.style.left = left + "rem";
    this.#leftRight = false;
    this.#leftRightPos = left;
  }
  set leftInternal(left: number) {
    let halfWidth = this.width / 2;
    this.left = Math.max(
      Math.min(left, pxToRem(this.window!.innerWidth) - halfWidth),
      -halfWidth
    );
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
      : pxToRem(this.window!.innerWidth - this.getBoundingClientRect().right);
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
    if (
      sizeable === true ||
      sizeable === "top-bottom-left-right" ||
      sizeable === "visible"
    ) {
      if (sizeable === "visible") visible = true;
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
    } else {
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
      ...sizers.map((d) => {
        let sizer = crel("div");
        sizer.className = d;
        let top = d.includes("top");
        let left = d.includes("left");
        switch (d) {
          case "top":
          case "bottom":
            sizer.onpointerdown = (e) => {
              let topBottom = this.#topBottom;
              sizer.setPointerCapture(e.pointerId);
              if (!topBottom && top) this.bottom = this.bottom;
              if (topBottom && !top) this.top = this.top;
              var y = top
                ? e.clientY + remToPx(this.height)
                : e.clientY - remToPx(this.height);
              sizer.onpointermove = top
                ? (ev) => {
                    this.heightInternal = pxToRem(y - ev.clientY);
                  }
                : (ev) => {
                    this.heightInternal = pxToRem(ev.clientY - y);
                  };
              sizer.onpointerup = () => {
                if (!topBottom && top) this.top = this.top;
                if (topBottom && !top) this.bottom = this.bottom;
                sizer.releasePointerCapture(e.pointerId);
                sizer.onpointerup = null;
                sizer.onpointermove = null;
              };
            };
            break;
          case "left":
          case "right":
            sizer.onpointerdown = (e) => {
              let leftRight = this.#leftRight;
              sizer.setPointerCapture(e.pointerId);
              if (!leftRight && left) this.right = this.right;
              if (leftRight && !left) this.left = this.left;
              let x = left
                ? e.clientX + remToPx(this.width)
                : e.clientX - remToPx(this.width);
              sizer.onpointermove = left
                ? (ev) => {
                    this.widthInternal = pxToRem(x - ev.clientX);
                  }
                : (ev) => {
                    this.widthInternal = pxToRem(ev.clientX - x);
                  };
              sizer.onpointerup = () => {
                if (!leftRight && left) this.left = this.left;
                if (leftRight && !left) this.right = this.right;
                sizer.releasePointerCapture(e.pointerId);
                sizer.onpointerup = null;
                sizer.onpointermove = null;
              };
            };
            break;
          case "top-left":
          case "top-right":
          case "bottom-left":
          case "bottom-right":
            sizer.onpointerdown = (e) => {
              let topBottom = this.#topBottom;
              let leftRight = this.#leftRight;
              sizer.setPointerCapture(e.pointerId);
              if (!topBottom && top) this.bottom = this.bottom;
              if (topBottom && !top) this.top = this.top;
              if (!leftRight && left) this.right = this.right;
              if (leftRight && !left) this.left = this.left;
              var y = top
                ? e.clientY + remToPx(this.height)
                : e.clientY - remToPx(this.height);
              let x = left
                ? e.clientX + remToPx(this.width)
                : e.clientX - remToPx(this.width);
              sizer.onpointermove = left
                ? top
                  ? (ev) => {
                      this.heightInternal = pxToRem(y - ev.clientY);
                      this.widthInternal = pxToRem(x - ev.clientX);
                    }
                  : (ev) => {
                      this.heightInternal = pxToRem(ev.clientY - y);
                      this.widthInternal = pxToRem(x - ev.clientX);
                    }
                : top
                ? (ev) => {
                    this.heightInternal = pxToRem(y - ev.clientY);
                    this.widthInternal = pxToRem(ev.clientX - x);
                  }
                : (ev) => {
                    this.heightInternal = pxToRem(ev.clientY - y);
                    this.widthInternal = pxToRem(ev.clientX - x);
                  };
              sizer.onpointerup = () => {
                if (!topBottom && top) this.top = this.top;
                if (topBottom && !top) this.bottom = this.bottom;
                if (!leftRight && left) this.left = this.left;
                if (leftRight && !left) this.right = this.right;
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
    this.#width = width;
  }
  get width(): number {
    return this.#width;
  }
  private set widthInternal(width: number) {
    this.width = width;
  }

  /**Sets the height of the window */
  set height(height: number) {
    this.style.height = height + "rem";
    this.#height = height;
  }
  get height(): number {
    return this.#height;
  }
  private set heightInternal(height: number) {
    this.height = height;
  }
}
defineElement(WindowVirtual);
