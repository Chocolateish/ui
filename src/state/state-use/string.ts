import { Ok } from "@src/result";
import { StateDerived, StateResult } from "@src/state";

/** The `StateConcat` class is a specialized type of `StateDerived` that represents the concatenation of multiple `State` instances.
 * It takes multiple `State` instances as input and automatically updates its value whenever any of the input states change.
 * The value of a `StateConcat` instance is the concatenation of the values of the input states.*/
export class StateConcat extends StateDerived<
  (string | number | boolean)[],
  string
> {
  protected getter(
    values: Array<StateResult<string | number | boolean>>
  ): StateResult<string> {
    let sum = "";
    for (let i = 0; i < values.length; i++) {
      let value = values[i];
      if (value.ok) sum += value.value;
      else return value;
    }
    return Ok(sum);
  }
}
