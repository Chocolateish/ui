import "./router.scss";
import { Content } from "../page/content";
import { defineElement } from "@src/base";

export type Route = string[];

type RouteLevel = {
  "%_%subroute%_%"?: RouteLevel;
} & {
  [key: string]: Content;
};

export class Router extends Content {
  static elementName() {
    return "router";
  }
  #routes: RouteLevel = {};
  #activeRoute: Route = [];

  constructor() {
    super();
  }

  addRoute(route: string[], component: Content) {}

  removeRoute(route: string[]) {}

  setActiveRoute(route: Route) {}
}
defineElement(Router);
