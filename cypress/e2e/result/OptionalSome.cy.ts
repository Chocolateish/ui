/// <reference types="cypress" />
import { None, Some } from "../../src"

describe('Some', function () {
    it('Value from Some', function () {
        let result = Some(42);
        expect(result.value).equal(42);
    });
    it('Valid from Some', function () {
        let result = Some(42);
        expect(result.valid).equal(true);
    });
    it('Some from Some', function () {
        let result = Some(42);
        expect(result.some).equal(true);
    });
    it('None from Some', function () {
        let result = Some(42);
        expect(result.none).equal(false);
    });
    it('Expect value from Some', function () {
        let result = Some(42);
        expect(result.expect()).equal(42);
    });
    it('Unwrap value from Some', function () {
        let result = Some(42);
        expect(result.unwrap).equal(42);
    });
    it('UnwrapOr value from Some', function () {
        let result = Some(42);
        expect(result.unwrapOr()).equal(42);
    });
    it('andThen from Some returning Some', function () {
        let result = Some(42);
        expect(result.andThen((val) => {
            expect(val).equal(42);
            return Some('42')
        }).expect()).equal('42');
    });
    it('andThen from Some returning error result', function () {
        let result = Some(42);
        expect(result.andThen((val) => {
            expect(val).equal(42);
            return None()
        }).none).equal(true);
    });
    it('orElse from Some', function () {
        let result = Some(42);
        expect(result.orElse().expect()).equal(42);
    });
    it('map from Some', function () {
        let result = Some(42);
        expect(result.map((val) => {
            expect(val).equal(42);
            return '42'
        }).expect()).equal('42');
    });
    it('toResult from Some', function () {
        let result = Some(42);
        expect(result.toResult().expect()).equal(42);
    });
});