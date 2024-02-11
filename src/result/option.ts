import { Option } from "./index";
import { ResultOk, ResultErr } from "./result";
import { OptionBase } from "./base";

export class OptionSome<T> implements OptionBase<T> {
    readonly value: T

    constructor(value: T) {
        this.value = value;
    }
    get valid(): true {
        return true
    }
    get some(): true {
        return true
    }
    get none(): false {
        return false
    }

    expect(): T {
        return this.value;
    }

    get unwrap(): T {
        return this.value;
    }

    unwrapOr(): T {
        return this.value;
    }

    andThen<T2>(mapper: (value: T) => OptionSome<T2>): OptionSome<T2>;
    andThen(mapper: (value: T) => OptionNone): OptionNone;
    andThen<T2>(mapper: (value: T) => Option<T2>): Option<T2>;
    andThen<T2>(mapper: (value: T) => Option<T2>) {
        return mapper(this.value);
    }

    orElse(): OptionSome<T> {
        return this;
    }

    map<U>(mapper: (value: T) => U): OptionSome<U> {
        return new OptionSome(mapper(this.value))
    }

    toResult(): ResultOk<T> {
        return new ResultOk(this.value)
    }
}

export class OptionNone implements OptionBase<never> {
    get valid(): false {
        return false
    }
    get some(): false {
        return false
    }
    get none(): true {
        return true
    }

    expect(msg: string): never {
        throw new Error(msg);
    }

    get unwrap(): never {
        throw new Error(`Tried to unwrap None`);
    }

    unwrapOr<T2>(val: T2): T2 {
        return val
    }

    andThen(): OptionNone {
        return this;
    }

    orElse<T2>(mapper: () => OptionSome<T2>): OptionSome<T2>;
    orElse(mapper: () => OptionNone): OptionNone;
    orElse<T2>(mapper: () => Option<T2>): Option<T2>;
    orElse<T2>(mapper: () => Option<T2>) {
        return mapper();
    }

    map(): OptionNone {
        return this;
    }

    toResult<E>(error: E): ResultErr<E> {
        return new ResultErr(error)
    }
}
