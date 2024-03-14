import "./button.scss";
import { crel, defineElement } from "@src/base";
import {
  BasicColors,
  FormBaseRead,
  FormBaseWrite,
  FormBaseWriteOptions,
} from "../base";

interface ButtonOptions extends FormBaseWriteOptions<boolean> {
  /**Buttons text */
  text?: string;
  /**Function to call on button click */
  clickAction?: () => void;
  /**Set true to make button toggle on click instead of normal */
  toggle?: boolean;
  /**Changes the buttons color */
  color?: BasicColors;
}

/**Button for clicking*/
export class FormButton extends FormBaseWrite<boolean> {
  private _text: HTMLSpanElement = this._body.appendChild(crel("span"));
  private _icon: SVGSVGElement | undefined;
  private _click: (() => void) | undefined;
  private _color: BasicColors | undefined;
  private _toggle: boolean | undefined;

  /**Returns the name used to define the element*/
  static elementName() {
    return "button";
  }

  constructor(options: ButtonOptions) {
    super(options);
    this._body.setAttribute("tabindex", "0");
    this._body.onclick = () => {
      if (this._click) {
        this._click();
      }
    };
    this._body.onpointerdown = (e) => {
      if (e.pointerType !== "touch" && e.button === 0) {
        e.stopPropagation();
        this._body.setPointerCapture(e.pointerId);
        if (!this._toggle) {
          this._valueSet(true);
        }
        this._body.onpointerup = (ev) => {
          ev.stopPropagation();
          this._body.releasePointerCapture(ev.pointerId);
          if (this._toggle) {
            this._valueSet(!this._value);
          } else {
            this._valueSet(false);
          }
          this._body.onpointerup = null;
        };
      }
    };
    this._body.ontouchstart = (e) => {
      e.stopPropagation();
      if (!this._toggle) {
        this._valueSet(true);
      }
      this._body.ontouchend = (ev) => {
        ev.stopPropagation();
        if (ev.targetTouches.length === 0) {
          if (this._toggle) {
            this._valueSet(!this._value);
          } else {
            this._valueSet(false);
          }
          this._body.ontouchend = null;
        }
      };
    };
    this._body.onkeydown = (e) => {
      switch (e.key) {
        case " ":
        case "Enter": {
          e.stopPropagation();
          e.preventDefault();
          if (!this._toggle) {
            this._valueSet(true);
          }
          this._body.onkeyup = (e) => {
            switch (e.key) {
              case "Enter":
              case " ": {
                e.stopPropagation();
                e.preventDefault();
                if (this._toggle) {
                  this._valueSet(!this._value);
                } else {
                  this._valueSet(false);
                }
                if (this._click) {
                  this._click();
                }
                break;
              }
            }
            this._body.onkeyup = null;
          };
          break;
        }
      }
    };
    if (options.text) this.attachStateToProp("text", options.text);
    if (options.clickAction) this.clickAction = options.clickAction;
    if (options.color) this.attachStateToProp("color", options.color);
    if (typeof options.toggle !== "undefined")
      this.attachStateToProp("toggle", options.toggle);
    if (typeof options.value !== "undefined")
      this.attachStateToProp("value", options.value);
  }

  /**Gets the current text of the button*/
  get text() {
    return this._text.innerHTML;
  }
  /**Sets the current text of the button*/
  set text(value: string) {
    this._text.innerHTML = value;
  }

  /**Returns the button click action */
  get clickAction() {
    return this._click;
  }
  /**Function to call on button click*/
  set clickAction(func: (() => void) | undefined) {
    this._click = func;
  }

  /**Returns current color of button*/
  get color() {
    return this._color;
  }
  /**Changes the color of the button*/
  set color(color: BasicColors | undefined) {
    if (color) {
      this._body.setAttribute("color", color);
    } else if (this._color) {
      this._body.removeAttribute("color");
      delete this._color;
    }
  }

  /**Changes whether the button is maintained or momentary*/
  set toggle(toggle: boolean) {
    this._toggle = Boolean(toggle);
  }
  /**Returns */
  get toggle(): boolean | undefined {
    return this._toggle;
  }

  /**Called when value is changed */
  protected _valueUpdate(value: Boolean) {
    if (value) {
      this._body.classList.add("active");
    } else {
      this._body.classList.remove("active");
    }
  }
  /**Called when value cleared */
  protected _valueClear() {
    this._body.classList.remove("active");
  }
}
defineElement(FormButton);
