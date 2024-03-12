import "./progress.scss";
import { defineElement } from "@src/base";
import {
  FormNumberReadBaseOptions,
  NoValueText,
  FormNumberReadBase,
} from "../base";

/**Slide Selector, displays all options in a slider*/
export class FormProgress extends FormNumberReadBase {
  private _bar: HTMLDivElement;
  private _val: HTMLSpanElement;

  /**Returns the name used to define the element*/
  static elementName() {
    return "progress";
  }

  constructor(options: FormNumberReadBaseOptions) {
    super(options);
    this._bar = this._body.appendChild(document.createElement("div"));
    this._val = this._body.appendChild(document.createElement("span"));
    this._body.appendChild(this._unit);
    if (typeof options.value !== "undefined")
      this.attachStateToProp("value", options.value);
  }

  /**Called when value is changed */
  protected _valueUpdate(value: number) {
    this._bar.style.width =
      Math.min(Math.max(((value - this._min) / this._span) * 100, 0), 100) +
      "%";
    this._val.innerHTML = value.toFixed(this._decimals);
  }
  /**Called when value cleared */
  protected _valueClear() {
    this._bar.style.width = "50%";
    this._val.innerHTML = NoValueText;
  }
}
defineElement(FormProgress);
