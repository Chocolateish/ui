/// <reference types="cypress" />
import {
  boundingWidthAndHeightOfRotatedRectangle,
  degreesToRadians,
  linearise,
  md5,
  pointOnCircle,
  radiansTodegrees,
  sha1,
} from "@src/util/math";

describe("Linearisation", function () {
  it("Less than four values produce NaN", function () {
    expect(linearise(10, false)).to.not.equal(NaN);
    expect(linearise(10, false, 0)).to.not.equal(NaN);
    expect(linearise(10, false, 0, 100)).to.not.equal(NaN);
    expect(linearise(10, false, 0, 100, 0)).to.not.equal(NaN);
  });
  it("Simple two point linearisation", function () {
    expect(linearise(10, false, 0, 100, 0, 1000)).to.equal(100);
  });
  it("Simple two point linearisation with ends off and x outside range", function () {
    expect(linearise(200, false, 0, 100, 0, 1000)).to.equal(2000);
  });
  it("Simple two point linearisation with ends on and x outside range", function () {
    expect(linearise(200, true, 0, 100, 0, 1000)).to.equal(1000);
  });
  it("Simple three point linearisation", function () {
    expect(linearise(125, true, 0, 100, 150, 0, 1000, 4000)).to.equal(2500);
  });
  it("Simple four point linearisation", function () {
    expect(
      linearise(155, true, 0, 100, 150, 160, 0, 1000, 4000, 8000)
    ).to.equal(6000);
  });
});

describe("MD5", function () {
  it("abc", function () {
    expect(md5("abc").hexSmall).to.equal("900150983cd24fb0d6963f7d28e17f72");
  });
  it("", function () {
    expect(md5("").hexSmall).to.equal("d41d8cd98f00b204e9800998ecf8427e");
  });
  it("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq", function () {
    expect(
      md5("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq").hexSmall
    ).to.equal("8215ef0796a20bcaaae116d3876c664a");
  });
  it("abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu", function () {
    expect(
      md5(
        "abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu"
      ).hexSmall
    ).to.equal("03dd8807a93175fb062dfb55dc7d359c");
  });
  it("1 million a", function () {
    let text = "".padEnd(1000000, "a");
    expect(md5(text).hexSmall).to.equal("7707d6ae4e027c70eea2a935c2296f21");
  });

  it("Return array of numbers", function () {
    expect(
      md5("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq")
        .numberArray
    ).to.deep.equal([
      130, 21, 239, 7, 150, 162, 11, 202, 170, 225, 22, 211, 135, 108, 102, 74,
    ]);
  });
  it("Return uint8 array", function () {
    expect(
      md5("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq").uint8Array
    ).to.deep.equal(
      new Uint8Array([
        130, 21, 239, 7, 150, 162, 11, 202, 170, 225, 22, 211, 135, 108, 102,
        74,
      ])
    );
  });
  it("Return small letter hexadecimal", function () {
    expect(
      md5("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq").hexSmall
    ).to.equal("8215ef0796a20bcaaae116d3876c664a");
  });
  it("Return big letter hexadecimal", function () {
    expect(
      md5("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq").hexBig
    ).to.equal("8215EF0796A20BCAAAE116D3876C664A");
  });
});

describe("SHA1", function () {
  it("abc", function () {
    expect(sha1("abc").hexSmall).to.equal(
      "a9993e364706816aba3e25717850c26c9cd0d89d"
    );
  });
  it("", function () {
    expect(sha1("").hexSmall).to.equal(
      "da39a3ee5e6b4b0d3255bfef95601890afd80709"
    );
  });
  it("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq", function () {
    expect(
      sha1("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq").hexSmall
    ).to.equal("84983e441c3bd26ebaae4aa1f95129e5e54670f1");
  });
  it("abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu", function () {
    expect(
      sha1(
        "abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu"
      ).hexSmall
    ).to.equal("a49b2446a02c645bf419f995b67091253a04a259");
  });
  it("1 million a", function () {
    let text = "".padEnd(1000000, "a");
    expect(sha1(text).hexSmall).to.equal(
      "34aa973cd4c4daa4f61eeb2bdbad27316534016f"
    );
  });

  it("Return array of numbers", function () {
    expect(
      sha1("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq")
        .numberArray
    ).to.deep.equal([
      132, 152, 62, 68, 28, 59, 210, 110, 186, 174, 74, 161, 249, 81, 41, 229,
      229, 70, 112, 241,
    ]);
  });
  it("Return uint8 array", function () {
    expect(
      sha1("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq")
        .uint8Array
    ).to.deep.equal(
      new Uint8Array([
        132, 152, 62, 68, 28, 59, 210, 110, 186, 174, 74, 161, 249, 81, 41, 229,
        229, 70, 112, 241,
      ])
    );
  });
  it("Return small letter hexadecimal", function () {
    expect(
      sha1("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq").hexSmall
    ).to.equal("84983e441c3bd26ebaae4aa1f95129e5e54670f1");
  });
  it("Return big letter hexadecimal", function () {
    expect(
      sha1("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq").hexBig
    ).to.equal("84983E441C3BD26EBAAE4AA1F95129E5E54670F1");
  });
});

