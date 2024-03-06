import { Base, defineElement } from "@src/base";

export abstract class ContentBase extends Base {
  constructor() {
    super();
  }
  static elementName() {
    return "@abstract@";
  }
}

export class Content extends ContentBase {
  static elementName() {
    return "content";
  }
}
defineElement(Content);
