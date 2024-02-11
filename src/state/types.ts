import { Option, Result } from "@chocolatelib/result";

/**Shorthand for state result*/
export type StateResult<R> = Result<R, StateError>;

/**Function used to subscribe to state changes */
export type StateSubscriber<R> = (value: StateResult<R>) => void;

/**Struct returned when a state errors*/
export type StateError = {
  /**Description of the reason for the error*/
  reason: string;
};

export type StateHelper<W, L extends StateRelated = {}> = {
  limit?: (value: W) => Option<W>;
  check?: (value: W) => Option<string>;
  related?: () => Option<L>;
};

//    _____  ______          _____  ______ _____     _____ ____  _   _ _______ ________   _________
//   |  __ \|  ____|   /\   |  __ \|  ____|  __ \   / ____/ __ \| \ | |__   __|  ____\ \ / /__   __|
//   | |__) | |__     /  \  | |  | | |__  | |__) | | |   | |  | |  \| |  | |  | |__   \ V /   | |
//   |  _  /|  __|   / /\ \ | |  | |  __| |  _  /  | |   | |  | | . ` |  | |  |  __|   > <    | |
//   | | \ \| |____ / ____ \| |__| | |____| | \ \  | |___| |__| | |\  |  | |  | |____ / . \   | |
//   |_|  \_\______/_/    \_\_____/|______|_|  \_\  \_____\____/|_| \_|  |_|  |______/_/ \_\  |_|
/**Map of states related to a state */
export type StateRelated = {
  [key: string | symbol | number]: any;
};

export interface StateReadAsync<R, L extends StateRelated = {}> {
  /**Allows getting value of state*/
  then<TResult1 = R>(
    func: (value: StateResult<R>) => TResult1 | PromiseLike<TResult1>
  ): PromiseLike<TResult1>;
  /**This adds a function as a subscriber to the state
   * @param update set true to update subscriber*/
  subscribe<B extends StateSubscriber<R>>(func: B, update?: boolean): B;
  /**This removes a function as a subscriber to the state*/
  unsubscribe<B extends StateSubscriber<R>>(func: B): B;
  /**Returns a map of related states to this state*/
  related(): Option<L>;
}
export interface StateRead<R, L extends StateRelated = {}>
  extends StateReadAsync<R, L> {
  /**Gets the value of the state, only available for sync state*/
  get(): StateResult<R>;
}

//   __          _______  _____ _______ ______ _____     _____ ____  _   _ _______ ________   _________
//   \ \        / /  __ \|_   _|__   __|  ____|  __ \   / ____/ __ \| \ | |__   __|  ____\ \ / /__   __|
//    \ \  /\  / /| |__) | | |    | |  | |__  | |__) | | |   | |  | |  \| |  | |  | |__   \ V /   | |
//     \ \/  \/ / |  _  /  | |    | |  |  __| |  _  /  | |   | |  | | . ` |  | |  |  __|   > <    | |
//      \  /\  /  | | \ \ _| |_   | |  | |____| | \ \  | |___| |__| | |\  |  | |  | |____ / . \   | |
//       \/  \/   |_|  \_\_____|  |_|  |______|_|  \_\  \_____\____/|_| \_|  |_|  |______/_/ \_\  |_|
export interface StateWriteAsync<R, W = R, L extends StateRelated = {}>
  extends StateReadAsync<R, L> {
  /** This sets the value of the state and updates all subscribers */
  write(value: W): void;
  /**Limits given value to valid range if possible returns None if not possible */
  limit: (value: W) => Option<W>;
  /**Checks if the value is valid and returns reason for invalidity */
  check: (value: W) => Option<string>;
}
export interface StateWrite<R, W = R, L extends StateRelated = {}>
  extends StateRead<R, L>,
    StateWriteAsync<R, W, L> {}
