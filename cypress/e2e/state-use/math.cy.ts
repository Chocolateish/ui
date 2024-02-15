/// <reference types="cypress" />
import { Ok } from "@src/result";
import { State } from "@src/state";
import { StateAverage, StateMax, StateMin, StateSummer } from "@src/state-use";

describe("Average State", function () {
  it("Average", async function () {
    let state1 = new State(Ok(1));
    let state2 = new State(Ok(2));
    let state3 = new State(Ok(3));
    let state4 = new State(Ok(4));
    let derived = new StateAverage(state1, state2, state3);
    expect((await derived).unwrap).equal(2);
    derived.setStates(state1, state2, state3, state4);
    expect((await derived).unwrap).equal(2.5);
  });
  it("Average with negative numbers", async function () {
    let state1 = new State(Ok(-1));
    let state2 = new State(Ok(-2));
    let state3 = new State(Ok(-3));
    let derived = new StateAverage(state1, state2, state3);
    expect((await derived).unwrap).equal(-2);
  });
});
describe("Summer State", function () {
  it("Sum", async function () {
    let state1 = new State(Ok(1));
    let state2 = new State(Ok(2));
    let state3 = new State(Ok(3));
    let state4 = new State(Ok(4));
    let derived = new StateSummer(state1, state2, state3);
    expect((await derived).unwrap).equal(6);
    derived.setStates(state1, state2, state3, state4);
    expect((await derived).unwrap).equal(10);
  });
  it("Sum with negative numbers", async function () {
    let state1 = new State(Ok(-1));
    let state2 = new State(Ok(-2));
    let state3 = new State(Ok(-3));
    let derived = new StateSummer(state1, state2, state3);
    expect((await derived).unwrap).equal(-6);
  });
  it("Sum with mixed numbers", async function () {
    let state1 = new State(Ok(-1));
    let state2 = new State(Ok(2));
    let state3 = new State(Ok(-3));
    let derived = new StateSummer(state1, state2, state3);
    expect((await derived).unwrap).equal(-2);
  });
});

describe("Minimum State", function () {
  it("Minimum", async function () {
    let state1 = new State(Ok(1));
    let state2 = new State(Ok(2));
    let state3 = new State(Ok(3));
    let state4 = new State(Ok(4));
    let derived = new StateMin(state1, state2, state3);
    expect((await derived).unwrap).equal(1);
    derived.setStates(state1, state2, state3, state4);
    expect((await derived).unwrap).equal(1);
  });
  it("Minimum with negative numbers", async function () {
    let state1 = new State(Ok(-1));
    let state2 = new State(Ok(-2));
    let state3 = new State(Ok(-3));
    let derived = new StateMin(state1, state2, state3);
    expect((await derived).unwrap).equal(-3);
  });
  it("Minimum with mixed numbers", async function () {
    let state1 = new State(Ok(-1));
    let state2 = new State(Ok(2));
    let state3 = new State(Ok(-3));
    let derived = new StateMin(state1, state2, state3);
    expect((await derived).unwrap).equal(-3);
  });
});
describe("Maximum State", function () {
  it("Maximum", async function () {
    let state1 = new State(Ok(1));
    let state2 = new State(Ok(2));
    let state3 = new State(Ok(3));
    let state4 = new State(Ok(4));
    let derived = new StateMax(state1, state2, state3);
    expect((await derived).unwrap).equal(3);
    derived.setStates(state1, state2, state3, state4);
    expect((await derived).unwrap).equal(4);
  });
  it("Maximum with negative numbers", async function () {
    let state1 = new State(Ok(-1));
    let state2 = new State(Ok(-2));
    let state3 = new State(Ok(-3));
    let derived = new StateMax(state1, state2, state3);
    expect((await derived).unwrap).equal(-1);
  });
  it("Maximum with mixed numbers", async function () {
    let state1 = new State(Ok(-1));
    let state2 = new State(Ok(2));
    let state3 = new State(Ok(-3));
    let derived = new StateMax(state1, state2, state3);
    expect((await derived).unwrap).equal(2);
  });
});
