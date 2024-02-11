// import "./button.scss";
// import { defineElement } from "@chocolatelibui/core";
// import { FormBaseReadOptions, BasicColors, FormBaseRead } from "../base";
// import { Listener, State } from "@chocolatelib/state";

// interface ButtonOptions extends FormBaseReadOptions<boolean> {
//   /**Buttons text */
//   text?: string;
//   /**Icon for button */
//   icon?: SVGSVGElement;
//   /**Function to call on button click */
//   clickAction?: () => void;
//   /**Set true to make button toggle on click instead of normal */
//   toggle?: boolean;
//   /**Changes the buttons color */
//   color?: BasicColors;
// }

// /**Button for clicking*/
// export class Button extends FormBaseRead<boolean> {
//   private _text: HTMLSpanElement = this._body.appendChild(
//     document.createElement("span")
//   );
//   private _textListener: Listener<string> | undefined;
//   private _icon: SVGSVGElement | undefined;
//   private _click: (() => void) | undefined;
//   private _color: BasicColors | undefined;
//   private _toggle: boolean | undefined;

//   /**Returns the name used to define the element*/
//   static elementName() {
//     return "button";
//   }

//   constructor() {
//     super();
//     this._body.setAttribute("tabindex", "0");
//     this._body.onclick = () => {
//       if (this._click) {
//         this._click();
//       }
//     };
//     this._body.onpointerdown = (e) => {
//       if (e.pointerType !== "touch" && e.button === 0) {
//         e.stopPropagation();
//         this._body.setPointerCapture(e.pointerId);
//         if (!this._toggle) {
//           this._valueSet(true);
//         }
//         this._body.onpointerup = (ev) => {
//           ev.stopPropagation();
//           this._body.releasePointerCapture(ev.pointerId);
//           if (this._toggle) {
//             this._valueSet(!this._value);
//           } else {
//             this._valueSet(false);
//           }
//           this._body.onpointerup = null;
//         };
//       }
//     };
//     this._body.ontouchstart = (e) => {
//       e.stopPropagation();
//       if (!this._toggle) {
//         this._valueSet(true);
//       }
//       this._body.ontouchend = (ev) => {
//         ev.stopPropagation();
//         if (ev.targetTouches.length === 0) {
//           if (this._toggle) {
//             this._valueSet(!this._value);
//           } else {
//             this._valueSet(false);
//           }
//           this._body.ontouchend = null;
//         }
//       };
//     };
//     this._body.onkeydown = (e) => {
//       switch (e.key) {
//         case " ":
//         case "Enter": {
//           e.stopPropagation();
//           e.preventDefault();
//           if (!this._toggle) {
//             this._valueSet(true);
//           }
//           this._body.onkeyup = (e) => {
//             switch (e.key) {
//               case "Enter":
//               case " ": {
//                 e.stopPropagation();
//                 e.preventDefault();
//                 if (this._toggle) {
//                   this._valueSet(!this._value);
//                 } else {
//                   this._valueSet(false);
//                 }
//                 if (this._click) {
//                   this._click();
//                 }
//                 break;
//               }
//             }
//             this._body.onkeyup = null;
//           };
//           break;
//         }
//       }
//     };
//   }

//   /**Sets options for the button*/
//   options(options: ButtonOptions) {
//     super.options(options);
//     if (options.text) {
//       this.text = options.text;
//     }
//     if (options.icon) {
//       this.icon = options.icon;
//     }
//     if (options.clickAction) {
//       this.clickAction = options.clickAction;
//     }
//     if (options.color) {
//       this.color = options.color;
//     }
//     this.toggle = options.toggle;
//     return this;
//   }

//   /**Gets the current text of the button*/
//   get text() {
//     return this._text.innerHTML;
//   }
//   /**Sets the current text of the button*/
//   set text(value: Value<string> | string | undefined) {
//     if (this._textListener) {
//       this.dettachValue(this._textListener);
//       delete this._textListener;
//     }
//     if (typeof value === "object" && value instanceof Value) {
//       this._textListener = this.attachValue(value, (val) => {
//         if (val) {
//           this._text.innerHTML = val;
//         } else {
//           this._text.innerHTML = "";
//         }
//       });
//     } else if (value) {
//       this._text.innerHTML = value;
//     } else {
//       this._text.innerHTML = "";
//     }
//   }

//   /**Returns the icon of the button */
//   get icon() {
//     return this._icon;
//   }

//   /**Changes the icon of the button*/
//   set icon(icon: SVGSVGElement | undefined) {
//     if (icon) {
//       this._icon = this._body.insertBefore(icon, this._text);
//     } else if (this._icon) {
//       this._body.removeChild(this._icon);
//       delete this._icon;
//     }
//   }

//   /**Returns the button click action */
//   get clickAction() {
//     return this._click;
//   }
//   /**Function to call on button click*/
//   set clickAction(func: (() => void) | undefined) {
//     this._click = func;
//   }

//   /**Returns current color of button*/
//   get color() {
//     return this._color;
//   }
//   /**Changes the color of the button*/
//   set color(color: BasicColors | undefined) {
//     if (color) {
//       this._body.setAttribute("color", color);
//     } else if (this._color) {
//       this._body.removeAttribute("color");
//       delete this._color;
//     }
//   }
//   /**Called when Value is changed */
//   protected _ValueUpdate(value: Value<boolean>) {
//     value;
//   }
//   /**Called when the form element is set to not use a Value anymore*/
//   protected _ValueClear() {}
//   /**Called when value is changed */
//   protected _valueUpdate(value: Boolean) {
//     if (value) {
//       this._body.classList.add("active");
//     } else {
//       this._body.classList.remove("active");
//     }
//   }
//   /**Called when value cleared */
//   protected _valueClear() {
//     this._body.classList.remove("active");
//   }

//   /**Returns */
//   get toggle() {
//     return this._toggle;
//   }

//   /**Changes whether the button is maintained or momentary*/
//   set toggle(toggle: boolean | undefined) {
//     this._toggle = Boolean(toggle);
//   }
// }
// defineElement(Button);
