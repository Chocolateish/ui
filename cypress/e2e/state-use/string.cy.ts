/// <reference types="cypress" />
import { Ok } from "@src/result";
import { State } from "@src/state";
import { StateConcat } from "@src/state-use";

describe("Helper derived states", function () {
  it("Concat", async function () {
    let state1 = new State(Ok("1"));
    let state2 = new State(Ok("2"));
    let state3 = new State(Ok("3"));
    let state4 = new State(Ok("4"));
    let derived = new StateConcat(state1, state2, state3);
    expect((await derived).unwrap).equal("123");
    derived.setStates(state1, state2, state3, state4);
    expect((await derived).unwrap).equal("1234");
    state4.set(Ok("5"));
    expect((await derived).unwrap).equal("1235");
  });
  it("Concat with different strings", async function () {
    let state1 = new State(Ok("Hello"));
    let state2 = new State(Ok(" "));
    let state3 = new State(Ok("World"));
    let derived = new StateConcat(state1, state2, state3);
    expect((await derived).unwrap).equal("Hello World");
  });
  it("Should concatenate numbers and booleans correctly", async function () {
    let state1 = new State(Ok(1));
    let state2 = new State(Ok(true));
    let state3 = new State(Ok(2));
    let derived = new StateConcat(state1, state2, state3);
    expect((await derived).unwrap).equal("1true2");
  });
});
