import { Routes, RoutesConfig } from './types';

export function generateRoutes<T extends RoutesConfig>(routes: T, obj: any = {}): Routes<T> {
  Object.keys(routes).forEach((key: keyof T) => {
    const route = routes[key];
    const isParamUrl = route.path.startsWith(':');

    obj[key] = {};
    Object.defineProperties(obj[key], {
      _navRoute: {
        value: [...(obj?._navRoute ?? ['/']), route.path],
        configurable: false,
        enumerable: false,
      },
      _pathProp: {
        value: isParamUrl ? [obj['_pathProp'], route.path].join('/') : route.path,
        configurable: false,
        enumerable: false,
      },
      _scopePlaceholder: {
        value: obj?._scopePlaceholder ?? (route.asScope ? route.path : undefined),
        configurable: false,
        enumerable: false,
      },
      _key: {
        value: [obj['_key'], key].filter(e => e).join('-'),
        configurable: false,
        enumerable: false,
      },
    });

    if (!route.children) return;
    Object.assign(obj[key], generateRoutes(route.children, obj[key]));
  });
  return obj;
}
