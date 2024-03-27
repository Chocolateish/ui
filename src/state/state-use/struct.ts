// import { Err, Ok } from "@src/result";
// import { StateDerived, StateRead, StateResult } from "@src/state";

// /** The `StateObjectKey` class is a specialized type of `StateDerived` that represents the value of a key of an object.
//  * It takes a `State` instance and a key as input and automatically updates its value whenever the input state changes.
//  * The value of a `StateObjectKey` instance is the value of the key of the input state's value.*/
// export class StateObjectKey<
//   T extends object,
//   K extends keyof T,
//   O = T[K]
// > extends StateDerived<T, O> {
//   /** Creates a new `StateObjectKey` instance.
//    * @param state The `State` instance to get the value from.
//    * @param key The key of the value to get.
//    * @param func An optional function to transform the value of the key.
//    * @returns A new `StateObjectKey` instance.*/
//   constructor(state: StateRead<T>, key: K, func?: (value: T[K]) => O) {
//     super(state);
//     this.#key = key;
//     if (func) this.#func = func;
//   }

//   #key: K;
//   #func?: (value: T[K]) => O;

//   protected getter(values: Array<StateResult<T>>): StateResult<O> {
//     if (values[0].ok)
//       if (this.#key in values[0].value)
//         if (this.#func) return Ok(this.#func(values[0].value[this.#key]));
//         else return Ok(values[0].value[this.#key] as O);
//       else
//         return Err({ reason: `Key ${String(this.#key)} not found in object` });
//     else return values[0];
//   }
// }
