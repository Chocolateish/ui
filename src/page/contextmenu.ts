import { Icon } from "@src/asset/icons/shared";
import {
  clickAwayDetector,
  material_navigation_check_rounded,
  material_navigation_chevron_right_rounded,
  material_navigation_close_rounded,
} from "..";
import "./contextMenu.scss";
import { Base, BaseOptions, StateROrValue, crel, defineElement } from "@src/base";
import {} from "@src/theme";

export type ContextMenuItem = ContextMenuLineOptions & ContextMenuSubOptions;

export type ContextMenuItemList = (ContextMenuItem | number)[];
type ContextMenuParams = HTMLElement | ContextMenuItemList;
export type ContextMenuParameter = ContextMenuParams | (() => ContextMenuParams | Promise<ContextMenuParams>);

type KeyboardShortcut = {
  ctrl?: true;
  shift?: true;
  alt?: true;
  meta?: true;
  keys: string | string[];
};

function keyboardShortcutToString(shortcut: KeyboardShortcut) {
  let keys = Array.isArray(shortcut.keys) ? shortcut.keys.map((key) => key.toUpperCase()) : [shortcut.keys.toUpperCase()];
  let result = keys.join(" + ");
  if (shortcut.meta) result = "Meta + " + result;
  if (shortcut.ctrl) result = "Ctrl + " + result;
  if (shortcut.shift) result = "Shift + " + result;
  if (shortcut.alt) result = "Alt + " + result;
  return result;
}

//    _      _
//   | |    (_)
//   | |     _ _ __   ___
//   | |    | | '_ \ / _ \
//   | |____| | | | |  __/
//   |______|_|_| |_|\___|

type ContextMenuLineOptions = {
  label: StateROrValue<string | number | boolean>;
  action?: () => void;
  shortcut?: StateROrValue<KeyboardShortcut>;
  icon?: StateROrValue<Icon>;
  checked?: StateROrValue<boolean>;
} & BaseOptions;

export class ContextMenuLine extends Base {
  #icon: HTMLDivElement;
  #label: HTMLTableCellElement;
  #shortcut: HTMLTableCellElement;
  constructor(options: ContextMenuLineOptions) {
    super(options);
    this.#icon = this.appendChild(crel("td")).appendChild(crel("div"));
    this.#label = this.appendChild(crel("td"));
    this.#shortcut = this.appendChild(crel("td"));
    this.tabIndex = 0;
    this.onclick = (e) => {
      e.stopPropagation();
      options.action?.();
      contextMenuClose();
    };
    this.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        options.action?.();
        contextMenuClose();
      }
    };
    if (typeof options.checked !== "undefined")
      this.attachState(options.checked, (checked) => {
        this.#icon.replaceChildren((checked.ok ? material_navigation_check_rounded() : undefined) as any);
      });
    else if (options.icon)
      this.attachState(options.icon, (icon) => {
        this.#icon.replaceChildren((icon.ok ? icon.value() : undefined) as any);
      });

    if (options.label)
      this.attachState(options.label, (label) => {
        this.#label.innerHTML = label.ok ? String(label.value) : String(label.error.reason);
      });
    if (options.shortcut)
      this.attachState(options.shortcut, (shortcut) => {
        this.#shortcut.innerHTML = shortcut.ok ? String(keyboardShortcutToString(shortcut.value)) : String(shortcut.error.reason);
      });
  }
  static elementName() {
    return "contextmenuline";
  }
}
defineElement(ContextMenuLine);

//     _____ _    _ ____
//    / ____| |  | |  _ \
//   | (___ | |  | | |_) |
//    \___ \| |  | |  _ <
//    ____) | |__| | |_) |
//   |_____/ \____/|____/

type ContextMenuSubOptions = {
  label: StateROrValue<string | number | boolean>;
  sub?: ContextMenuItem[];
  icon?: StateROrValue<Icon>;
  checked?: StateROrValue<boolean>;
} & BaseOptions;

