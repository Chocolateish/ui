import { Ok } from "@src/result";
import { StateDerived, StateResult } from "@src/state";

/* The `StateMin` class is a specialized type of `StateDerived` that represents the minimum of multiple `State` instances.
 * It takes multiple `State` instances as input and automatically updates its value whenever any of the input states change.
 * The value of a `StateMin` instance is the minimum of the values of the input states.*/
export class StateMin extends StateDerived<number[], number> {
  protected getter(values: Array<StateResult<number>>): StateResult<number> {
    return Ok(
      Math.min(
        ...values.map((value) => {
          if (value.ok) return value.value;
          else return Infinity;
        })
      )
    );
  }
}

/* The `StateMax` class is a specialized type of `StateDerived` that represents the maximum of multiple `State` instances.
 * It takes multiple `State` instances as input and automatically updates its value whenever any of the input states change.
 * The value of a `StateMax` instance is the maximum of the values of the input states.*/
export class StateMax extends StateDerived<number[], number> {
  protected getter(values: Array<StateResult<number>>): StateResult<number> {
    return Ok(
      Math.max(
        ...values.map((value) => {
          if (value.ok) return value.value;
          else return -Infinity;
        })
      )
    );
  }
}

/** The `StateAverage` class is a specialized type of `StateDerived` that represents the average of multiple `State` instances.
 * It takes multiple `State` instances as input and automatically updates its value whenever any of the input states change.
 * The value of a `StateAverage` instance is the average of the values of the input states.*/
export class StateAverage extends StateDerived<number[], number> {
  protected getter(values: Array<StateResult<number>>): StateResult<number> {
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
      let value = values[i];
      if (value.ok) sum += value.value;
      else return value;
    }
    return Ok(sum / values.length);
  }
}

/** The `StateSummer` class is a specialized type of `StateDerived` that represents the sum of multiple `State` instances.
 * It takes multiple `State` instances as input and automatically updates its value whenever any of the input states change.
 * The value of a `StateSummer` instance is the sum of the values of the input states.*/
export class StateSummer extends StateDerived<number[], number> {
  protected getter(values: Array<StateResult<number>>): StateResult<number> {
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
      let value = values[i];
      if (value.ok) sum += value.value;
      else return value;
    }
    return Ok(sum);
  }
}
