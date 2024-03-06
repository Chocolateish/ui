import "./lamp.scss";
import { defineElement } from "@src/base";
import { FormBaseReadOptions, BasicColors, FormBaseRead } from "../base";

interface LampOptions extends FormBaseReadOptions<number | boolean> {
  /**Lamp text */
  text?: string;
  /**Sets the lamp colors */
  colors?: BasicColors[];
}

/**Lamp for clicking*/
export class Lamp extends FormBaseRead<number | boolean> {
  private _text: HTMLSpanElement = this._body.appendChild(
    document.createElement("span")
  );
  private _colors: BasicColors[] = [];

  constructor(options: LampOptions) {
    super(options);
    this.colors = options.colors;
    if (typeof options.value !== "undefined")
      this.attachStateToProp("value", options.value);
    if (options.text) this.attachStateToProp("text", options.text);
  }

  /**Returns the name used to define the element*/
  static elementName() {
    return "lamp";
  }

  /**Sets the current text of the button*/
  set text(value: string) {
    this._text.innerHTML = value;
  }
  /**Gets the current text of the button*/
  get text() {
    return this._text.innerHTML;
  }

  /** Sets the background color of the lamp*/
  set colors(colors: BasicColors[] | undefined) {
    if (colors) {
      this._colors = colors;
    } else {
      this._colors = [BasicColors.Black, BasicColors.Green];
    }
  }

  /**Called when value is changed */
  protected _valueUpdate(value: number | boolean) {
    let color = this._colors[Number(value)];
    if (color) {
      this._body.setAttribute("color", <string>color);
    } else {
      this._body.removeAttribute("color");
    }
  }
  /**Called when value cleared */
  protected _valueClear() {
    this.removeAttribute("color");
  }
}
defineElement(Lamp);