export class ContextMenuSub extends Base {
  #icon: HTMLDivElement;
  #label: HTMLTableCellElement;
  #opener: HTMLDivElement;
  #sub: ContextMenuParameter;
  #container?: ContextMenuContainer;
  constructor(options: ContextMenuSubOptions) {
    super(options);
    this.#icon = this.appendChild(crel("td")).appendChild(crel("div"));
    this.#label = this.appendChild(crel("td"));
    this.#opener = this.appendChild(crel("td"));
    this.#opener.appendChild(crel("div")).appendChild(material_navigation_chevron_right_rounded());
    this.tabIndex = 0;
    this.onclick = (e) => {
      e.stopPropagation();
      this.toggle();
    };
    this.onpointerenter = () => {
      if (!this.#container) {
        let timeout = setTimeout(() => {
          this.toggle(true);
        }, 500);
        this.onpointerleave = () => {
          clearTimeout(timeout);
          this.onpointerleave = null;
        };
      }
    };
    this.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
        this.toggle(true);
        (this.#container?.firstChild as ContextMenu)!.doFocus(undefined, true);
      }
    };
    if (options.sub) {
      this.#sub = options.sub;
    } else {
      throw new Error("Submenu not defined");
    }
    if (typeof options.checked !== "undefined")
      this.attachState(options.checked, (checked) => {
        this.#icon.replaceChildren((checked.ok ? material_navigation_check_rounded() : undefined) as any);
      });
    else if (options.icon)
      this.attachState(options.icon, (icon) => {
        this.#icon.replaceChildren((icon.ok ? icon.value() : undefined) as any);
      });
    if (options.label)
      this.attachState(options.label, (label) => {
        this.#label.innerHTML = label.ok ? String(label.value) : String(label.error.reason);
      });
  }
  static elementName() {
    return "contextmenusub";
  }
  async toggle(toggle: boolean = !this.#container) {
    if (toggle && !this.#container) {
      if ((this.parentElement as ContextMenu).subOpen) (this.parentElement as ContextMenu).subOpen!.toggle(false);
      this.#container = this.#opener.appendChild(new ContextMenuContainer(this.#sub, this));
      (this.parentElement as ContextMenu).subOpen = this;
    } else if (!toggle && this.#container) {
      this.#container.remove();
      this.#container = undefined;
    }
  }
}
defineElement(ContextMenuSub);
//    _____             _     _
//   |  __ \           (_)   | |
//   | |  | | _____   ___  __| | ___ _ __
//   | |  | |/ _ \ \ / / |/ _` |/ _ \ '__|
//   | |__| |  __/\ V /| | (_| |  __/ |
//   |_____/ \___| \_/ |_|\__,_|\___|_|
export class ContextMenuDevider extends Base {
  constructor() {
    super();
    this.appendChild(crel("td")).colSpan = 3;
  }
  static elementName() {
    return "contextmenudevider";
  }
}
defineElement(ContextMenuDevider);
//    __  __
//   |  \/  |
//   | \  / | ___ _ __  _   _
//   | |\/| |/ _ \ '_ \| | | |
//   | |  | |  __/ | | | |_| |
//   |_|  |_|\___|_| |_|\__,_|

