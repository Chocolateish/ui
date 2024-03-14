import "./input.scss";
import {
  FormBaseRead,
  FormBaseWrite,
  FormBaseWriteEvents,
  FormBaseWriteOptions,
} from "../base";
import { StateROrValue, crel, defineElement } from "@src/base";
import { StateWrite } from "@src/state";

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

type InputTypeMap = {
  [FormInputType.number]: number;
  [FormInputType.text]: string;
  [FormInputType.password]: string;
  [FormInputType.email]: string;
  [FormInputType.url]: string;
  [FormInputType.tel]: string;
  [FormInputType.color]: string;
  [FormInputType.date]: Date;
  [FormInputType.time]: Date;
  [FormInputType.datetime]: Date;
  [FormInputType.month]: Date;
  [FormInputType.week]: Date;
};

interface InputOptions<T extends FormInputType>
  extends FormBaseWriteOptions<InputTypeMap[T]> {
  /**Input type */
  type: T;
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

type StepFunc = (value: number) => number;

/**Base for number elements elements*/
export class FormInput<T extends FormInputType> extends FormBaseWrite<
  InputTypeMap[T]
> {
  static elementName() {
    return "input";
  }
  private _type: T;
  /**Element used to display validation warnings*/
  protected _validator: HTMLButtonElement = this._body.appendChild(
    crel("button")
  );
  protected _input: HTMLInputElement = this._body.appendChild(crel("input"));
  /**Minimum and maximum value for element */
  protected _min: number = -Infinity;
  protected _max: number = Infinity;
  protected _span: number = Infinity;
  /**Precision of input*/
  protected _step: number = 0;
  protected _stepFunc?: StepFunc;
  protected _decimals: number = 0;
  /**Unit of input*/
  protected _legend: HTMLSpanElement = this._body.appendChild(crel("span"));
  protected _minLegend: HTMLSpanElement = this._legend.appendChild(
    crel("span")
  );
  protected _maxLegend: HTMLSpanElement = this._legend.appendChild(
    crel("span")
  );
  protected _unit: HTMLSpanElement = this._body.appendChild(crel("span"));

  constructor(options: InputOptions<T>) {
    super(options);
    this._type = options.type;
    this._input.type = options.type;
    this._input.oninput = () => {
      switch (this._type) {
        case FormInputType.number:
          this._valueSet(this._input.valueAsNumber as InputTypeMap[T]);
          break;
      }
    };
    if (typeof options.step !== "undefined")
      this.attachStateToProp("step", options.step);
    if (typeof options.decimals !== "undefined")
      this.attachStateToProp("decimals", options.decimals);
    if (typeof options.min !== "undefined")
      this.attachStateToProp("min", options.min);
    if (typeof options.max !== "undefined")
      this.attachStateToProp("max", options.max);
    if (options.unit) this.attachStateToProp("unit", options.unit);
    if (options.value) this.attachStateToProp("value", options.value);
  }

  /**Called when value is changed */
  protected _valueUpdate(value: InputTypeMap[T]) {
    switch (this._type) {
      case FormInputType.number:
        this._input.valueAsNumber = value as number;
        break;
    }
    value;
  }
  /**Called when value cleared */
  protected _valueClear() {}

  /**Called to change value*/
  protected _valueSet(value: InputTypeMap[T]) {
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
      new CustomEvent<FormBaseWriteEvents<InputTypeMap[T]>["valueChangeUser"]>(
        "valueChangeUser",
        { detail: value }
      )
    );
  }

  /**Validates given value then sets it*/
  protected _setValueValidate(
    val: InputTypeMap[T],
    warn: boolean
  ): boolean | void {
    if (typeof this._writer === "object") {
      let reason = this._writer.check(val);
      let limit = this._writer.limit(val);
      if (reason.some) {
        this._warnValidator(reason.value, warn);
        this._valueSet(limit.some ? limit.value : val);
        return true;
      }
    }
    if (typeof val === "number") {
      if (val < this._min) {
        this._warnValidator(
          "Minimum value is " + this._min.toFixed(this._decimals),
          warn
        );
        this._valueSet(this._min as InputTypeMap[T]);
        return true;
      }
      if (val > this._max) {
        this._warnValidator(
          "Maximum value is " + this._max.toFixed(this._decimals),
          warn
        );
        this._valueSet(this._max as InputTypeMap[T]);
        return true;
      }
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

  /**Set the minimum value*/
  set min(min: number | undefined) {
    this._min = min ?? -Infinity;
    this._input.min = String(this._min);
    this._updateMinMax();
  }
  /**Gets the minimum value on the element*/
  get min() {
    return this._min;
  }

  /**Set the minimum value*/
  set max(max: number | undefined) {
    this._max = max ?? Infinity;
    this._input.max = String(this._max);
    this._updateMinMax();
  }
  /**Gets the maximum value on the element*/
  get max() {
    return this._max;
  }

  private _updateMinMax() {
    this._span = this._max - this._min;
    if (String(this._max).length > 5) {
      this._minLegend.textContent =
        this._min === -Infinity ? "" : "Min:" + this._min.toPrecision(5);
      this._maxLegend.textContent =
        this._max === Infinity ? "" : "Max:" + this._max.toPrecision(5);
    } else {
      this._minLegend.textContent =
        this._min === -Infinity
          ? ""
          : "Min:" + this._min.toFixed(this.decimals);
      this._maxLegend.textContent =
        this._max === Infinity ? "" : "Max:" + this._max.toFixed(this.decimals);
    }
  }

  /**Sets the amount of steps on the slider*/
  set step(step: number | undefined | ((value: number) => number)) {
    if (typeof step === "function") {
      this._stepFunc = step;
    } else {
      this._stepFunc = undefined;
      this._step = step ?? 0;
      this._input.step = String(this._step);
    }
  }
  /**Gets the amount of steps on the slider*/
  get step() {
    return this._step;
  }

  /**Gets the amount of decimals the element can have*/
  get decimals() {
    return this._decimals;
  }
  /**Sets the amount of decimals the element can have*/
  set decimals(dec: number | undefined) {
    this._decimals = Math.max(dec ?? 0, 0);
  }

  /**Sets the unit of the element*/
  set unit(unit: string | undefined) {
    this._unit.textContent = unit ?? "";
  }
  /**Returns the current unit value*/
  get unit(): string {
    return this._unit.textContent ?? "";
  }
}
defineElement(FormInput);

//IP Address input
// // if (!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/g.test(val)) {
// //     return 'Invalid IP Address';
// // }

// // case InputBoxTypes.IP: {
// //     let parts = val.split('.');
// //     console.log(parts, start, end);
// //     for (let i = 0; i < parts.length; i++) {
// //         let part = parseInt(parts[i]);
// //         if (i < parts.length - 1 || i == 3) {
// //             if (part > 255) {
// //                 parts[i] = 255;
// //                 continue;
// //             }
// //         } else {
// //             if (parts[i].length > 3 && i == parts.length - 1) {
// //                 parts[i + 1] = parts[i].substring(3);
// //                 parts[i] = parts[i].substring(0, 3);
// //                 continue;
// //             }
// //             if (part > 255) {
// //                 parts[i + 1] = parts[i].substring(2);
// //                 parts[i] = parts[i].substring(0, 2);
// //                 continue;
// //             }
// //         }
// //     }
// //     parts.length = Math.min(parts.length, 4);
// //     this.__input.value = parts.join('.');
// //     break;
// // }

// // case InputBoxTypes.IP:
// //     if (text.search(/[^\d\.]/g) !== -1) {
// //         ev.preventDefault();
// //         return text + ' is not valid for and IP address';
// //     }
// //     break;

// /**IP Address input*/
// export class IpInput extends InputBase<string> {
//     /**Returns the name used to define the element*/
//     static elementName() { return 'ipinput' }

//     constructor() {
//         super();
//         this._input.type = 'text';
//         this._input.oninput = () => {
//             let parts = (this._input.value).split('.');
//             for (let i = 0; i < parts.length; i++) {
//                 let part = parseInt(parts[i]);
//                 if (i < parts.length - 1 || i == 3) {
//                     if (part > 255) {
//                         parts[i] = String(255);
//                         continue;
//                     }
//                 } else {
//                     if (parts[i].length > 3 && i == parts.length - 1) {
//                         parts[i + 1] = parts[i].substring(3);
//                         parts[i] = parts[i].substring(0, 3);
//                         continue;
//                     }
//                     if (part > 255) {
//                         parts[i + 1] = parts[i].substring(2);
//                         parts[i] = parts[i].substring(0, 2);
//                         continue;
//                     }
//                 }
//             }
//             parts.length = Math.min(parts.length, 4);
//             this._input.value = parts.join('.');
//         }

//     }
// }
// defineElement(IpInput);

//Number Input
// /**Slide Selector, displays all options in a slider*/
// export class NumberInput extends NumberBase {
//     private _valueBox: HTMLSpanElement;
//     private _legend: HTMLSpanElement;

//     /**Returns the name used to define the element*/
//     static elementName() { return 'numberinput' }

//     constructor() {
//         super();
//         this._valueBox = this._body.appendChild(crel('span'));
//         this._valueBox.contentEditable = 'true';
//         this._valueBox.textContent = NoValueText;
//         this._body.appendChild(this._unit);
//         this._legend = this._body.appendChild(crel('span'));
//         this._legend.append(this._minLegend, this._maxLegend);
//         this._valueBox.onfocus = () => {
//             if (this._valueBox.textContent === NoValueText) {
//                 this._valueBox.textContent = '';
//             }
//         };
//         this._valueBox.onblur = async () => {
//             setTimeout(() => {
//                 this._setValueValidate(parseFloat(this._valueBox.textContent?.replace(',', '.') || '') || 0, true);
//             }, 0);
//         };
//         this._body.onclick = () => {
//             this._valueBox.focus();
//         };
//         this._body.onkeydown = (e) => {
//             if (e.key === 'Enter') {
//                 this._valueBox.blur();
//             }
//         };
//         this._body.onbeforeinput = (e) => {
//             switch (e.inputType) {
//                 case 'insertParagraph':
//                     e.preventDefault();
//                     break;
//             }
//             if (e.data) {
//                 if (!/[\d,.-]/g.test(e.data)) {
//                     e.preventDefault()
//                 } else if (/[,.]/g.test(e.data) && this._decimals === 0) {
//                     e.preventDefault()
//                 } else if (this._minUsr >= 0 && /-/g.test(e.data)) {
//                     e.preventDefault()
//                 }
//             }
//         };
//     }

//     /**Called when value is changed */
//     protected _valueUpdate(value: number) {
//         this._valueBox.textContent = value.toFixed(this._decimals);
//     }
//     /**Called when value cleared */
//     protected _valueClear() {
//         this._valueBox.textContent = NoValueText;
//     }
// }
// defineElement(NumberInput);

//Phone Input
// /**Color selector*/
// export class PhoneInput extends InputBase<string> {
//     /**Returns the name used to define the element*/
//     static elementName() { return 'phoneinput' }

//     constructor() {
//         super();
//         this._input.type = 'tel';
//         this._input.pattern = '[0-9]{3}-[0-9]{2}-[0-9]{3}';
//     }
// }
// defineElement(PhoneInput);

// Date INput
// export interface DateTimeInputOptions<T> extends FormBaseReadOptions<T> {
//   /**Type of date time*/
//   type?: DateTimeType;
//   mode?: DateTimeMode;
// }

// export const enum DateTimeType {
//   DATE = "date",
//   TIME = "time",
//   DATETIME = "datetime",
// }

// export const enum DateTimeMode {
//   DATE = "date",
//   STRING = "string",
//   NUMBER = "number",
// }

// /**Date Input*/
// export class DateTimeInput<
//   T extends Date | string | number
// > extends InputBase<T> {
//   private _type: DateTimeType = DateTimeType.DATETIME;
//   private _mode: DateTimeMode = DateTimeMode.DATE;

//   /**Returns the name used to define the element*/
//   static elementName() {
//     return "datetime";
//   }

//   constructor() {
//     super();
//     this._input.type = "datetime-local";
//     this._input.step = "1";
//     this._body.appendChild(material_action_calendar_month_rounded()).onclick =
//       () => {
//         this._input.showPicker();
//       };
//     this._body.appendChild(material_action_schedule_rounded()).onclick = () => {
//       this._input.showPicker();
//     };
//     this._input.onchange = () => {
//       if (this._input.value) {
//         switch (this._mode) {
//           case DateTimeMode.DATE:
//             this._valueSet(<any>new Date(this._input.valueAsNumber));
//             break;
//           case DateTimeMode.STRING:
//             this._valueSet(<any>this._input.value);
//             break;
//           case DateTimeMode.NUMBER:
//             this._valueSet(<any>this._input.valueAsNumber);
//             break;
//         }
//       }
//     };
//   }

//   /**Called when value is changed */
//   protected _valueUpdate(value: T) {
//     let time: number;
//     switch (typeof value) {
//       case "number":
//         time = value;
//         break;
//       case "string":
//         time = new Date(value).getTime();
//         break;
//       case "object":
//         time = value.getTime();
//         break;
//     }
//     switch (this._type) {
//       case DateTimeType.DATE:
//         this._input.valueAsNumber = time;
//         break;
//       case DateTimeType.TIME:
//         this._input.valueAsNumber = time;
//         break;
//       case DateTimeType.DATETIME:
//         this._input.valueAsNumber = time;
//         break;
//     }
//   }

//   /**Called when value cleared */
//   protected _valueClear() {
//     this._input.value = "";
//   }

//   /**Sets options for the element*/
//   options(options: DateTimeInputOptions<T>) {
//     if (options.type) {
//       this.type = options.type;
//     }
//     super.options(options);
//     if (options.mode) {
//       this.mode = options.mode;
//     }
//     return this;
//   }

//   /**Returns the date time type*/
//   get type() {
//     return this._type;
//   }

//   /**Sets the date time type*/
//   set type(type: DateTimeType) {
//     switch (type) {
//       case DateTimeType.DATE:
//         this._input.type = "date";
//         break;
//       case DateTimeType.TIME:
//         this._input.type = "time";
//         break;
//       case DateTimeType.DATETIME:
//         this._input.type = "datetime-local";
//         break;
//     }

//     this._type = type;
//   }

//   /**Returns the date time type*/
//   get mode() {
//     return this._mode;
//   }
//   /**Sets the date time type*/
//   set mode(mode: DateTimeMode) {
//     this._mode = mode;
//   }

//   /**Returns the date time type*/
//   get step() {
//     return Number(this._input.step);
//   }
//   /**Sets the date time type*/
//   set step(step: number) {
//     this._input.step = String(step);
//   }

//   /**Returns the date time type*/
//   get min() {
//     return Number(this._input.min);
//   }
//   /**Sets the date time type*/
//   set min(min: number) {
//     this._input.min = String(min);
//   }

//   /**Returns the date time type*/
//   get max() {
//     return Number(this._input.max);
//   }
//   /**Sets the date time type*/
//   set max(max: number) {
//     this._input.max = String(max);
//   }
// }
// defineElement(DateTimeInput);
