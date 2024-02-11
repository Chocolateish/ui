import { Result } from "./index";
import { ResultBase } from "./base";
import { OptionSome, OptionNone } from "./option";

export class ResultOk<T> implements ResultBase<T, never> {
    readonly value: T

    constructor(value: T) {
        this.value = value;
    }
    get ok(): true {
        return true
    }
    get err(): false {
        return false
    }

    expect(): T {
        return this.value
    }

    expectErr(msg: string): never {
        throw new Error(msg);
    }

    get unwrap(): T {
        return this.value
    }

    unwrapOr(): T {
        return this.value
    }

    andThen<T2>(mapper: (value: T) => ResultOk<T2>): ResultOk<T2>;
    andThen<E2>(mapper: (value: T) => ResultErr<E2>): ResultErr<E2>;
    andThen<T2, E2>(mapper: (value: T) => Result<T2, E2>): Result<T2, E2>;
    andThen<T2, E2>(mapper: (value: T) => Result<T2, E2>) {
        return mapper(this.value);
    }

    orElse(): ResultOk<T> {
        return this;
    }

    map<U>(func: (value: T) => U): ResultOk<U> {
        return new ResultOk(func(this.value));
    }

    mapErr(): ResultOk<T> {
        return this
    }

    get toOptional(): OptionSome<T> {
        return new OptionSome(this.value);
    }

    /**Returns the contained valid value, but never throws.
     * Unlike `unwrap()`, this method doesn't throw and is only callable on an Ok<T>
     * Therefore, it can be used instead of `unwrap()` as a maintainability safeguard
     * that will fail to compile if the error type of the Result is later changed to an error that can actually occur.*/
    safeUnwrap(): T {
        return this.value
    }
}

export class ResultErr<E> implements ResultBase<never, E> {
    readonly error: E
    #stack: string | undefined = new Error().stack;

    constructor(error: E) {
        this.error = error;
    }

    get valid(): false {
        return false
    }
    get ok(): false {
        return false
    }
    get err(): true {
        return true
    }

    expect(msg: string): never {
        throw new Error(msg + '\nOriginal ' + this.#stack + '\nExpect Error');
    }

    expectErr(): E {
        return this.error
    }

    get unwrap(): never {
        throw new Error('Tried to unwrap Error\nOriginal ' + this.#stack + '\nUnwrap Error');
    }

    unwrapOr<T2>(val: T2): T2 {
        return val
    }

    andThen(): ResultErr<E> {
        return this;
    }

    orElse<T2>(mapper: (error: E) => ResultOk<T2>): ResultOk<T2>;
    orElse<E2>(mapper: (error: E) => ResultErr<E2>): ResultErr<E2>;
    orElse<T2, E2>(mapper: (error: E) => Result<T2, E2>): Result<T2, E2>;
    orElse<T2, E2>(mapper: (error: E) => Result<T2, E2>) {
        return mapper(this.error);
    }

    map(): ResultErr<E> {
        return this
    }

    mapErr<F>(mapper: (error: E) => F): ResultErr<F> {
        return new ResultErr(mapper(this.error));
    }

    get toOptional(): OptionNone {
        return new OptionNone();
    }

    /**Returns the stored stack string to the error*/
    get stack(): string | undefined {
        return this.#stack;
    }
}

