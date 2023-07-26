export type RoutesConfig = Record<string | number | symbol, RouteConfig>;

export type RouteConfig = {
  path: string;
  asScope?: boolean;
  children?: RoutesConfig;
};

type Empty = { [k in PropertyKey]: never };

export type Routes<T extends RoutesConfig | undefined> = T extends RoutesConfig
  ? { [P in keyof T]: Routes<T[P]['children']> }
  : Empty;

export type RoutesResult = { [k: PropertyKey]: Empty | RoutesResult };

export function defineRoutes<T extends RoutesConfig>(routes: T): T {
  return routes;
}
