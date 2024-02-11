// import {
//   StateError,
//   StateReadAsync,
//   StateWriteAsync,
// } from "@chocolatelib/state";
// import { Base, BaseEvents, BaseOptions } from "@chocolatelibui/core";
// import { grey, orange, green, red, blue, yellow } from "@chocolatelib/colors";
// import { initVariableRoot } from "@chocolatelibui/theme";
// import { name } from "../package.json";

// export let variables = initVariableRoot(name, "Form Elements", "");
// variables.makeVariable(
//   "color",
//   "Text Color",
//   "Standard text color",
//   grey["800"],
//   grey["200"],
//   "Color",
//   undefined
// );
// variables.makeVariable(
//   "selectedColor",
//   "Selected Text Color",
//   "Color of selected text",
//   grey["900"],
//   grey["50"],
//   "Color",
//   undefined
// );
// variables.makeVariable(
//   "unselectedColor",
//   "Unselected Text Color",
//   "Color of unselected text",
//   grey["600"],
//   grey["400"],
//   "Color",
//   undefined
// );
// variables.makeVariable(
//   "labelColor",
//   "Label Color",
//   "Color of label text",
//   grey["700"],
//   grey["300"],
//   "Color",
//   undefined
// );
// variables.makeVariable(
//   "backColor",
//   "Body Color",
//   "Standard body color",
//   grey["50"],
//   grey["900"],
//   "Color",
//   undefined
// );
// variables.makeVariable(
//   "hoverColor",
//   "Hover Color",
//   "Color of body at mouse hover",
//   grey["400"],
//   grey["700"],
//   "Color",
//   undefined
// );
// variables.makeVariable(
//   "borderColor",
//   "Border Color",
//   "Standard border color",
//   grey["700"],
//   grey["500"],
//   "Color",
//   undefined
// );
// variables.makeVariable(
//   "focusColor",
//   "Focus Color",
//   "Color added to selected element",
//   orange["600"],
//   orange["300"],
//   "Color",
//   undefined
// );
// let colors = variables.makeSubGroup(
//   "colors",
//   "Colors",
//   "Basic colors used by form elements"
// );
// colors.makeVariable(
//   "blackColor",
//   "Black",
//   "Basic Black",
//   grey["800"],
//   grey["900"],
//   "Color",
//   undefined
// );
// colors.makeVariable(
//   "blackColorText",
//   "Basic Black Text Color",
//   "Text color for basic black background",
//   grey["200"],
//   grey["200"],
//   "Color",
//   undefined
// );
// colors.makeVariable(
//   "greenColor",
//   "Green",
//   "Basic Green",
//   green["300"],
//   green["900"],
//   "Color",
//   undefined
// );
// colors.makeVariable(
//   "redColor",
//   "Red",
//   "Basic Red",
//   red["300"],
//   red["900"],
//   "Color",
//   undefined
// );
// colors.makeVariable(
//   "blueColor",
//   "Blue",
//   "Basic Blue",
//   blue["300"],
//   blue["900"],
//   "Color",
//   undefined
// );
// colors.makeVariable(
//   "yellowColor",
//   "Yellow",
//   "Basic Yellow",
//   yellow["300"],
//   yellow["900"],
//   "Color",
//   undefined
// );

// export const NoValueText = "-";

// /**Defines all possible background colors for the button*/
// export const enum BasicColors {
//   Black = "black",
//   Green = "green",
//   Red = "red",
//   Blue = "blue",
//   Yellow = "yellow",
// }

// export interface FormBaseReadOptions<T extends boolean | number | string>
//   extends BaseOptions {
//   /**Value for form element */
//   value?: StateReadAsync<T> | T;
//   /**Text for label above form element */
//   label: string;
//   /**Longer description what form element does */
//   description?: string;
//   /**Icon for form element */
//   icon?: () => SVGSVGElement;
// }

