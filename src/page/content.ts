import { Base, BaseEvents } from "@src/base";

export type ContentEventTypes = {
  name: { name: string };
  SYMBOL: { symbol: () => SVGSVGElement };
  REMOVED: {};
  CLOSING: {};
  SELECTED: {};
  CLOSEABLE: {};
  MINSIZE: {};
  MAXSIZE: {};
} & BaseEvents;

export abstract class ContentBase<
  MoreEvents extends ContentEventTypes = ContentEventTypes
> extends Base<MoreEvents> {
  constructor() {
    super();
  }
  static elementName() {
    return "@abstract@";
  }
}

export class Content<
  MoreEvents extends ContentEventTypes = ContentEventTypes
> extends ContentBase<MoreEvents> {
  static elementName() {
    return "content";
  }
}
