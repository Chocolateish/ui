import { Base } from "@src/base";

export abstract class FixedEditor extends Base {
  constructor() {
    super();
  }

  static elementName() {
    return "@abstract@";
  }
}
