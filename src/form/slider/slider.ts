import "./slider.scss";
import { crel, defineElement } from "@src/base";
import {
  material_navigation_chevron_left_rounded,
  material_navigation_chevron_right_rounded,
} from "@src/asset";
import { FormStepperBase, FormStepperBaseOptions } from "../base";

/**Slide Selector, displays all options in a slider*/
export class FormSlider extends FormStepperBase {
  private _slide: HTMLDivElement = crel("div");
  private _slider: HTMLDivElement = crel("div");
  private _valueBox: HTMLSpanElement = crel("span");

  /**Returns the name used to define the element*/
  static elementName() {
    return "slider";
  }

  constructor(options: FormStepperBaseOptions) {
    super(options);
    this._body.append(this._iconDec, this._slide, this._iconInc, this._legend);
    this._slide.appendChild(this._slider);
    this._slider.setAttribute("tabindex", "0");
    this._slider.append(this._valueBox, this._unit);
    this._valueBox.textContent = "";

    this._body.onpointerdown = (e) => {
      if (e.button === 0) {
        e.stopPropagation();
        this._slider.classList.add("active");
        let box = this._slider.getBoundingClientRect();
        let offset =
          e.clientX >= box.x
            ? e.clientX <= box.x + box.width
              ? box.x - e.clientX
              : -box.width
            : 0;
        if (this._min === -Infinity || this._max === Infinity) {
          let value = this._value || 0;
          let interval = setInterval(() => {
            if (this._live) {
              this._setValueValidate((value += diff / 50), true);
            } else {
              this._moveValue((value += diff / 50));
            }
          }, 100);
          let diff = this._xToPerc(e.clientX + offset) - 50;

          this._moveSlide(this._xToPerc(e.clientX + offset));
          this._slider.setPointerCapture(e.pointerId);
          this._slider.onpointermove = (ev) => {
            ev.stopPropagation();
            let perc = this._xToPerc(ev.clientX + offset);
            diff = perc - 50;
            this._moveSlide(perc);
          };
          this._slider.onpointerup = (ev) => {
            ev.stopPropagation();
            this._slider.classList.remove("active");
            this._slider.releasePointerCapture(e.pointerId);
            this._slider.onpointermove = null;
            this._slider.onpointerup = null;
            this._moveSlide(50);
            if (!this._live) {
              this._setValueValidate(value, true);
            }
            clearInterval(interval);
          };
        } else {
          this._moveAbsolute(e.clientX + offset, false);
          this._slider.setPointerCapture(e.pointerId);
          this._slider.onpointermove = (ev) => {
            ev.stopPropagation();
            this._moveAbsolute(ev.clientX + offset, false);
          };
          this._slider.onpointerup = (ev) => {
            ev.stopPropagation();
            this._slider.classList.remove("active");
            this._slider.releasePointerCapture(e.pointerId);
            this._slider.onpointermove = null;
            this._slider.onpointerup = null;
            this._moveAbsolute(ev.clientX + offset, true);
          };
        }
      }
    };

    this._slider.onkeydown = (e) => {
      switch (e.key) {
        case "ArrowRight":
          e.stopPropagation();
          this._stepValue(true);
          break;
        case "ArrowLeft":
          e.stopPropagation();
          this._stepValue(false);
          break;
      }
    };
    if (options.iconDecrease)
      this.attachStateToProp("iconDecrease", options.iconDecrease);
    else this.iconDecrease = material_navigation_chevron_left_rounded;
    if (options.iconIncrease)
      this.attachStateToProp("iconIncrease", options.iconIncrease);
    else this.iconIncrease = material_navigation_chevron_right_rounded;
    if (options.value) this.attachStateToProp("value", options.value);
  }

  private _moveAbsolute(x: number, last: boolean) {
    let perc = this._xToPerc(x);
    if (last && !this._live) {
      this._setValueValidate(
        this._valueApplyPrecision(this._percToValue(perc)),
        true
      );
    } else {
      if (this._live) {
        this._setValueValidate(
          this._valueApplyPrecision(this._percToValue(perc)),
          false
        );
      } else {
        this._moveSlide(perc);
        this._moveValue(this._valueApplyPrecision(this._percToValue(perc)));
      }
    }
  }

  /**Calculates the percent from the x value*/
  private _xToPerc(x: number) {
    let box = this._slide.getBoundingClientRect();
    return Math.min(100, Math.max(0, ((x - box.x) / box.width) * 100));
  }

  private _percToValue(perc: number) {
    return (perc / 100) * this._span + this._min;
  }
  private _valueToPerc(value: number) {
    return Math.min(
      Math.max(((-this._min + value) / this._span) * 100, 0),
      100
    );
  }
  private _moveSlide(perc: number) {
    this._slider.style.left = perc + "%";
  }
  private _moveValue(value: number) {
    this._valueBox.textContent = value.toFixed(this._decimals);
  }

  /**Called when value is changed */
  protected _valueUpdate(value: number) {
    this._moveValue(value);
    this._moveSlide(this._valueToPerc(value));
  }
  /**Called when value cleared */
  protected _valueClear() {
    this._moveSlide(50);
    this._valueBox.textContent = "";
  }
}
defineElement(FormSlider);
