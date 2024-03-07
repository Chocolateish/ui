import { StateError, StateRead, StateWrite } from "@src/state";
import { Base, BaseOptions } from "@src/base";
import { grey, orange, green, red, blue, yellow } from "@src/asset";
import { themeBuiltInRoot } from "@src/theme";

export let variables = themeBuiltInRoot.makeSubGroup(
  "frm",
  "Form Elements",
  ""
);
variables.makeVariable(
  "color",
  "Text Color",
  "Standard text color",
  grey["800"],
  grey["200"],
  "Color",
  undefined
);
variables.makeVariable(
  "selectedColor",
  "Selected Text Color",
  "Color of selected text",
  grey["900"],
  grey["50"],
  "Color",
  undefined
);
variables.makeVariable(
  "unselectedColor",
  "Unselected Text Color",
  "Color of unselected text",
  grey["600"],
  grey["400"],
  "Color",
  undefined
);
variables.makeVariable(
  "labelColor",
  "Label Color",
  "Color of label text",
  grey["700"],
  grey["300"],
  "Color",
  undefined
);
variables.makeVariable(
  "backColor",
  "Body Color",
  "Standard body color",
  grey["50"],
  grey["900"],
  "Color",
  undefined
);
variables.makeVariable(
  "hoverColor",
  "Hover Color",
  "Color of body at mouse hover",
  grey["400"],
  grey["700"],
  "Color",
  undefined
);
variables.makeVariable(
  "borderColor",
  "Border Color",
  "Standard border color",
  grey["700"],
  grey["500"],
  "Color",
  undefined
);
variables.makeVariable(
  "focusColor",
  "Focus Color",
  "Color added to selected element",
  orange["600"],
  orange["300"],
  "Color",
  undefined
);
let colors = variables.makeSubGroup(
  "colors",
  "Colors",
  "Basic colors used by form elements"
);
colors.makeVariable(
  "blackColor",
  "Black",
  "Basic Black",
  grey["800"],
  grey["900"],
  "Color",
  undefined
);
colors.makeVariable(
  "blackColorText",
  "Basic Black Text Color",
  "Text color for basic black background",
  grey["200"],
  grey["200"],
  "Color",
  undefined
);
colors.makeVariable(
  "greenColor",
  "Green",
  "Basic Green",
  green["300"],
  green["900"],
  "Color",
  undefined
);
colors.makeVariable(
  "redColor",
  "Red",
  "Basic Red",
  red["300"],
  red["900"],
  "Color",
  undefined
);
colors.makeVariable(
  "blueColor",
  "Blue",
  "Basic Blue",
  blue["300"],
  blue["900"],
  "Color",
  undefined
);
colors.makeVariable(
  "yellowColor",
  "Yellow",
  "Basic Yellow",
  yellow["300"],
  yellow["900"],
  "Color",
  undefined
);
colors.makeVariable(
  "white",
  "White",
  "Basic White",
  grey["900"],
  grey["900"],
  "Color",
  undefined
);

export const NoValueText = "-";

/**Basic colors used by form elements*/
export const enum BasicColors {
  Black = "black",
  White = "white",
  Green = "green",
  Red = "red",
  Blue = "blue",
  Yellow = "yellow",
}

type ReadWrite<
  V extends boolean | number | string,
  RW extends "Read" | "Write"
> = RW extends "Read" ? V | StateRead<V> : V | StateWrite<V>;
export interface FormBaseReadOptions<
  V extends boolean | number | string,
  RW extends "Read" | "Write" = "Read"
> extends BaseOptions {
  /**Value for form element */
  value?: ReadWrite<V, RW>;
  /**Text for label above form element */
  label: string | StateRead<string>;
  /**Longer description what form element does */
  description?: string | StateRead<string>;
  /**Icon for form element */
  symbol?: (() => SVGSVGElement) | StateRead<() => SVGSVGElement>;
}

/** Base class for form elements for shared properties and methods*/
export abstract class FormBaseRead<
  V extends boolean | number | string,
  RW extends "Read" | "Write" = "Read",
  E extends {} = any
