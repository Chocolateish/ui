import "./router.scss";
import { Content } from "./content";
import { Base, defineElement } from "@src/base";

type RouteLevel = {
  "%_%subroute%_%"?: RouteLevel;
} & {
  [key: string]: Content;
};

export class UI extends Base {
  static elementName() {
    return "router";
  }
  #routes: RouteLevel = {};

  constructor() {
    super();
  }

  addRoute(route: string[], component: Content) {}
}
defineElement(UI);
