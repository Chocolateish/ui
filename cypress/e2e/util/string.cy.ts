/// <reference types="cypress" />
import { stringByteLength, stringByteLimit } from "@src/util/string";

describe("String", () => {
  it("String byte length", () => {
    expect(stringByteLength("")).to.equal(0);
  });
  it("String byte length", () => {
    expect(stringByteLength("")).to.equal(0);
  });

  it("String with ASCII characters", () => {
    expect(stringByteLength("Hello, World!")).to.equal(13);
  });

  it("String with non-ASCII characters", () => {
    expect(stringByteLength("こんにちは")).to.equal(15);
  });

  it("String with special characters", () => {
    expect(stringByteLength("!@#$%^&*()_+")).to.equal(12);
  });

  it("String with emojis", () => {
    expect(stringByteLength("😊🌍")).to.equal(8);
  });
});

describe("String", () => {
  it("String byte limit - within limit", () => {
    const input = "Hello, World!";
    const limit = 13;
    expect(stringByteLimit(input, limit)).to.equal(input);
  });

  it("String byte limit - exceeding limit", () => {
    const input = "Hello, World!";
    const limit = 10;
    const expected = "Hello, Wor";
    expect(stringByteLimit(input, limit)).to.equal(expected);
  });

  it("String byte limit - empty string", () => {
    const input = "";
    const limit = 5;
    expect(stringByteLimit(input, limit)).to.equal(input);
  });

  it("String byte limit - non-ASCII characters", () => {
    const input = "こんにちは";
    const limit = 10;
    const expected = "こんに";
    expect(stringByteLimit(input, limit)).to.equal(expected);
  });
});
