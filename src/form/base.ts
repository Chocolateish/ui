import { StateEnumHelperList, StateError, StateWrite } from "@src/state";
import { Base, BaseOptions, StateROrValue } from "@src/base";
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

//    _____                _   ____
//   |  __ \              | | |  _ \
//   | |__) |___  __ _  __| | | |_) | __ _ ___  ___
//   |  _  // _ \/ _` |/ _` | |  _ < / _` / __|/ _ \
//   | | \ \  __/ (_| | (_| | | |_) | (_| \__ \  __/
//   |_|  \_\___|\__,_|\__,_| |____/ \__,_|___/\___|
export interface FormBaseReadOptions<V> extends BaseOptions {
  /**Unique id for form element */
  id?: StateROrValue<string | number | symbol>;
  /**Value for form element */
  value?: StateROrValue<V>;
  /**Text for label above form element */
  label?: StateROrValue<string>;
  /**Longer description what form element does */
  description?: StateROrValue<string>;
  /**Icon for form element */
  icon?: StateROrValue<() => SVGSVGElement>;
}

/** Base class for form elements for shared properties and methods*/
export abstract class FormBaseRead<V, E extends {} = any> extends Base<E> {
  /**Returns the name used to define the element*/
  static elementName() {
    return "form";
  }
  protected _id?: string | number | symbol;
  /**Stores local copy of form element value*/
  protected _value?: V;
  /**icon container*/
  protected _iconContainer: HTMLSpanElement = document.createElement("span");
  /**Label container*/
  protected _label: HTMLSpanElement = document.createElement("span");
  /**Description container*/
  protected _description?: HTMLSpanElement = document.createElement("span");
  /**Body of form element*/
  protected _body: HTMLDivElement = document.createElement("div");
  /**Flag for when user has changed the value of the form element*/
  readonly changed: boolean = false;

  constructor(options: FormBaseReadOptions<V>) {
    super(options);
    this.appendChild(this._label);
    this.appendChild(this._body);
    if (options.label) this.attachStateToProp("label", options.label);
    if (typeof options.id !== "undefined")
      this.attachStateToProp("elementId", options.id);
    if (options.description)
      this.attachStateToProp("description", options.description);
    if (options.icon) this.attachStateToProp("icon", options.icon);
  }

