import { radiansTodegrees } from "@chocolatelib/math";
import { Value } from "@chocolatelib/value";
import { index2 } from "./test/index2";

export let index = 'test';

export * from "./test/index2";

export let index55 = () => {
    return 'aaa' + index2();
}

export let index4 = radiansTodegrees(59);

export let index5 = new Value('aa');