import "./uimenu.scss";
import { defineElement } from "@src/base";
import { ContentBase } from "@src/page/content";
import { graphicsLevel, inputMode, scale, scrollBarMode, theme } from "@src/theme";
import { FormStepper, FormToggleButtons } from "@src/form";

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
    this.appendChild(new FormStepper({ label: "UI Scale", value: scale, writer: scale }));
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
