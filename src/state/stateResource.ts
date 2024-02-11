import { Err, None, Option, Some } from "@chocolatelib/result";
import { StateBase } from "./stateBase";
import { StateResult, StateSubscriber, StateWriteAsync } from "./types";

/**State Resource
 * state for representing a remote resource
 *
 * Debounce and Timout
 * example if the debounce is set to 50 and timeout to 200
 * singleGet will not be called until 50 ms after the first await of the state
 * when singleGet returns a Result, it is returned to all awaiters then buffered for the period of the timeout
 * any awaiters within the timeout will get the buffer, after that it starts over
 *
 * Debounce and Retention
 * When a subscriber is added the debounce delay is added before setupConnection is called
 * likevise when the last subscriber unsubscribes the retention delay is added before teardownConnection is called
 * this can prevent unneeded calls if the user is switching around quickly between things referencing states */
export abstract class StateResource<R, W extends R = R>
  extends StateBase<R>
  implements StateWriteAsync<R, W>
{
  /**Stores the last time when buffer was valid*/
  #valid: number = 0;
  /**Is high while once fetching value*/
  #fetching: boolean = false;
  /**Buffer of last value*/
  #buffer: StateResult<R> | undefined;
  /**Promises for value*/
  #promises: ((value: StateResult<R>) => void)[] = [];
  /**Timeout for retention delay*/
  #retentionTimout: number = 0;
  /**Timeout for debounce delay*/
  #debounceTimout: number = 0;

  /**Debounce delaying one time value retrival*/
  abstract get debounce(): number;

  /**Timeout for validity of last buffered value*/
  abstract get timeout(): number;

  /**Retention delay before resource performs teardown of connection is performed*/
  abstract get retention(): number;

  /**Called if the state is awaited, returns the value once*/
  protected abstract singleGet(): Promise<StateResult<R>>;

  async then<TResult1 = R>(
    func: (value: StateResult<R>) => TResult1 | PromiseLike<TResult1>
  ): Promise<TResult1> {
    if (this.#valid >= Date.now()) {
      return func(this.#buffer!);
    } else if (this.#fetching)
      return func(
        await new Promise((a) => {
          this.#promises.push(a);
          console.log(this.#promises);
        })
      );
    else {
      this.#fetching = true;
      if (this.debounce > 0)
        await new Promise((a) => {
          setTimeout(a, this.debounce);
        });
      this.#buffer = await this.singleGet();
      this.#valid = Date.now() + this.timeout;
      for (let i = 0; i < this.#promises.length; i++)
        this.#promises[i](this.#buffer);
      this.#promises = [];
      this.#fetching = false;
      return func(this.#buffer);
    }
  }

  /**Called when state is subscribed to to setup connection to remote resource*/
  protected abstract setupConnection(
    update: (value: StateResult<R>) => void
  ): void;

  /**Called when state is no longer subscribed to to cleanup connection to remote resource*/
  protected abstract teardownConnection(): void;

  protected updateResource(value: StateResult<R>) {
    this.#buffer = value;
    this.#valid = Date.now() + this.timeout;
    for (let i = 0; i < this.#promises.length; i++)
      this.#promises[i](this.#buffer);
    this.#promises = [];
    this.#fetching = false;
    this.updateSubscribers(value);
  }

  subscribe<B extends StateSubscriber<R>>(func: B, update?: boolean): B {
    if (this.subscribers.length === 0) {
      this.subscribers.push(func);
      if (this.#retentionTimout) {
        clearTimeout(this.#retentionTimout);
        this.#retentionTimout = 0;
      } else {
        this.#fetching = true;
        if (this.debounce > 0)
          this.#debounceTimout = setTimeout(() => {
            this.setupConnection(this.updateResource.bind(this));
            this.#debounceTimout = 0;
          }, this.debounce);
        else this.setupConnection(this.updateResource.bind(this));
      }
      return func;
    }
    return super.subscribe(func, update);
  }

  unsubscribe<B extends StateSubscriber<R>>(func: B): B {
    if (this.subscribers.length === 1) {
      if (this.#debounceTimout) {
        clearTimeout(this.#debounceTimout);
        this.#debounceTimout = 0;
      } else {
        if (this.retention > 0) {
          this.#retentionTimout = setTimeout(() => {
            this.teardownConnection();
            this.#retentionTimout = 0;
          }, this.retention);
        } else {
          this.teardownConnection();
        }
      }
    }
    return super.unsubscribe(func);
  }

  abstract write(value: W): void;

  check(_value: W): Option<string> {
    return None();
  }

  limit(value: W): Option<W> {
    return Some(value);
  }
}

/**Alternative state resource which can be initialized with functions */
export class StateResourceFunc<R, W extends R = R> extends StateResource<R, W> {
  /**Creates a state which connects to an async source and keeps updated with any changes to the source
   * @param once function called when state value is requested once, the function should throw if it fails to get data
   * @param setup function called when state is being used to setup live update of value
   * @param teardown function called when state is no longer being used to teardown/cleanup communication
   * @param setter function called when state value is set via setter, set true let state set it's own value
   * @param checker function to allow state users to check if a given value is valid for the state
   * @param limiter function to allow state users to limit a given value to state limit */
  constructor(
    once: () => Promise<StateResult<R>>,
    setup: (update: (value: StateResult<R>) => void) => void,
    teardown: () => void,
    debounce: number,
    timeout: number,
    retention: number,
    setter?: (value: W, state: StateResourceFunc<R, W>) => void,
    helper?: {
      limit?: (value: W) => Option<W>;
      check?: (value: W) => Option<string>;
      related?: () => Option<any>;
    }
  ) {
    super();
    this.singleGet = once;
    this.setupConnection = setup;
    this.teardownConnection = teardown;
    this.#debounce = debounce;
    this.#timeout = timeout;
    this.#retention = retention;
    if (setter) this.#setter = setter;
    if (helper) this.#helper = helper;
  }

  #setter: ((value: W, state: StateResourceFunc<R, W>) => void) | undefined;
  #debounce: number;
  #timeout: number;
  #retention: number;
  #helper:
    | {
        limit?: (value: W) => Option<W>;
        check?: (value: W) => Option<string>;
        related?: () => Option<any>;
      }
    | undefined;

  /**Debounce delaying one time value retrival*/
  get debounce(): number {
    return this.#debounce;
  }

  /**Timeout for validity of last buffered value*/
  get timeout(): number {
    return this.#timeout;
  }

  /**Retention delay before resource performs teardown of connection is performed*/
  get retention(): number {
    return this.#retention;
  }

  /**Called if the state is awaited, returns the value once*/
  protected async singleGet(): Promise<StateResult<R>> {
    return Err({ reason: "", code: "" });
  }

  /**Called when state is subscribed to to setup connection to remote resource*/
  protected setupConnection(_update: (value: StateResult<R>) => void): void {}

  /**Called when state is no longer subscribed to to cleanup connection to remote resource*/
  protected teardownConnection(): void {}

  write(value: W): void {
    if (this.#setter) this.#setter(value, this);
  }

  check(value: W): Option<string> {
    return this.#helper?.check ? this.#helper.check(value) : None();
  }

  limit(value: W): Option<W> {
    return this.#helper?.limit ? this.#helper.limit(value) : Some(value);
  }
}
