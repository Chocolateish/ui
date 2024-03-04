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
        position: {
          left: 2,
          top: 2,
        },
        size: {
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

    //Theme
    let themeAutoSel = this.appendChild(crel("select"));
    let themes = theme.related().unwrap.list!;
    for (const key in themes) {
      let option = themeAutoSel.appendChild(crel("option"));
      option.innerHTML = key;
    }
    themeAutoSel.addEventListener("change", async (e) => {
      theme.write(
        (<HTMLSelectElement>e.currentTarget).selectedOptions[0]
          .innerHTML as Themes
      );
    });
    themeAutoSel.value = theme.get().unwrap;
    theme.subscribe((val) => {
      themeAutoSel.value = val.unwrap;
    });

    //Scrollbar
    let scrollSel = this.appendChild(crel("select"));
    let scrollbarModes = scrollBarMode.related().unwrap.list!;
    for (const key in scrollbarModes) {
      let option = scrollSel.appendChild(crel("option"));
      option.innerHTML = key;
    }
    scrollSel.addEventListener("change", (e) => {
      scrollBarMode.write(
        (<HTMLSelectElement>e.currentTarget).selectedOptions[0]
          .innerHTML as ScrollbarModes
      );
    });
    scrollSel.value = scrollBarMode.get().unwrap;
    scrollBarMode.subscribe((val) => {
      scrollSel.value = val.unwrap;
    });

    //Animations
    let animAutoSel = this.appendChild(crel("select"));
    let graphicsLevels = graphicsLevel.related().unwrap.list!;
    for (const key in graphicsLevels) {
      let option = animAutoSel.appendChild(crel("option"));
      option.innerHTML = key;
    }
    animAutoSel.addEventListener("change", (e) => {
      graphicsLevel.write(
        (<HTMLSelectElement>e.currentTarget).selectedOptions[0]
          .innerHTML as GraphicsLevels
      );
    });
    animAutoSel.value = graphicsLevel.get().unwrap;
    graphicsLevel.subscribe((val) => {
      animAutoSel.value = val.unwrap;
    });

    //Scale
    let scaleIn = this.appendChild(crel("input"));
    scaleIn.type = "number";
    scaleIn.addEventListener("change", () => {
      scale.write(scaleIn.valueAsNumber);
      scaleIn.valueAsNumber = scale.get().unwrap;
    });
    scaleIn.valueAsNumber = scale.get().unwrap;
    scale.subscribe((val) => {
      scaleIn.valueAsNumber = val.unwrap;
    });

    //InputMode
    let inputModeSel = this.appendChild(crel("select"));
    let inputModes = inputMode.related().unwrap.list!;
    for (const key in inputModes) {
      let option = inputModeSel.appendChild(crel("option"));
      option.innerHTML = key;
    }
    inputModeSel.addEventListener("change", (e) => {
      inputMode.write(
        (<HTMLSelectElement>e.currentTarget).selectedOptions[0]
          .innerHTML as InputModes
      );
    });
    inputModeSel.value = inputMode.get().unwrap;

    inputMode.subscribe((val) => {
      inputModeSel.value = val.unwrap;
    });
  }
  static elementName() {
    return "uimenu";
  }
}
defineElement(UIMenu);
