import { Option, Result } from "./index";
import { OptionSome, OptionNone } from "./option";
import { ResultOk, ResultErr } from "./result";

export interface ResultBase<T, E> {
    /**Is true when the result is valid and false when it is invalid*/
    readonly ok: boolean;
    /**Is false when the result is valid and true when it is invalid*/
    readonly err: boolean;
    /**The value for the result, only exists when it is valid*/
    readonly value?: T;
    /**The error for the result, only exists when it is invalid*/
    readonly error?: E;

    /**Returns the contained valid value, if exists. Throws an error if not.
     * @param msg the message to throw if the value is invalid.*/
    expect(msg: string): T;

    /**Returns the contained valid value, if does not exist. Throws an error if it does.
     * @param msg the message to throw if the value is valid.*/
    expectErr(msg: string): E;

    /**Returns the contained valid value.
     * Throws if the value is invalid, with a message provided by the error's value.*/
    get unwrap(): T;

    /**Returns the contained valid value or a provided default.*/
    unwrapOr<T2>(value: T2): T | T2;

    /**Calls mapper function if the result is valid, otherwise returns the error value of self.
     * This function can be used for control flow based on `Result` values.*/
    andThen<T2>(mapper: (value: T) => ResultOk<T2>): Result<T2, E>;
    andThen<E2>(mapper: (value: T) => ResultErr<E2>): Result<T, E2>;
    andThen<T2, E2>(mapper: (value: T) => Result<T2, E2>): Result<T2, E2>;

    /**Calls mapper function if the result is an error, otherwise returns the value self.
     * This function can be used for control flow based on `Result` values.*/
    orElse<T2>(mapper: (error: E) => ResultOk<T2>): Result<T2, E>;
    orElse<E2>(mapper: (error: E) => ResultErr<E2>): Result<T, E2>;
    orElse<T2, E2>(mapper: (error: E) => Result<T2, E2>): Result<T2, E2>;

    /**Maps a `Result<T, E>` to `Result<U, E>` by applying a function to a contained valid value, leaving an error value untouched.
     * This function can be used to compose the results of two functions.*/
    map<U>(mapper: (value: T) => U): Result<U, E>;

    /**Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained error value, leaving a valid value untouched.
     * This function can be used to pass through a successful result while handling an error.*/
    mapErr<F>(mapper: (error: E) => F): Result<T, F>

    /**Converts from `Result<T, E>` to `Optional<T>`, discarding the error if any*/
    get toOptional(): Option<T>;
}


export interface OptionBase<T> {
    /**Is true when a value is available*/
    readonly some: boolean;
    /**Is true when no value is available*/
    readonly none: boolean;
    /**The value*/
    readonly value?: T;

    /**Returns the contained value, if exists. Throws an error if not.
     * @param msg the message to throw if no value exists.*/
    expect(msg: string): T;

    /**Returns the contained value, if exists. Throws an error if not.*/
    get unwrap(): T;

    /**Returns the contained value or a provided default.
     * @param value value to use as default*/
    unwrapOr<T2>(value: T2): T | T2;

    /**Calls mapper if the Option is `Some`, otherwise returns `None`.
     * This function can be used for control flow based on `Optional` values.*/
    andThen<T2>(mapper: (value: T) => OptionSome<T2>): Option<T2>;
    andThen(mapper: (value: T) => OptionNone): Option<T>;
    andThen<T2>(mapper: (value: T) => Option<T2>): Option<T2>;

    /**Calls mapper if the Option is `None`, otherwise returns `Some`.
     * This function can be used for control flow based on `Optional` values.*/
    orElse<T2>(mapper: () => OptionSome<T2>): Option<T2>;
    orElse(mapper: () => OptionNone): Option<T>;
    orElse<T2>(mapper: () => Option<T2>): Option<T2>;

    /**Maps an `Optional<T>` to `Optional<U>` by applying a function to a contained `Some` value, leaving a `None` value untouched.
     * This function can be used to compose the Options of two functions.*/
    map<U>(mapper: (value: T) => U): Option<U>;

    /**Maps an `Optional<T>` to a `Result<T, E>`.*/
    toResult<E>(error: E): Result<T, E>;
}