import "./inputBase.scss";
import { FormBaseRead } from "../base";
import { defineElement } from "@src/base";

export enum FormInputType {
  text = "text",
  password = "password",
  email = "email",
  url = "url",
  tel = "tel",
  number = "number",
  date = "date",
  time = "time",
  datetime = "datetime-local",
  month = "month",
  week = "week",
  color = "color",
}

/**Base for number elements elements*/
export class FormInput<
  T extends string | number | boolean
> extends FormBaseRead<T> {
  static elementName() {
    return "input";
  }

  protected _input: HTMLInputElement = this._body.appendChild(
    document.createElement("input")
  );

  /**Called when value is changed */
  protected _valueUpdate(value: T) {
    value;
  }
  /**Called when value cleared */
  protected _valueClear() {}
}
defineElement(FormInput);