> extends Base<E> {
  /**Returns the name used to define the element*/
  static elementName() {
    return "form";
  }
  /**Stores local copy of form element value*/
  protected _value?: V;
  /**Symbol container*/
  protected _symbolContainer: HTMLSpanElement = document.createElement("span");
  /**Label container*/
  protected _label: HTMLSpanElement = document.createElement("span");
  /**Description container*/
  protected _description?: HTMLSpanElement;
  /**Body of form element*/
  protected _body: HTMLDivElement = document.createElement("div");
  /**Flag for when user has changed the value of the form element*/
  readonly changed: boolean = false;

  constructor(options: FormBaseReadOptions<V, RW>) {
    super(options);
    this.appendChild(this._label);
    this.appendChild(this._body);
    if (options.label) this.attachStateToProp("label", options.label);
  }

  /**Returns value of form element*/
  get value() {
    return this._value;
  }
  /**Changes value of form element*/
  set value(value: V | undefined) {
    //@ts-expect-error
    this.changed = false;
    this._value = value;
    if (typeof value === "undefined") {
      this._valueClear();
    } else {
      this._valueUpdate(value);
    }
  }
  /**Called when value is changed */
  protected abstract _valueUpdate(value: V): void;
  /**Called when value cleared */
  protected abstract _valueClear(): void;

  /**Changes value of form element*/
  valueByState(
    state: StateWrite<V> | undefined,
    visible?: boolean,
    fallback?: V,
    fallbackFunc?: (error: StateError) => V
  ) {
    if (state) {
      this.attachStateToProp("value", state, visible, fallback, fallbackFunc);
    } else {
      this.dettachStateFromProp("value");
    }
  }

  /**Sets the current label of the element*/
  set label(text: string) {
    this._label.innerHTML = text;
  }
  /**Gets the current label of the element*/
  get label(): string {
    return this._label.innerHTML;
  }
  /**Sets the current symbol of the element*/
  set symbol(symbol: SVGSVGElement) {
    this._symbolContainer.replaceChildren(symbol);
  }
  /**Gets the current symbol of the element*/
  get symbol(): SVGSVGElement | undefined {
    return this._symbolContainer.firstChild as SVGSVGElement | undefined;
  }
}

export interface FormBaseWriteOptions<V extends boolean | number | string>
  extends FormBaseReadOptions<V, "Write"> {
  /**Value for form element */
  value?: StateWrite<V> | V;
}

interface FormBaseWriteEvents<T extends boolean | number | string> {
  /**Event fired when user changes value */
  valueChangeUser: T;
}

export abstract class FormBaseWrite<
  V extends boolean | number | string,
  E extends FormBaseWriteEvents<V> = FormBaseWriteEvents<V>
> extends FormBaseRead<V, "Write", E> {
  /**Returns the name used to define the element*/
  static elementName() {
    return "@abstract@";
  }

  /**Buffer of linked state */
  private _state?: StateWrite<V>;

  /**Changes value of form element*/
  valueByState(
    state: StateWrite<V> | undefined,
    visible?: boolean,
    fallback?: V,
    fallbackFunc?: (error: StateError) => V
  ) {
    if (state) {
      this._state = state;
      this.attachStateToProp("value", state, visible, fallback, fallbackFunc);
    } else {
      delete this._state;
      this.dettachStateFromProp("value");
    }
  }

  /**Called to change value*/
  protected _valueSet(value: V) {
    //@ts-expect-error
    this.changed = true;
    if (this._state) {
      this._state.write(value);
    }
    this._value = value;
    this._valueUpdate(value);
    this.dispatchEvent(
      new CustomEvent<FormBaseWriteEvents<V>["valueChangeUser"]>(
        "valueChangeUser",
        { detail: value }
      )
    );
  }
}

export interface FormNumberBaseOptions<RW extends "Read" | "Write" = "Read">
  extends FormBaseReadOptions<number, RW> {
  /**Lower limit for slider value*/
  min?: number | StateRead<number>;
  /**Upper limit for slider value*/
  max?: number | StateRead<number>;
  /**Step size, use 0 for automatic step size*/
  step?: number | StateRead<number>;
  /**Amount of decimals to show*/
  decimals?: number | StateRead<number>;
  /**Unit to use for slider*/
  unit?: string | StateRead<string>;
}