// /** Base class for form elements for shared properties and methods*/
// export abstract class FormBaseRead<
//   V extends boolean | number | string,
//   E extends BaseEvents = BaseEvents
// > extends Base<E> {
//   /**Returns the name used to define the element*/
//   static elementName() {
//     return "@abstract@";
//   }
//   /**Returns the namespace override for the element*/
//   static elementNameSpace() {
//     return "chocolatelibui-form";
//   }
//   /**Stores local copy of form element value*/
//   protected _value?: V;
//   /**Icon*/
//   protected _icon?: SVGSVGElement;
//   /**Label container*/
//   protected _label: HTMLSpanElement = document.createElement("span");
//   /**Description container*/
//   protected _description?: HTMLSpanElement;
//   /**Body of form element*/
//   protected _body: HTMLDivElement = document.createElement("div");
//   /**Flag for when user has changed the value of the form element*/
//   readonly changed: boolean = false;

//   constructor() {
//     super();
//     this.appendChild(this._label);
//     this.appendChild(this._body);
//   }

//   /**Sets options for the element*/
//   options(options: FormBaseReadOptions<V>) {
//     super.options(options);
//     if (typeof options.value === "object") {
//       this.valueByState(options.value);
//     } else {
//       this.value = options.value;
//     }
//     if (options.label) {
//       this.label = options.label;
//     }
//     return this;
//   }

//   /**Returns value of form element*/
//   get value() {
//     return this._value;
//   }
//   /**Changes value of form element*/
//   set value(value: V | undefined) {
//     //@ts-expect-error
//     this.changed = false;
//     this._value = value;
//     if (typeof value === "undefined") {
//       this._valueClear();
//     } else {
//       this._valueUpdate(value);
//     }
//   }
//   /**Changes value of form element*/
//   valueByState(
//     state: StateReadAsync<V> | undefined,
//     visible?: boolean,
//     fallback?: V,
//     fallbackFunc?: (error: StateError) => V
//   ) {
//     if (state) {
//       this.attachStateToProp("value", state, visible, fallback, fallbackFunc);
//     } else {
//       this.dettachStateFromProp("value");
//     }
//   }
//   /**Called when value is changed */
//   protected abstract _valueUpdate(value: V): void;
//   /**Called when value cleared */
//   protected abstract _valueClear(): void;

//   /**Gets the current label of the element*/
//   get label(): string {
//     return this._label.innerHTML;
//   }
//   /**Sets the current label of the element*/
//   set label(text: string) {
//     this._label.innerHTML = text;
//   }
//   /**Sets the label of the element by state */
//   labelByState(
//     text: StateReadAsync<string> | undefined,
//     visible?: boolean,
//     fallback?: string,
//     fallbackFunc?: (error: StateError) => string
//   ) {
//     if (text) {
//       this.attachStateToProp("label", text, visible, fallback, fallbackFunc);
//     } else {
//       this.dettachStateFromProp("label");
//     }
//   }
// }

// export interface FormBaseWriteOptions<V extends boolean | number | string>
//   extends FormBaseReadOptions<V> {
//   /**Value for form element */
//   value?: StateWriteAsync<V> | V;
// }

// interface FormBaseWriteEvents<T extends boolean | number | string>
//   extends BaseEvents {
//   /**Event fired when user changes value */
//   valueChangeUser: T;
// }

// export abstract class FormBaseWrite<
//   V extends boolean | number | string,
//   E extends FormBaseWriteEvents<V> = FormBaseWriteEvents<V>
// > extends FormBaseRead<V, E> {
//   /**Sets options for the element*/
//   options(options: FormBaseWriteOptions<V>) {
//     return super.options(options);
//   }

//   /**Buffer of linked state */
//   private _state?: StateWriteAsync<V>;

//   /**Changes value of form element*/
//   valueByState(
//     state: StateWriteAsync<V> | undefined,
//     visible?: boolean,
//     fallback?: V,
//     fallbackFunc?: (error: StateError) => V
//   ) {
//     if (state) {
//       this._state = state;
//       this.attachStateToProp("value", state, visible, fallback, fallbackFunc);
//     } else {
//       delete this._state;
//       this.dettachStateFromProp("value");
//     }
//   }

//   /**Called to change value*/
//   protected _valueSet(value: V) {
//     //@ts-expect-error
//     this.changed = true;
//     if (this._state) {
//       this._state.write(value);
//     }
//     this._value = value;
//     this._valueUpdate(value);
//     this._events.emit("valueChangeUser", value);
//   }
// }
