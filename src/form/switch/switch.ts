import "./switch.scss";
import { defineElement } from "@src/base";
import { FormBaseWrite, FormBaseWriteOptions } from "../base";

interface SwitchOptions extends FormBaseWriteOptions<boolean> {}

/**Toggle Switch, switches between on and off*/
export class Switch extends FormBaseWrite<boolean> {
  private _switch: HTMLDivElement = this._body.appendChild(
    document.createElement("div")
  );
  private _preventClick: boolean = false;

  /**Returns the name used to define the element*/
  static elementName() {
    return "switch";
  }

  constructor(options: SwitchOptions) {
    super(options);
    this._switch.setAttribute("tabindex", "0");
    this._switch.onkeydown = (e) => {
      switch (e.key) {
        case "Enter":
        case " ": {
          e.stopPropagation();
          e.preventDefault();
          this.onkeyup = (e) => {
            switch (e.key) {
              case "Enter":
              case " ": {
                e.stopPropagation();
                e.preventDefault();
                this._valueSet(!this._value);
                break;
              }
            }
            this.onkeyup = null;
          };
          break;
        }
      }
    };

    this._switch.onpointerdown = (e) => {
      if (e.button === 0) {
        e.stopPropagation();
        this._switch.classList.add("active");
        this._switch.setPointerCapture(e.pointerId);
        let hasMoved = false;
        this._switch.onpointermove = (ev) => {
          ev.stopPropagation();
          if (hasMoved) {
            let box = this._switch.getBoundingClientRect();
            let midCord = box.x + box.width / 2;
            if (ev.clientX > midCord) {
              if (!this._value) {
                this._valueSet(true);
              }
            } else {
              if (this._value) {
                this._valueSet(false);
              }
            }
          } else if (
            Math.abs(e.clientX - ev.clientX) > 10 ||
            Math.abs(e.clientY - ev.clientY) > 10
          ) {
            hasMoved = true;
          }
        };

        this._switch.onpointerup = (ev) => {
          ev.stopPropagation();
          this._switch.classList.remove("active");
          if (!hasMoved) {
            this._valueSet(!this._value);
          }
          this._switch.releasePointerCapture(ev.pointerId);
          this._switch.onpointerup = null;
          this._switch.onpointermove = null;
        };
      }
    };

    this._switch.onclick = (e) => {
      e.stopPropagation();
    };

    this._body.onclick = (e) => {
      e.stopPropagation();
      if (this._preventClick) {
        this._preventClick = false;
        return;
      }
      this._valueSet(!this._value);
    };
    if (typeof options.value !== "undefined")
      this.attachStateToProp("value", options.value);
  }

  /**Called when value is changed */
  protected _valueUpdate(value: boolean) {
    if (value) {
      this._switch.classList.add("on");
    } else {
      this._switch.classList.remove("on");
    }
  }
  /**Called when value cleared */
  protected _valueClear() {}
}
defineElement(Switch);
