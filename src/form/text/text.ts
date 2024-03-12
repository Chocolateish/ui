import "./text.scss";
import { StateROrValue, defineElement } from "@src/base";
import { FormBaseRead, FormBaseReadOptions } from "../base";

interface TextOptions extends FormBaseReadOptions<string | number | boolean> {
  /**Is title */
  title?: StateROrValue<boolean>;
  /**Text size 1 is default*/
  size?: StateROrValue<number>;
  /**Text weight */
  weight?: StateROrValue<"normal" | "bold" | "bolder" | "lighter">;
  /**Text style */
  italic?: StateROrValue<"normal" | "italic" | "oblique">;
}

/**Component for simple text */
export class FormTextField extends FormBaseRead<string | number | boolean> {
  /**Returns the name used to define the element*/
  static elementName() {
    return "text";
  }

  constructor(options: TextOptions) {
    super(options);
    if (typeof options.value !== "undefined")
      this.attachStateToProp("value", options.value);
    if (typeof options.title !== "undefined")
      this.attachStateToProp("isTitle", options.title);
    if (options.size) this.attachStateToProp("size", options.size);
    if (options.weight) this.attachStateToProp("weight", options.weight);
    if (options.italic) this.attachStateToProp("italic", options.italic);
  }

  set isTitle(title: boolean) {
    if (title) this._body.setAttribute("title", "");
    else this._body.removeAttribute("title");
  }

  set size(size: number) {
    this._body.style.fontSize = size + "rem";
  }
  get size() {
    return parseInt(this._body.style.fontSize);
  }

  set weight(weight: "normal" | "bold" | "bolder" | "lighter") {
    this._body.style.fontWeight = weight;
  }

  set italic(italic: "normal" | "italic" | "oblique") {
    this._body.style.fontStyle = italic;
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
defineElement(FormTextField);
