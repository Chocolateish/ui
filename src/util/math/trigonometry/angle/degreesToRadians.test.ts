import { describe, it, expect } from '@jest/globals';
import { degreesToRadians } from "../../../src/index";

describe('Degrees To Radians', function () {
    it("0 Degree", function () {
        expect(degreesToRadians(0)).toStrictEqual(0);
    });
    it("66 Degree", function () {
        expect(degreesToRadians(66)).toStrictEqual(1.1519173063162575);
    });
    it("666 Degree", function () {
        expect(degreesToRadians(666)).toStrictEqual(11.623892818282235);
    });
    it("6666 Degree", function () {
        expect(degreesToRadians(6666)).toStrictEqual(116.34364793794201);
    });
    it("-66 Degree", function () {
        expect(degreesToRadians(-66)).toStrictEqual(-1.1519173063162575);
    });
});