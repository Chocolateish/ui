import { OptionSome, OptionNone } from "./option";
import { ResultOk, ResultErr } from "./result";
export { ResultOk, ResultErr } from "./result";
export { OptionSome, OptionNone } from "./option";

export type Result<T, E = T> = ResultOk<T> | ResultErr<E>;
export type ResultAsync<T, E = T> = Promise<Result<T, E>>;
export type Option<T> = OptionSome<T> | OptionNone;
export type OptionAsync<T> = Promise<Option<T>>;

export function Ok<T>(value: T) {
  return new ResultOk<T>(value);
}
export function Err<E>(error: E) {
  return new ResultErr<E>(error);
}
export function Some<T>(value: T) {
  return new OptionSome<T>(value);
}
export function None() {
  return new OptionNone();
}
