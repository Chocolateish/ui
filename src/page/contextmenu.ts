import "./contextMenu.scss";
import { Base, defineElement } from "@src/base";

export class ContextMenuContainer extends Base {
  constructor(x: number, y: number, width?: number, height?: number) {
    super();
    this.style.left = x + "px";
    this.style.top = y + "px";
    this.style.width = width + "px";
    this.style.height = height + "px";
  }
  static elementName() {
    return "contextmenucontainer";
  }
}
defineElement(ContextMenuContainer);

export function openContextMenu(
  element: Base,
  x: number,
  y: number,
  document: Document = window.document,
  width?: number,
  height?: number
) {
  let container = new ContextMenuContainer(x, y, width, height);
  document.documentElement.appendChild(container);
}

type ContextMenuOpenFunction = (e: MouseEvent) => void;

/**Attaches a context menu to the element
 * @param element The element to attach the context menu to
 * @param menu The context menu to attach
 * @returns handle to dettach the context menu with*/
export function attachContextMenu(
  element: HTMLElement,
  menu: Base | (() => Base)
): ContextMenuOpenFunction {
  let openFunc = (e: MouseEvent) => {
    e.preventDefault();
    openContextMenu(menu instanceof Base ? menu : menu(), e.clientX, e.clientY);
  };
  element.addEventListener("contextmenu", openFunc);
  return openFunc;
}
/**Dettaches a context menu from the element by the context menu handle */
export function dettachContextMenu(
  element: HTMLElement,
  func: ContextMenuOpenFunction
) {
  element.removeEventListener("contextmenu", func);
}