type AnyLine = ContextMenuLine | ContextMenuSub | ContextMenuDevider;
export class ContextMenu extends Base {
  subOpen?: ContextMenuSub;
  constructor(lines: (ContextMenuItem | number)[]) {
    super();
    this.appendChild(
      new ContextMenuLine({
        icon: material_navigation_close_rounded,
        label: "Close",
      })
    );
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      this.appendChild(
        typeof line === "number" ? new ContextMenuDevider() : line.sub ? new ContextMenuSub(line) : new ContextMenuLine(line)
      );
    }
    this.tabIndex = -1;
    this.onkeydown = (e) => {
      let target = (e.target === this ? undefined : e.target) as AnyLine;
      if (e.key === "ArrowDown") this.doFocus(target, true);
      if (e.key === "ArrowUp") this.doFocus(target, false);
      if (e.key === "ArrowLeft" || e.key === "Escape") {
        let parent = this.parentElement?.parentElement?.parentElement;
        if (parent instanceof ContextMenuSub) {
          parent.toggle(false);
          (parent.parentElement as ContextMenu)?.doFocus(parent, undefined);
          e.stopPropagation();
        }
      }
    };
  }
  static elementName() {
    return "contextmenu";
  }
  doFocus(child?: AnyLine, direction?: boolean) {
    let next = this.nextFocus(child, direction);
    if (next) next.focus();
    else this.focus();
  }

  nextFocus(from?: AnyLine | null, direction?: boolean, top?: AnyLine | null): AnyLine | null {
    let next = (
      typeof direction === "undefined"
        ? from
        : from
        ? direction
          ? from.nextElementSibling
          : from.previousElementSibling
        : direction
        ? this.firstElementChild
        : this.lastElementChild
    ) as AnyLine | null;
    if (next === top) return null;
    if (next === null || next instanceof ContextMenuDevider || next.inert || !next.getBoundingClientRect().height)
      return this.nextFocus(next, direction ?? true, top || next);
    return next;
  }
}
defineElement(ContextMenu);
//     _____            _        _
//    / ____|          | |      (_)
//   | |     ___  _ __ | |_ __ _ _ _ __   ___ _ __
//   | |    / _ \| '_ \| __/ _` | | '_ \ / _ \ '__|
//   | |___| (_) | | | | || (_| | | | | |  __/ |
//    \_____\___/|_| |_|\__\__,_|_|_| |_|\___|_|
export class ContextMenuContainer extends Base {
  #position: HTMLElement | { x: number; y: number };
  constructor(element: ContextMenuParameter, position: HTMLElement | { x: number; y: number }, width?: number, height?: number) {
    super();
    this.#position = position;
    this.style.width = width + "rem";
    this.style.height = height + "rem";
    this.tabIndex = 0;
    this.onpointerdown = (e) => {
      e.stopPropagation();
    };
    this.oncontextmenu = (e) => {
      e.preventDefault();
    };
    if (typeof element === "function") {
      this.appendChild(crel("div"));
      (async () => {
        let result = await element();
        this.replaceChild(result instanceof HTMLElement ? result : new ContextMenu(result), this.firstChild!);
        (this.firstChild as HTMLElement).focus();
        this.updatePosition();
      })();
    } else this.appendChild(element instanceof HTMLElement ? element : new ContextMenu(element));
    let catcher = this.appendChild(crel("div"));
    catcher.tabIndex = 0;
    this.onkeydown = (e) => {
      if (e.key === "Escape") contextMenuClose();
    };
    catcher.addEventListener("focus", () => {
      this.firstChild instanceof ContextMenu ? this.firstChild.doFocus(undefined, true) : (this.firstChild as HTMLElement).focus();
    });
    this.addEventListener("focus", () => {
      this.firstChild instanceof ContextMenu ? this.firstChild.doFocus(undefined, false) : (this.firstChild as HTMLElement).focus();
    });
  }
  static elementName() {
    return "contextmenucontainer";
  }
  focus(): void {
    (this.firstChild as HTMLElement).focus();
  }
  connectedCallback(): void {
    super.connectedCallback();
    this.updatePosition();
  }
  updatePosition() {
    if (this.#position instanceof HTMLElement) {
      this.style.left = "";
      this.style.right = "";
      this.style.top = "";
      this.style.bottom = "";
      let box = this.getBoundingClientRect();
      let box2 = this.#position.getBoundingClientRect();
      if (box2.x + box2.width + box.width > window.innerWidth)
        if (box2.x - box.width < 0)
          if (box2.x + box.width > window.innerWidth) this.style.right = 0 + "px";
          else this.style.left = box2.x + "px";
        else this.style.right = window.innerWidth - box2.x + "px";
      else this.style.left = box2.x + box2.width + "px";

      if (box2.y + box.height > window.innerHeight)
        if (box2.y - box.height < 0) this.style.bottom = 0 + "px";
        else this.style.bottom = window.innerHeight - box2.y - box2.height + "px";
      else this.style.top = box2.y + "px";
    } else {
      let box = this.getBoundingClientRect();
      if (this.#position.x + box.width > window.innerWidth) this.style.right = 0 + "px";
      else this.style.left = this.#position.x + "px";
      if (this.#position.y + box.height > window.innerHeight) this.style.bottom = window.innerHeight - this.#position.y + "px";
      else this.style.top = this.#position.y + "px";
    }
  }
}
defineElement(ContextMenuContainer);

export async function openContextMenu(
  element: ContextMenuParameter,
  position: HTMLElement | { x: number; y: number },
  document: Document = window.document,
  width?: number,
  height?: number
) {
  let container = new ContextMenuContainer(element, position, width, height);
  document.documentElement.appendChild(container);
  container.focus();
  await new Promise<void>((resolve) => {
    contextMenuCloser = resolve;
  });
  container.remove();
}

//     ____
//    / __ \
//   | |  | |_ __   ___ _ __   ___ _ __ ___
//   | |  | | '_ \ / _ \ '_ \ / _ \ '__/ __|
//   | |__| | |_) |  __/ | | |  __/ |  \__ \
//    \____/| .__/ \___|_| |_|\___|_|  |___/
//          | |
//          |_|
type ContextMenuOpenFunction = (e: MouseEvent) => void;

export function attachContextMenu(element: HTMLElement, menu: ContextMenuParams, width?: number, height?: number): ContextMenuOpenFunction;
export function attachContextMenu(
  element: HTMLElement,
  menu: () => ContextMenuParams,
  width?: number,
  height?: number
): ContextMenuOpenFunction;
export function attachContextMenu(
  element: HTMLElement,
  menu: () => Promise<ContextMenuParams>,
  width?: number,
  height?: number
): ContextMenuOpenFunction;
/**Attaches a context menu to the element
 * @param element The element to attach the context menu to
 * @param menu The context menu to attach
 * @returns handle to dettach the context menu with*/
export function attachContextMenu(
  element: HTMLElement,
  menu: ContextMenuParameter,
  width?: number,
  height?: number
): ContextMenuOpenFunction {
  let openFunc = (e: MouseEvent) => {
    e.preventDefault();
    openContextMenu(menu, { x: e.clientX, y: e.clientY }, element.ownerDocument, width, height);
  };
  element.addEventListener("contextmenu", openFunc);
  return openFunc;
}
/**Dettaches a context menu from the element by the context menu handle */
export function dettachContextMenu(element: HTMLElement, func: ContextMenuOpenFunction) {
  element.removeEventListener("contextmenu", func);
}

let contextMenuCloser = () => {};
let contextMenuClose = () => {
  contextMenuCloser();
};
clickAwayDetector(contextMenuClose);
