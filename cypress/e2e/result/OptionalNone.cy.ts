/// <reference types="cypress" />
import { None, Some } from "../../src"

describe('None', function () {
    it('Valid from None', function () {
        let result = None();
        expect(result.valid).equal(false);
    });
    it('Some from None', function () {
        let result = None();
        expect(result.some).equal(false);
    });
    it('None from None', function () {
        let result = None();
        expect(result.none).equal(true);
    });
    it('Expect value from None', function () {
        let result = None();
        expect(() => { result.expect('YOYO') }).to.throw();
    });
    it('Unwrap value from None', function () {
        let result = None();
        expect(() => { result.unwrap() }).to.throw();
    });
    it('UnwrapOr value from None', function () {
        let result = None();
        expect(result.unwrapOr(42)).equal(42);
    });
    it('andThen from None returning error result', function () {
        let result = None();
        expect(result.andThen().none).equal(true);
    });
    it('orElse from Some returning Some', function () {
        let result = None();
        expect(result.orElse(() => {
            return Some('42')
        }).expect()).equal('42');
    });
    it('orElse from Some returning error result', function () {
        let result = None();
        expect(result.orElse(() => {
            return None()
        }).none).equal(true);
    });
    it('map from None', function () {
        let result = None();
        expect(result.map()).equal(result);
    });
    it('toResult from None', function () {
        let result = None();
        expect(result.toResult('YOYO').err).equal(true);
    });
});