import { Base } from "@src/base";

export type ContentEventTypes = {
  name: { name: string };
  SYMBOL: { symbol: () => SVGSVGElement };
  REMOVED: {};
  CLOSING: {};
  SELECTED: {};
  CLOSEABLE: {};
  MINSIZE: {};
  MAXSIZE: {};
};

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
