/// <reference types="cypress" />
import { material_action_123_filled, material_action_123_outlined } from "../../src";

describe('Action', function () {
  it('drag_indicator', function () {
    let icon = material_action_123_filled()
    expect(icon).to.be.instanceOf(SVGElement);
    expect(icon.getAttribute('icon')).to.equal('material_action_123_filled');
  });
  it('accessible', function () {
    let icon = material_action_123_outlined()
    expect(icon).to.be.instanceOf(SVGElement);
    expect(icon.getAttribute('icon')).to.equal('material_action_123_outlined');
  });
});