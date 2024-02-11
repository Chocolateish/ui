/// <reference types="cypress" />
import * as svg from "../../src"

describe('Generates Primitives', () => {
  it('circle', function () {
    let circle = svg.circle(5, 6, 3);
    expect(circle.getAttribute('cx')).to.equal("5");
    expect(circle.getAttribute('cy')).to.equal("6");
    expect(circle.getAttribute('r')).to.equal("3");
  });
  it('ellipse', function () {
    let ellipse = svg.ellipse(5, 6, 3, 8);
    expect(ellipse.getAttribute('cx')).to.equal("5");
    expect(ellipse.getAttribute('cy')).to.equal("6");
    expect(ellipse.getAttribute('rx')).to.equal("3");
    expect(ellipse.getAttribute('ry')).to.equal("8");
  });
  it('group', function () {
    //let group = svg.group();
  });
  it('line', function () {
    let line = svg.line(5, 6, 3, 4);
    expect(line.getAttribute('x1')).to.equal("5");
    expect(line.getAttribute('y1')).to.equal("6");
    expect(line.getAttribute('x2')).to.equal("3");
    expect(line.getAttribute('y2')).to.equal("4");
  });
  it('path', function () {
    let path = svg.path('test');
    expect(path.getAttribute('d')).to.equal("test");
  });
  it('rectangle', function () {
    let rectangle1 = svg.rectangleFromCorner(5, 6, 3, 4, 1);
    expect(rectangle1.getAttribute('x')).to.equal("5");
    expect(rectangle1.getAttribute('y')).to.equal("6");
    expect(rectangle1.getAttribute('width')).to.equal("3");
    expect(rectangle1.getAttribute('height')).to.equal("4");
    expect(rectangle1.getAttribute('rx')).to.equal("1");
    let rectangle2 = svg.rectangleFromCenter(5, 6, 3, 4, 1);
    expect(rectangle2.getAttribute('x')).to.equal("3.5");
    expect(rectangle2.getAttribute('y')).to.equal("4");
    expect(rectangle2.getAttribute('width')).to.equal("3");
    expect(rectangle2.getAttribute('height')).to.equal("4");
    expect(rectangle2.getAttribute('rx')).to.equal("1");
  });
  it('svg', function () {
    let svg1 = svg.svg(100, 110, 'test');
    expect(svg1.getAttribute('width')).to.equal("100");
    expect(svg1.getAttribute('height')).to.equal("110");
    expect(svg1.getAttribute('viewBox')).to.equal("test");

    let svg2 = svg.svg(100, 110);
    expect(svg2.getAttribute('width')).to.equal("100");
    expect(svg2.getAttribute('height')).to.equal("110");
    expect(svg2.getAttribute('viewBox')).to.equal("0 0 100 110");
  });
  it('text', function () {
    let text = svg.text(5, 6, 'test', 6, svg.AnchorPoint.middleCenter);
    expect(text.getAttribute('x')).to.equal("5");
    expect(text.getAttribute('y')).to.equal("6");
    expect(text.innerHTML).to.equal("test");
    expect(text.getAttribute('font-size')).to.equal("6");
    expect(text.getAttribute('text-anchor')).to.equal("middle");
    expect(text.getAttribute('dominant-baseline')).to.equal("central");
    let text2 = svg.multiLineText(5, 6, 10, 11, 'test', 6, svg.AnchorPoint.middleCenter);
    expect(text2.getAttribute('x')).to.equal("5");
    expect(text2.getAttribute('y')).to.equal("6");
    expect(text2.getAttribute('width')).to.equal("10");
    expect(text2.getAttribute('height')).to.equal("11");
  });
  it('triangle', function () {
    let triangle = svg.isoscelesTriangle(5, 6, 3, 4);
    expect(triangle.getAttribute('d')).to.equal("M3.5,8 6.5,8 5,4Z");
  });
})