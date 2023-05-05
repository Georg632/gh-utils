export const REDIRECTION: string = '**';
export const ID_ROUTE_END: string = 'Id';

export class RoutingHelper<T> {
  private readonly PROP_PATH = '_pathProp';
  private readonly PROP_NAVROUTE = '_navRoute';
  private readonly IGNORE_PROPS = [this.PROP_PATH, this.PROP_NAVROUTE];

  private routingMap: T;

  constructor(routingMap: T) {
    this.routingMap = routingMap;
    this.init();
  }

  getPath(f: (x: T) => any): string {
    return f(this.routingMap)[this.PROP_PATH] as string;
  }

  getNavRoute(f: (x: T) => any, ...ids: string[]): string[] {
    const pathArray = f(this.routingMap)[this.PROP_NAVROUTE] as string[];
    if (ids && ids.length > 0) {
      let paramCounter = 0;
      pathArray
        .filter((p) => p.endsWith(ID_ROUTE_END))
        .forEach((p) => {
          const i = pathArray.findIndex((path) => path == p);
          pathArray.splice(i, 1, ids[paramCounter]);
          paramCounter++;
        });
    }
    return pathArray;
  }

  private init() {
    this.addRoutingProperties(this.routingMap, ['/']);
  }

  private addRoutingProperties(obj: any, prevNavRoute: string[]) {
    const keys = Object.keys(obj);
    keys
      .filter((x) => !this.IGNORE_PROPS.includes(x))
      .forEach((key) => {
        let o = obj[key];
        o[this.PROP_PATH] = key.endsWith(ID_ROUTE_END)
          ? `${prevNavRoute[prevNavRoute.length - 1]}/:${key}`
          : key;
        o[this.PROP_NAVROUTE] = [...prevNavRoute, key];
        this.addRoutingProperties(o, [...prevNavRoute, key]);
      });
  }
}
