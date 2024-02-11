import { describe, it, expect } from '@jest/globals';
import { radiansTodegrees } from "../../../src/index";

describe('Radians To Degrees', function () {
    it("0 Radians", function () {
        expect(radiansTodegrees(0)).toStrictEqual(0);
    });
    it("66 Radians", function () {
        expect(radiansTodegrees(66)).toStrictEqual(3781.5214478634334);
    });
    it("666 Radians", function () {
        expect(radiansTodegrees(666)).toStrictEqual(38158.98915571283);
    });
    it("6666 Radians", function () {
        expect(radiansTodegrees(6666)).toStrictEqual(381933.66623420676);
    });
    it("-66 Radians", function () {
        expect(radiansTodegrees(-66)).toStrictEqual(-3781.5214478634334);
    });
});