/// <reference types="cypress" />
import { Err, Ok } from "@chocolatelib/result";
import { StateResourceFunc } from "../../src";

const generatePromises = (amount: number) => {
  let promises: Promise<any>[] = [];
  let fulfillments: ((value: any) => void)[] = [];
  for (let i = 0; i < amount; i++) {
    promises.push(
      new Promise<any>((a) => {
        fulfillments.push(a);
      })
    );
  }
  return {
    promise: new Promise(async (a) => {
      a(await Promise.all(promises));
    }),
    calls: fulfillments,
  };
};

describe("Getting state value", async function () {
  it("Async once fulfillment", async function () {
    let { promise, calls } = generatePromises(2);
    let state = new StateResourceFunc<number>(
      async () => {
        calls[0](0);
        return Ok(0);
      },
      () => {
        throw new Error("This should not be called");
      },
      () => {
        throw new Error("This should not be called");
      },
      50,
      50,
      50
    );
    state.then((val) => {
      if (val.ok) {
        calls[1](0);
      }
    });
    await promise;
  });
  it("Async once rejection", async function () {
    let { promise, calls } = generatePromises(2);
    let state = new StateResourceFunc<number>(
      async () => {
        calls[0](0);
        return Err({ code: "CL", reason: "Conn Lost" });
      },
      () => {
        throw new Error("This should not be called");
      },
      () => {
        throw new Error("This should not be called");
      },
      50,
      50,
      50
    );
    state.then((val) => {
      if (val.err) {
        calls[1](0);
      }
    });
    await promise;
  });
  it("Using then with chaining return", function (done) {
    let state = new StateResourceFunc<number>(
      async () => {
        return Ok(2);
      },
      () => {
        throw new Error("This should not be called");
      },
      () => {
        throw new Error("This should not be called");
      },
      50,
      50,
      50
    );
    state
      .then((val) => {
        expect(val.unwrap).equal(2);
        return 8;
      })
      .then((val) => {
        expect(val).equal(8);
        done();
      });
  });
  it("Using then with chaining throw", function (done) {
    let state = new StateResourceFunc<number>(
      async () => {
        return Ok(2);
      },
      () => {
        throw new Error("This should not be called");
      },
      () => {
        throw new Error("This should not be called");
      },
      50,
      50,
      50
    );
    state
      .then((val) => {
        expect(val.unwrap).equal(2);
        throw 8;
      })
      .then(
        () => {},
        (val) => {
          expect(val).equal(8);
          done();
        }
      );
  });
  it("Using then with async chaining return", function (done) {
    let state = new StateResourceFunc<number>(
      async () => {
        return Ok(2);
      },
      () => {
        throw new Error("This should not be called");
      },
      () => {
        throw new Error("This should not be called");
      },
      50,
      50,
      50
    );
    state
      .then(async (val) => {
        await new Promise((a) => {
          setTimeout(a, 10);
        });
        expect(val.unwrap).equal(2);
        return 8;
      })
      .then((val) => {
        expect(val).equal(8);
        done();
      });
  });
  it("Using then with async chaining throw", function (done) {
    let state = new StateResourceFunc<number>(
      async () => {
        return Ok(2);
      },
      () => {
        throw new Error("This should not be called");
      },
      () => {
        throw new Error("This should not be called");
      },
      50,
      50,
      50
    );
    state
      .then(async (val) => {
        await new Promise((a) => {
          setTimeout(a, 10);
        });
        expect(val.unwrap).equal(2);
        throw 8;
      })
      .then(
        () => {},
        (val) => {
          expect(val).equal(8);
          done();
        }
      );
  });
  it("Awaiting async value", async function () {
    let state = new StateResourceFunc<number>(
      async () => {
        return Ok(2);
      },
      () => {
        throw new Error("This should not be called");
      },
      () => {
        throw new Error("This should not be called");
      },
      50,
      50,
      50
    );
    expect((await state).unwrap).equal(2);
  });
});

describe("Async Setting value", function () {
  it("From user context with no setter function", async function (done) {
    let state = new StateResourceFunc<number>(
      async () => {
        return Ok(2);
      },
      () => {
        throw new Error("This should not be called");
      },
      () => {
        throw new Error("This should not be called");
      },
      50,
      50,
      50,
      () => {
        done();
      }
    );
    state.write(4);
  });
});

describe("Async subscribe", function () {
  it("Async subscribe", async function () {
    let { promise, calls } = generatePromises(3);
    let state = new StateResourceFunc<number>(
      async () => {
        throw new Error("This should not be called");
      },
      (update) => {
        calls[0](0);
        update(Ok(2));
      },
      () => {
        throw new Error("This should not be called");
      },
      50,
      50,
      50
    );
    state.subscribe(() => {
      calls[1](0);
    }, true);
    state.subscribe(() => {
      calls[2](0);
    }, true);
    await promise;
  });
  it("Async unsubscribe", async function () {
    let { promise, calls } = generatePromises(3);
    let state = new StateResourceFunc<number>(
      async () => {
        throw new Error("This should not be called");
      },
      (update) => {
        calls[0](0);
        update(Ok(2));
      },
      () => {
        calls[2](0);
      },
      50,
      50,
      50
    );
    let func = state.subscribe(() => {
      calls[1](0);
    }, true);
    await new Promise((a) => {
      setTimeout(a, 100);
    });
    state.unsubscribe(func);
    await promise;
  });
});
