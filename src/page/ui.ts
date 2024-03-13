import "./ui.scss";
import { Base, crel, defineElement } from "@src/base";
import { Menubar } from "@src/menu";
import { ContentBase } from "./content";
import {
  GraphicsLevels,
  InputModes,
  ScrollbarModes,
  Themes,
  graphicsLevel,
  inputMode,
  scale,
  scrollBarMode,
  theme,
} from "@src/theme";
import { openWindowVirtual } from "./window";
import { FormStepper, FormToggleButtons } from "@src/form";

export class UI extends Base {
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
      openWindowVirtual({
        opener: document.body,
        bar: false,
        position: {
          moveable: false,
          left: 2,
          top: 2,
        },
        size: {
          sizeable: false,
          width: 10,
          height: 10,
        },
        content: new UIMenu(),
      });
    };
    this.menubar.appendItem(test2, "start");
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

export class UIMenu extends ContentBase {
  constructor() {
    super();
    this.appendChild(
      new FormToggleButtons({
        label: "UI Theme",
        value: theme,
        writer: theme,
        enum: theme.related().unwrap.list,
      })
    );
    this.appendChild(
      new FormToggleButtons({
        label: "Scrollbar Mode",
        value: scrollBarMode,
        writer: scrollBarMode,
        enum: scrollBarMode.related().unwrap.list,
      })
    );
    this.appendChild(
      new FormToggleButtons({
        label: "Graphics Level",
        value: graphicsLevel,
        writer: graphicsLevel,
        enum: graphicsLevel.related().unwrap.list,
      })
    );
    this.appendChild(
      new FormStepper({ label: "UI Scale", value: scale, writer: scale })
    );
    this.appendChild(
      new FormToggleButtons({
        label: "Input Mode",
        value: inputMode,
        writer: inputMode,
        enum: inputMode.related().unwrap.list,
      })
    );
  }
  static elementName() {
    return "uimenu";
  }
}
defineElement(UIMenu);