describe("Degrees To Radians", function () {
  it("0 Degree", function () {
    expect(degreesToRadians(0)).to.equal(0);
  });
  it("66 Degree", function () {
    expect(degreesToRadians(66)).to.equal(1.1519173063162575);
  });
  it("666 Degree", function () {
    expect(degreesToRadians(666)).to.equal(11.623892818282235);
  });
  it("6666 Degree", function () {
    expect(degreesToRadians(6666)).to.equal(116.34364793794201);
  });
  it("-66 Degree", function () {
    expect(degreesToRadians(-66)).to.equal(-1.1519173063162575);
  });
});

describe("Radians To Degrees", function () {
  it("0 Radians", function () {
    expect(radiansTodegrees(0)).to.equal(0);
  });
  it("66 Radians", function () {
    expect(radiansTodegrees(66)).to.equal(3781.5214478634334);
  });
  it("666 Radians", function () {
    expect(radiansTodegrees(666)).to.equal(38158.98915571283);
  });
  it("6666 Radians", function () {
    expect(radiansTodegrees(6666)).to.equal(381933.66623420676);
  });
  it("-66 Radians", function () {
    expect(radiansTodegrees(-66)).to.equal(-3781.5214478634334);
  });
});

describe("Point on circle", function () {
  it("x5 y5 radius 3 angle 0", function () {
    expect(pointOnCircle(5, 5, 3, degreesToRadians(0))).to.deep.equal({
      x: 8,
      y: 5,
    });
  });
  it("x5 y5 radius 3 angle 45", function () {
    expect(pointOnCircle(5, 5, 3, degreesToRadians(45))).to.deep.equal({
      x: 7.121320343559643,
      y: 7.121320343559642,
    });
  });
  it("x5 y5 radius 3 angle 90", function () {
    expect(pointOnCircle(5, 5, 3, degreesToRadians(90))).to.deep.equal({
      x: 5,
      y: 8,
    });
  });
  it("x5 y5 radius 3 angle 77", function () {
    expect(pointOnCircle(5, 5, 3, degreesToRadians(77))).to.deep.equal({
      x: 5.674853163031595,
      y: 7.923110194355706,
    });
  });
  it("x5 y5 radius 3 angle 230", function () {
    expect(pointOnCircle(5, 5, 3, degreesToRadians(230))).to.deep.equal({
      x: 3.071637170940382,
      y: 2.7018666706430663,
    });
  });
});

describe("Bounding Width And Hight Of Rotated Rectangle", function () {
  it("Width 100 Height 100 turned 45 Degree", function () {
    expect(
      boundingWidthAndHeightOfRotatedRectangle(100, 100, 45)
    ).to.deep.equal({ width: 137.62255133518482, height: 137.62255133518482 });
  });
  it("Width 100 Height 200 turned 45 Degree", function () {
    expect(
      boundingWidthAndHeightOfRotatedRectangle(100, 200, 45)
    ).to.deep.equal({ width: 222.71290378859663, height: 190.15475021695778 });
  });
  it("Width 200 Height 100 turned 45 Degree", function () {
    expect(
      boundingWidthAndHeightOfRotatedRectangle(200, 100, 45)
    ).to.deep.equal({ width: 190.15475021695778, height: 222.71290378859663 });
  });
  it("Width 100 Height 100 turned 80 Degree", function () {
    expect(
      boundingWidthAndHeightOfRotatedRectangle(100, 100, 80)
    ).to.deep.equal({ width: 110.42758977624229, height: 110.42758977624229 });
  });
  it("Width 100 Height 200 turned 80 Degree", function () {
    expect(
      boundingWidthAndHeightOfRotatedRectangle(100, 200, 80)
    ).to.deep.equal({ width: 209.8164551685798, height: 121.46631416014704 });
  });
  it("Width 200 Height 100 turned 80 Degree", function () {
    expect(
      boundingWidthAndHeightOfRotatedRectangle(200, 100, 80)
    ).to.deep.equal({ width: 121.46631416014704, height: 209.8164551685798 });
  });
});
