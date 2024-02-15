/// <reference types="cypress" />
import { Ok } from "@src/result";
import { State } from "@src/state";
// import { StateConcat, StateObjectKey } from "../../src";

// describe("StateObjectKey", () => {
//   it("should set and get value correctly", async () => {
//     const state = new State(Ok({ a: "a", b: "b" }));
//     const key = new StateObjectKey(state, "a");
//     expect((await key).unwrap).to.equal("a");
//   });

//   it("should return err if key does not exist", async () => {
//     const state = new State<{ [s: string]: string }>(Ok({ a: "a", b: "b" }));
//     const key = new StateObjectKey(state, "c");
//     expect((await key).err).to.be.true;
//   });
// });
