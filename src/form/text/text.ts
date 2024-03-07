import "./text.scss";
import { defineElement } from "@src/base";
import { FormBaseRead, FormBaseReadOptions } from "../base";

interface TextOptions extends FormBaseReadOptions<string | number | boolean> {
  /**Text size */
  textSize?: number;
}

/**Component for simple text */
export class TextField extends FormBaseRead<string | number | boolean> {
  /**Returns the name used to define the element*/
  static elementName() {
    return "text";
  }

  constructor(options: TextOptions) {
    super(options);
    if (typeof options.value !== "undefined")
      this.attachStateToProp("value", options.value);
    if (options.textSize) this.attachStateToProp("textSize", options.textSize);
  }

  /**Sets the current text of the button*/
  set textSize(size: number) {
    this._body.style.fontSize = size + "rem";
  }
  /**Gets the current text of the button*/
  get textSize() {
    return parseInt(this._body.style.fontSize);
  }

  /**Called when value is changed */
  protected _valueUpdate(value: string | number | boolean) {
    this._body.innerHTML = String(value);
  }
  /**Called when value cleared */
  protected _valueClear() {
    this._body.innerHTML = "";
  }
}
defineElement(TextField);

/**Component for simple text */
export class TitleField extends FormBaseRead<string | number | boolean> {
  /**Returns the name used to define the element*/
  static elementName() {
    return "title";
  }

  constructor(options: TextOptions) {
    super(options);
    if (typeof options.value !== "undefined")
      this.attachStateToProp("value", options.value);
    if (options.textSize) this.attachStateToProp("textSize", options.textSize);
  }

  /**Sets the current text of the button*/
  set textSize(size: number) {
    this._body.style.fontSize = size + "rem";
  }
  /**Gets the current text of the button*/
  get textSize() {
    return parseInt(this._body.style.fontSize);
  }

  /**Called when value is changed */
  protected _valueUpdate(value: string | number | boolean) {
    this._body.innerHTML = String(value);
  }
  /**Called when value cleared */
  protected _valueClear() {
    this._body.innerHTML = "";
  }
}
defineElement(TitleField);