  /**Sets the id of the element*/
  set elementId(id: string | number | symbol | undefined) {
    this._id = id;
  }
  /**Gets the id of the element*/
  get elementId(): string | number | symbol | undefined {
    return this._id;
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

  /**Sets the current label of the element*/
  set label(text: string) {
    this._label.innerHTML = text;
  }
  /**Gets the current label of the element*/
  get label(): string {
    return this._label.innerHTML;
  }

  /**Sets the current icon of the element*/
  set icon(icon: () => SVGSVGElement) {
    this._iconContainer.replaceChildren(icon());
  }

  /**Sets the current label of the element*/
  set description(description: string) {
    this.title = description;
  }
  /**Gets the current label of the element*/
  get description(): string {
    return this.title;
  }
}

//   __          __   _ _         ____
//   \ \        / /  (_) |       |  _ \
//    \ \  /\  / / __ _| |_ ___  | |_) | __ _ ___  ___
//     \ \/  \/ / '__| | __/ _ \ |  _ < / _` / __|/ _ \
//      \  /\  /| |  | | ||  __/ | |_) | (_| \__ \  __/
//       \/  \/ |_|  |_|\__\___| |____/ \__,_|___/\___|
export interface FormBaseWriteOptions<V> extends FormBaseReadOptions<V> {
  /**Writer for change of value */
  writer?: StateWrite<V> | ((val: V) => void);
}

interface FormBaseWriteEvents<T> {
  /**Event fired when user changes value */
  valueChangeUser: T;
}

export abstract class FormBaseWrite<
  V,
  E extends FormBaseWriteEvents<V> = FormBaseWriteEvents<V>
> extends FormBaseRead<V, E> {
  /**Returns the name used to define the element*/
  static elementName() {
    return "@abstract@";
  }

  constructor(options: FormBaseWriteOptions<V>) {
    super(options);
    if (options.writer) this.writer = options.writer;
  }

  /**Buffer of linked state */
  private _writer?: StateWrite<V> | ((val: V) => void);

  /**Changes value of form element*/
  set writer(value: StateWrite<V> | ((val: V) => void) | undefined) {
    this._writer = value;
  }
  /**Returns value of form element*/
  get writer() {
    return this._writer;
  }

  /**Called to change value*/
  protected _valueSet(value: V) {
    //@ts-expect-error
    this.changed = true;
    switch (typeof this._writer) {
      case "function":
        this._writer(value);
        break;
      case "object":
        this._writer.write(value);
        break;
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

//    _   _                 _                 _____                _   ____
//   | \ | |               | |               |  __ \              | | |  _ \
//   |  \| |_   _ _ __ ___ | |__   ___ _ __  | |__) |___  __ _  __| | | |_) | __ _ ___  ___
//   | . ` | | | | '_ ` _ \| '_ \ / _ \ '__| |  _  // _ \/ _` |/ _` | |  _ < / _` / __|/ _ \
//   | |\  | |_| | | | | | | |_) |  __/ |    | | \ \  __/ (_| | (_| | | |_) | (_| \__ \  __/
//   |_| \_|\__,_|_| |_| |_|_.__/ \___|_|    |_|  \_\___|\__,_|\__,_| |____/ \__,_|___/\___|

type StepFunc = (value: number) => number;
export interface FormNumberReadBaseOptions extends FormBaseReadOptions<number> {
  /**Lower limit for slider value*/
  min?: StateROrValue<number>;
  /**Upper limit for slider value*/
  max?: StateROrValue<number>;
  /**Step size, use 0 for automatic step size*/
  step?: StateROrValue<number | StepFunc>;
  /**Amount of decimals to show*/
  decimals?: StateROrValue<number>;
  /**Unit to use for slider*/
  unit?: StateROrValue<string>;
}

/**Base for number elements elements*/
export abstract class FormNumberReadBase<
  E extends {} = any
> extends FormBaseRead<number, E> {
  static elementName() {
    return "@abstract@";
  }
  /**Minimum and maximum value for element */
  protected _min: number = -Infinity;
  protected _max: number = Infinity;
  protected _span: number = Infinity;
  /**Precision of input*/
  protected _step: number = 0;
  protected _stepFunc?: StepFunc;
  protected _decimals: number = 0;
  /**Unit of input*/
  protected _unit: HTMLSpanElement = document.createElement("span");

  constructor(options: FormNumberReadBaseOptions) {
    super(options);
    if (typeof options.step !== "undefined")
      this.attachStateToProp("step", options.step);
    if (typeof options.decimals !== "undefined")
      this.attachStateToProp("decimals", options.decimals);
    if (typeof options.min !== "undefined")
      this.attachStateToProp("min", options.min);
    if (typeof options.max !== "undefined")
      this.attachStateToProp("max", options.max);
    if (options.unit) this.attachStateToProp("unit", options.unit);
  }

  /**Gets the minimum value on the element*/
  get min() {
    return this._min;
  }
  /**Set the minimum value*/
  set min(min: number | undefined) {
    this._min = min ?? -Infinity;
    this._updateMinMax();
  }

  /**Gets the maximum value on the element*/
  get max() {
    return this._max;
  }
  /**Set the minimum value*/
  set max(max: number | undefined) {
    this._max = max ?? Infinity;
    this._updateMinMax();
  }

  private _updateMinMax() {
    this._span = this._max - this._min;
    if (String(this._max).length > 5) {
      this._setMinMax(
        this._min === -Infinity ? "" : "Min:" + this._min.toPrecision(5),
        this._max === Infinity ? "" : "Max:" + this._max.toPrecision(5)
      );
    } else {
      this._setMinMax(
        this._min === -Infinity
          ? ""
          : "Min:" + this._min.toFixed(this.decimals),
        this._max === Infinity ? "" : "Max:" + this._max.toFixed(this.decimals)
      );
    }
  }

  protected _setMinMax(_minLegend: string, _maxLegend: string) {}

  /**Gets the amount of steps on the slider*/
  get step() {
    return this._step;
  }
  /**Sets the amount of steps on the slider*/
  set step(step: number | undefined | ((value: number) => number)) {
    if (typeof step === "function") {
      this._stepFunc = step;
    } else {
      this._stepFunc = undefined;
      this._step = step ?? 0;
    }
  }

  /**Gets the amount of decimals the element can have*/
  get decimals() {
    return this._decimals;
  }
  /**Sets the amount of decimals the element can have*/
  set decimals(dec: number | undefined) {
    this._decimals = Math.max(dec ?? 0, 0);
  }

  /**Returns the current unit value*/
  get unit(): string {
    return this._unit.textContent ?? "";
  }

  /**Sets the unit of the element*/
  set unit(unit: string | undefined) {
    this._setUnit(unit);
  }
  /**Method for ancestors to overwrite */
  protected _setUnit(unit: string | undefined) {
    this._unit.textContent = unit ?? "";
  }
}

//    _   _                 _                __          __   _ _         ____
//   | \ | |               | |               \ \        / /  (_) |       |  _ \
//   |  \| |_   _ _ __ ___ | |__   ___ _ __   \ \  /\  / / __ _| |_ ___  | |_) | __ _ ___  ___
//   | . ` | | | | '_ ` _ \| '_ \ / _ \ '__|   \ \/  \/ / '__| | __/ _ \ |  _ < / _` / __|/ _ \
//   | |\  | |_| | | | | | | |_) |  __/ |       \  /\  /| |  | | ||  __/ | |_) | (_| \__ \  __/
//   |_| \_|\__,_|_| |_| |_|_.__/ \___|_|        \/  \/ |_|  |_|\__\___| |____/ \__,_|___/\___|

export interface FormNumberWriteBaseOptions extends FormNumberReadBaseOptions {
  /**Writer for change of value */
  writer?: StateWrite<number> | ((val: number) => void);
}

/**Base for number elements elements*/
export abstract class FormNumberWriteBase<
  E extends FormBaseWriteEvents<number> = FormBaseWriteEvents<number>
> extends FormNumberReadBase<E> {
  static elementName() {
    return "@abstract@";
  }
  constructor(options: FormNumberWriteBaseOptions) {
    super(options);
    if (options.writer) this.writer = options.writer;
  }

  /**Element used to display validation warnings*/
  protected _validator: HTMLButtonElement = this._body.appendChild(
    document.createElement("button")
  );

  /**Buffer of linked state */
  private _writer?: StateWrite<number> | ((val: number) => void);

  /**Changes value of form element*/
  set writer(writer: StateWrite<number> | ((val: number) => void) | undefined) {
    this._writer = writer;
  }
  /**Returns value of form element*/
  get writer() {
    return this._writer;
  }

  /**Called to change value*/
  protected _valueSet(value: number) {
    //@ts-expect-error
    this.changed = true;
    switch (typeof this._writer) {
      case "function":
        this._writer(value);
        break;
      case "object":
        this._writer.write(value);
        break;
    }
    this._value = value;
    this._valueUpdate(value);
    this.dispatchEvent(
      new CustomEvent<FormBaseWriteEvents<number>["valueChangeUser"]>(
        "valueChangeUser",
        { detail: value }
      )
    );
  }

  /**Validates given value then sets it*/
  protected _setValueValidate(val: number, warn: boolean): boolean | void {
    if (typeof this._writer === "object") {
      let reason = this._writer.check(val);
      let limit = this._writer.limit(val);
      if (reason.some) {
        this._warnValidator(reason.value, warn);
        this._valueSet(limit.some ? limit.value : val);
        return true;
      }
    }
    if (val < this._min) {
      this._warnValidator(
        "Minimum value is " + this._min.toFixed(this._decimals),
        warn
      );
      this._valueSet(this._min);
      return true;
    }
    if (val > this._max) {
      this._warnValidator(
        "Maximum value is " + this._max.toFixed(this._decimals),
        warn
      );
      this._valueSet(this._max);
      return true;
    }
    this._warnValidator("", true);
    this._valueSet(val);
  }

  /**Displays warning for value validation*/
  private _warnValidator(warning: string, warn: boolean) {
    if (warn) {
      this._validator.setCustomValidity(warning);
      this._validator.reportValidity();
    }
  }

  /**Method for ancestors to overwrite */
  protected _valueApplyPrecision(value: number) {
    value = Number(value.toFixed(this._decimals));
    if (this._step !== 0) {
      let modBuff = value % this._step;
      return modBuff >= this._step / 2
        ? value + this._step - modBuff
        : value - modBuff;
    } else {
      return value;
    }
  }
}
//    _   _                 _                  _____ _                               ____
//   | \ | |               | |                / ____| |                             |  _ \
//   |  \| |_   _ _ __ ___ | |__   ___ _ __  | (___ | |_ ___ _ __  _ __   ___ _ __  | |_) | __ _ ___  ___
//   | . ` | | | | '_ ` _ \| '_ \ / _ \ '__|  \___ \| __/ _ \ '_ \| '_ \ / _ \ '__| |  _ < / _` / __|/ _ \
//   | |\  | |_| | | | | | | |_) |  __/ |     ____) | ||  __/ |_) | |_) |  __/ |    | |_) | (_| \__ \  __/
//   |_| \_|\__,_|_| |_| |_|_.__/ \___|_|    |_____/ \__\___| .__/| .__/ \___|_|    |____/ \__,_|___/\___|
//                                                          | |   | |
//                                                          |_|   |_|
export interface FormStepperBaseOptions extends FormNumberWriteBaseOptions {
  /**wether the events are live as the slider is moved or only when moving stops */
  live?: boolean;
  /**Icon to use for decreasing value*/
  iconDecrease?: StateROrValue<() => SVGSVGElement>;
  /**Icon to use for increasing value*/
  iconIncrease?: StateROrValue<() => SVGSVGElement>;
}

/**Base for stepper elements*/
export abstract class FormStepperBase extends FormNumberWriteBase {
  protected _live: boolean = false;
  protected _iconDec: SVGSVGElement | undefined;
  protected _iconInc: SVGSVGElement | undefined;
  constructor(options: FormStepperBaseOptions) {
    super(options);
    this.live = options.live;
    if (options.iconDecrease)
      this.attachStateToProp("iconLeft", options.iconDecrease);
    if (options.iconIncrease)
      this.attachStateToProp("iconRight", options.iconIncrease);
  }

  /**Gets wether the slider is in live mode*/
  get live() {
    return this._live;
  }
  /**Set wether the slider is in live mode*/
  set live(live: boolean | undefined) {
    this._live = live || false;
  }

  /**Changes the icon on the left of the slider*/
  set iconLeft(icon: () => SVGSVGElement) {
    let sym = icon();
    this._iconDec?.replaceWith(sym);
    this._stepperFunc(sym, false);
  }

  /**Changes the icon on the right of the slider*/
  set iconRight(icon: () => SVGSVGElement) {
    let sym = icon();
    this._iconInc?.replaceWith(sym);
    this._stepperFunc(sym, true);
  }

  protected _stepperFunc(icon: SVGSVGElement, dir: boolean) {
    icon.onpointerdown = (e) => {
      if (e.button === 0) {
        e.stopPropagation();
        let interval = 0;
        let scalerInterval = 0;
        let scaler = 200;
        let release = () => {
          clearInterval(interval);
          clearInterval(scalerInterval);
          clearTimeout(timeout);
          icon.onpointerup = null;
          icon.releasePointerCapture(e.pointerId);
          icon.classList.remove("active");
        };
        icon.setPointerCapture(e.pointerId);
        icon.classList.add("active");
        let timeout = setTimeout(() => {
          if (this._stepValue(dir)) {
            icon.onpointerup = null;
          } else {
            interval = setInterval(() => {
              if (this._stepValue(dir)) {
                release();
              }
            }, scaler);
            scalerInterval = setInterval(() => {
              if (scaler > 20) {
                scaler /= 1.1;
              }
              clearInterval(interval);
              interval = setInterval(() => {
                if (this._stepValue(dir)) {
                  release();
                }
              }, scaler);
            }, 200);
          }
        }, 500);
        icon.onpointerup = () => {
          if (interval === 0) {
            this._stepValue(dir);
          }
          release();
        };
      }
    };
    return icon;
  }

  /**This steps the slider value in the given direction*/
  protected _stepValue(dir: boolean): boolean | void {
    if (this._step === 0) {
      if (this._decimals === 0) {
        var step = Math.max(1, Math.floor(Math.abs(this._value || 0) / 150));
      } else {
        var step = Math.max(
          1 / this._decimals,
          Math.floor(Math.abs(this._value || 0) / 150)
        );
      }
    } else if (this._stepFunc) {
      var step = this._stepFunc(this._value || 0);
    } else {
      var step = this._step;
    }
    if (dir) {
      return this._setValueValidate((this._value || 0) + step, true);
    } else {
      return this._setValueValidate((this._value || 0) - step, true);
    }
  }
}

//     _____      _           _               ____
//    / ____|    | |         | |             |  _ \
//   | (___   ___| | ___  ___| |_ ___  _ __  | |_) | __ _ ___  ___
//    \___ \ / _ \ |/ _ \/ __| __/ _ \| '__| |  _ < / _` / __|/ _ \
//    ____) |  __/ |  __/ (__| || (_) | |    | |_) | (_| \__ \  __/
//   |_____/ \___|_|\___|\___|\__\___/|_|    |____/ \__,_|___/\___|

export interface FormSelectorOption<T> {
  /**Value to set when option is selected*/
  value: T;
  /**Text for selection*/
  text: string;
  /**Longer text shown as tooltip*/
  details?: string;
  /**icon to display for option*/
  icon?: () => SVGSVGElement;
}

export interface FormSelectorBaseOptions<T> extends FormBaseWriteOptions<T> {
  /**Options for selector*/
  selections?: StateROrValue<FormSelectorOption<T>[]>;
  /**Options using state enum */
  enum?: T extends string ? StateROrValue<StateEnumHelperList> : undefined;
}

export interface FormSelectionBase<T> {
  index: number;
  selection: FormSelectorOption<T>;
}

/**Base for number elements elements*/
export abstract class FormSelectorBase<
  T,
  S extends FormSelectionBase<T>
> extends FormBaseWrite<T> {
  protected _selectionValues: T[] = [];
  protected _selections: S[] = [];
  protected _selection: S | undefined;

  constructor(options: FormSelectorBaseOptions<T>) {
    super(options);
  }

  /**Sets the selection options for the selector */
  set selections(selections: FormSelectorOption<T>[] | undefined) {
    this._selectionValues = [];
    this._selections = [];
    this._clearSelections();
    if (selections)
      for (let i = 0; i < selections.length; i++) {
        const selection = selections[i];
        if (selection) {
          this._selectionValues[i] = selections[i].value;
          this._selections[i] = this._addSelection(selections[i], i);
        }
      }
  }

  /**Gets the selection options for the selector */
  get selections() {
    let selections: FormSelectorOption<T>[] = [];
    for (let i = 0; i < this._selections.length; i++) {
      const { text, details, value, icon } = this._selections[i].selection;
      selections.push(
        icon ? { text, value, details, icon } : { text, value, details }
      );
    }
    return selections;
  }

  /**Sets the selection options for the selector */
  set enum(
    enums: T extends string
      ? StateROrValue<StateEnumHelperList>
      : undefined | undefined
  ) {
    this._selectionValues = [];
    this._selections = [];
    this._clearSelections();
    if (enums) {
      let i = 0;
      for (const key in enums) {
        const selection = enums![
          key
        ] as StateEnumHelperList[keyof StateEnumHelperList];
        this._selectionValues[i] = key as any as T;
        this._selections[i] = this._addSelection(
          {
            text: selection.name,
            details: selection.description,
            value: key as any as T,
            icon: selection.icon,
          },
          i++
        );
      }
    }
  }

  /**Clears all selections from the element */
  protected abstract _clearSelections(): void;
  /**Add a selection to the element */
  protected abstract _addSelection(
    selection: FormSelectorOption<T>,
    index: number
  ): S;
  /**Sets which selection is active*/
  protected abstract _setSelection(selection: S): void;
  /**Clears any active selection*/
  protected abstract _clearSelection(selection: S): void;
  /**Set a selection to focused*/
  protected abstract _focusSelection(selection: S): void;

  /**Selects the previous or next selection in the element
   * @param dir false is next true is previous*/
  protected _selectAdjacent(dir: boolean) {
    if (dir) {
      let index = this._selection?.index ?? -1;
      if (index < this._selections.length - 1) {
        this._valueSet(this._selectionValues[index + 1]);
        this._focusSelection(this._selections[index + 1]);
      }
    } else {
      let index = this._selection?.index ?? this._selections.length - 1;
      if (index > 0) {
        this._valueSet(this._selectionValues[index - 1]);
        this._focusSelection(this._selections[index - 1]);
      }
    }
  }

  /**Called when value is changed */
  protected _valueUpdate(value: T) {
    if (this._selection) {
      this._clearSelection(this._selection);
      this._selection = undefined;
    }
    let index = this._selectionValues.indexOf(value);
    if (index !== -1) {
      this._setSelection(this._selections[index]);
      this._selection = this._selections[index];
    }
  }
  /**Called when value cleared */
  protected _valueClear() {
    if (this._selection) {
      this._clearSelection(this._selection);
    }
  }
}
