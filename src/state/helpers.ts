import { None, Option, Some } from "@chocolatelib/result";
import { StateHelper } from "./types";

export interface StateNumberHelperType {
  min?: number;
  max?: number;
  unit?: string;
  decimals?: number;
}

export class StateNumberHelper
  implements StateNumberHelperType, StateHelper<number, StateNumberHelperType>
{
  min: number | undefined;
  max: number | undefined;
  unit: string | undefined;
  decimals: number | undefined;
  step: number | undefined;
  start: number | undefined;
  /**Number limiter struct
   * @param min minimum allowed number
   * @param max maximum allowed number
   * @param step allowed step size for number 0.1 allows 0,0.1,0.2,0.3...
   * @param start start offset for step, 0.5 and step 2 allows 0.5,2.5,4.5,6.5*/
  constructor(
    min?: number,
    max?: number,
    unit?: string,
    decimals?: number,
    step?: number,
    start?: number
  ) {
    if (min !== undefined) this.min = min;
    if (max !== undefined) this.max = max;
    if (unit !== undefined) this.unit = unit;
    if (decimals !== undefined) {
      this.decimals = decimals;
      if (step !== undefined) this.step = step;
      if (start !== undefined) this.start = start;
    } else {
      if (step !== undefined) {
        this.step = step;
        const match = String(step).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
        this.decimals = match
          ? Math.max(
              0,
              (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0)
            )
          : 0;
        if (start !== undefined) {
          this.start = start;
          const match = String(start).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
          this.decimals = Math.max(
            this.decimals,
            match
              ? Math.max(
                  0,
                  (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0)
                )
              : 0
          );
        }
      }
    }
  }

  check(value: number): Option<string> {
    if ("max" in this && value > (this.max as number))
      return Some(value + " is bigger than the limit of " + this.max);
    if ("min" in this && value < (this.min as number))
      return Some(value + " is smaller than the limit of " + this.max);
    return None();
  }

  limit(value: number): Option<number> {
    if (this.step)
      if (this.start)
        value = parseFloat(
          (
            Math.round((value - this.start + Number.EPSILON) / this.step) *
              this.step +
            this.start
          ).toFixed(this.decimals)
        );
      else
        value = parseFloat(
          (
            Math.round((value + Number.EPSILON) / this.step) * this.step
          ).toFixed(this.decimals)
        );
    return Some(
      Math.min(this.max ?? Infinity, Math.max(this.min ?? -Infinity, value))
    );
  }

  related(): Option<StateNumberHelperType> {
    return Some(this as StateNumberHelperType);
  }
}

export interface StateStringHelperType {
  maxLength?: number;
  maxLengthBytes?: number;
}

export class StateStringHelper
  implements StateStringHelperType, StateHelper<string, StateStringHelperType>
{
  maxLength: number | undefined;
  maxLengthBytes: number | undefined;
  /**String limiter struct
   * @param maxLength max length for string
   * @param maxLengthBytes max byte length for string*/
  constructor(maxLength?: number, maxLengthBytes?: number) {
    if (maxLength !== undefined) this.maxLength = maxLength;
    if (maxLengthBytes !== undefined) this.maxLengthBytes = maxLengthBytes;
  }
  check(value: string): Option<string> {
    if ("maxLength" in this && value.length > <number>this.maxLength)
      return Some(
        "the text is longer than the limit of " + this.maxLength + " characters"
      );
    if (
      "maxLengthBytes" in this &&
      new TextEncoder().encode(value).length > <number>this.maxLengthBytes
    )
      return Some(
        "the text is longer than the limit of " + this.maxLengthBytes + " bytes"
      );
    return None();
  }
  limit(value: string): Option<string> {
    if (this.maxLength && value.length > this.maxLength)
      value = value.slice(0, this.maxLength);
    if (this.maxLengthBytes) {
      value = new TextDecoder().decode(
        new TextEncoder().encode(value).slice(0, this.maxLengthBytes)
      );
      if (value.at(-1)?.charCodeAt(0) === 65533) value = value.slice(0, -1);
    }
    return Some(value);
  }
  related(): Option<StateStringHelperType> {
    return Some(this as StateStringHelperType);
  }
}

export type StateEnumHelperList = {
  [key: string | number | symbol]: {
    name: string;
    description?: string;
    icon?: () => SVGSVGElement;
  };
};

export interface StateEnumHelperType<T extends StateEnumHelperList> {
  list: T;
}
export interface StateEnumHelperAnyType {
  list?: { [key: string | number | symbol]: { name: string } };
}

export class StateEnumHelper<
  K extends string | number | symbol,
  T extends StateEnumHelperList
> implements StateEnumHelperType<T>, StateHelper<K, StateEnumHelperType<T>>
{
  list: T;

  constructor(list: T) {
    this.list = list;
  }

  check(value: K): Option<string> {
    if (value in this.list) return None();
    return Some(String(value) + " is not in list");
  }

  limit(value: K): Option<K> {
    return Some(value);
  }

  related(): Option<StateEnumHelperType<T>> {
    return Some(this as StateEnumHelperType<T>);
  }
}
