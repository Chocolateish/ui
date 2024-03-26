import "./ui.scss";
import { Base, crel, defineElement } from "@src/base";
import { Menubar } from "@src/menu";
import { ContentBase } from "./content";

export class Tabs extends Base {
  static elementName() {
    return "tabs";
  }
}
defineElement(Tabs);
