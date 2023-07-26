import { Injector } from '@angular/core';
import '@angular/router';
import { Observable } from 'rxjs';

interface IBreadcrumb {
  label: string;
  url: string | string[];
}

type Awaitable<T> = T | Promise<T>;

type Breadcrumb = undefined | boolean | IBreadcrumb[];

declare module '@angular/router' {
  export interface Route {
    /**
     * This property overrides the automatically generated breadcrumb if provided. If `false` the current route's
     * breadcrumb is skipped. If `true`, the breadcrumb is generated automatically based on the provided routes. If the
     * value is an array, a breadcrumb for each element is generated. Also accepts an awaitable function returning
     * either `false` or an array of breadcrumbs.
     */
    breadcrumb?:
      | Breadcrumb
      | Observable<Breadcrumb>
      | ((injector: Injector, route: ActivatedRoute) => Awaitable<Breadcrumb | Observable<Breadcrumb>>);
  }
}

export {};
