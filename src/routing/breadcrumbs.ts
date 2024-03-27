import "./router.scss";
import { Base, BaseOptions, StateROrValue, StateWOrFunc, defineElement } from "@src/base";
import { Route } from "./router";

interface BreadcrumbsOptions extends BaseOptions {
  route?: StateROrValue<Route>;
  routeWrite?: StateWOrFunc<Route>;
}
export class Breadcrumbs extends Base {
  static elementName() {
    return "breadcrumbs";
  }
  constructor(options: BreadcrumbsOptions) {
    super(options);
    if (options.route) {
      this.route = options.route;
    }
  }

  set route(route: Route) {
    for (let i = 0; i < route.length; i++) {}
  }

  set routeWrite(route: Route) {
    for (let i = 0; i < route.length; i++) {}
  }
}
defineElement(Breadcrumbs);
