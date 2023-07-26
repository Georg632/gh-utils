import { Inject, Injectable, InjectionToken } from '@angular/core';
import { ROUTING_SCOPE } from '../pipes/navigation.pipe';

export const REDIRECTION: string = '**';
export const EMPTY_ROUTE: string = '';
export const ID_ROUTE_END: string = 'Id';

export const C4_ROUTES = new InjectionToken('C4_ROUTES');

@Injectable({
  providedIn: 'root',
})
export class RoutingHelper<T> {
  private static readonly PROP_PATH = '_pathProp';
  private static readonly PROP_NAVROUTE = '_navRoute';
  private static readonly PROP_SCOPE_PLACEHOLDER = '_scopePlaceholder';

  routingMap: T;
  constructor(
    @Inject(C4_ROUTES) mappedRoutes: T,
    @Inject(ROUTING_SCOPE) private scope: string
  ) {
    this.routingMap = mappedRoutes;
  }

  getPath(f: (x: T) => any): string {
    return f(this.routingMap)[RoutingHelper.PROP_PATH] as string;
  }

  getNavRoute(f: (x: T) => any, ...ids: string[]): string[] {
    let x = f(this.routingMap);
    const pathArray: string[] = x[RoutingHelper.PROP_NAVROUTE].slice();

    if (this.scope) {
      for (let i = 0; i < pathArray.length; i++) {
        const element = pathArray[i];
        if (element == x[RoutingHelper.PROP_SCOPE_PLACEHOLDER]) {
          pathArray[i] = this.scope;
        }
      }
    }

    RoutingHelper.handleIdRoute(pathArray, ids);
    return pathArray;
  }

  getIdKey(f: (x: T) => any, ...ids: string[]): string {
    const route = f(this.routingMap)[RoutingHelper.PROP_PATH] as string;
    const s = route.split('/');
    return s[s.length - 1].replace(':', '');
  }

  static isNavigationObject(value: any) {
    return this.PROP_PATH in value && this.PROP_NAVROUTE in value;
  }

  static pipeNavRoute(object: any, ...ids: string[]): string[] {
    const pathArray: string[] = object[RoutingHelper.PROP_NAVROUTE].slice();
    this.handleIdRoute(pathArray, ids);
    return pathArray;
  }

  static pipeNavRouteWithScope(
    object: any,
    scope: string,
    ...ids: string[]
  ): string[] {
    const pathArray: string[] = object[RoutingHelper.PROP_NAVROUTE].slice();

    if (scope) {
      for (let i = 0; i < pathArray.length; i++) {
        const element = pathArray[i];
        if (element == object[RoutingHelper.PROP_SCOPE_PLACEHOLDER]) {
          pathArray[i] = scope;
        }
      }
    }

    this.handleIdRoute(pathArray, ids);
    return pathArray;
  }

  private init() {
    this.addRoutingProperties(this.routingMap, ['/']);
  }

  private addRoutingProperties(obj: any, prevNavRoute: string[]) {
    const keys = Object.keys(obj);
    keys.forEach((key) => {
      let o = obj[key];
      Object.defineProperty(o, RoutingHelper.PROP_PATH, {
        value: key.endsWith(ID_ROUTE_END)
          ? `${prevNavRoute[prevNavRoute.length - 1]}/:${key}`
          : key,
        configurable: false,
        enumerable: false,
      });
      Object.defineProperty(o, RoutingHelper.PROP_NAVROUTE, {
        value: [...prevNavRoute, key],
        configurable: false,
        enumerable: false,
      });
      this.addRoutingProperties(o, [...prevNavRoute, key]);
    });
  }

  private static handleIdRoute(pathArray: string[], ids: string[]) {
    if (!ids?.length) return;

    let paramCounter = 0;
    pathArray
      .filter((p) => p.endsWith(ID_ROUTE_END))
      .forEach((p) => {
        const i = pathArray.findIndex((path) => path == p);
        pathArray.splice(i, 1, ids[paramCounter]);
        paramCounter++;
      });
  }
}
