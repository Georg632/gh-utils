import { ChangeDetectorRef } from '@angular/core';
import {
  Directive,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Routes, RoutesConfig } from '@gh/shared/gh-utils';
import { filter, Observable, Subscription } from 'rxjs';

const getRoutes = (route: ActivatedRoute): ActivatedRoute[] => {
  const children = (route.children as any).flatMap((child: ActivatedRoute) =>
    getRoutes(child)
  );
  return [route, ...children].filter((e) => e);
};

const findRoute = <T extends RoutesConfig>(
  root: Routes<T>,
  path: string
): Routes<T> => {
  // @ts-ignore
  return Object.values(root).find((r) => r['_pathProp'] === path);
};

const getRouteByPath = <T extends RoutesConfig>(
  root: Routes<T>,
  path: string[]
): Routes<T> | undefined => {
  if (!path.length) return root;
  const segment = path[0];

  let route;
  if (segment.indexOf('/:') > -1) {
    const [parent] = segment.split('/:');
    root = findRoute(root, parent);
  }
  route = findRoute(root, segment);
  if (!route) return;
  return getRouteByPath(route, path.slice(1));
};

type NgContext<T> = {
  $implicit: T;
};

type IBreadcrumb = {
  label: string;
  url: string | string[];
};

type BreadcrumbContext = {
  breadcrumbs: IBreadcrumb[];
};

@Directive({
  selector: '[c4Breadcrumb]',
  standalone: true,
})
export class C4BreadcrumbDirective implements OnInit, OnDestroy {
  // TODO fix types
  private mappedRoutes!: Routes<any>;
  @Input() set c4Breadcrumb(mappedRoutes: Routes<any>) {
    this.mappedRoutes = mappedRoutes;
  }

  public context: BreadcrumbContext = {
    breadcrumbs: [] as IBreadcrumb[],
  };

  private _subscriptions: Subscription[] = [];

  constructor(
    private injector: Injector,
    private router: Router,
    private route: ActivatedRoute,

    private templateRef: TemplateRef<NgContext<BreadcrumbContext>>,
    private viewContainerRef: ViewContainerRef,
    private changeDetector: ChangeDetectorRef
  ) {}

  static ngTemplateContextGuard(
    dir: C4BreadcrumbDirective,
    ctx: unknown
  ): ctx is NgContext<BreadcrumbContext> {
    return true;
  }

  ngOnDestroy(): void {
    this.viewContainerRef.clear();
    this._subscriptions.forEach((s) => s.unsubscribe());
  }

  async ngOnInit(): Promise<void> {
    this.viewContainerRef.createEmbeddedView(this.templateRef, {
      $implicit: this.context,
    });

    this.setBreadcrumbs();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(async () => this.setBreadcrumbs());
  }

  private async setBreadcrumbs() {
    this._subscriptions.forEach((s) => s.unsubscribe());
    this._subscriptions = [];
    this.context.breadcrumbs = [];
    const breadcrumbs = await this.generateBreadcrumb();

    breadcrumbs.forEach((breadcrumb, index) => {
      if (!(breadcrumb instanceof Observable)) {
        this.context.breadcrumbs.splice(index, 1, breadcrumb);
        return;
      }
      this._subscriptions.push(
        breadcrumb.subscribe((data) => {
          this.context.breadcrumbs.splice(index, data.length ?? 1, ...data);
          this.changeDetector.detectChanges();
        })
      );
    });
    this.changeDetector.detectChanges();
  }

  private async generateBreadcrumb() {
    const routes = getRoutes(this.route.root);

    const breadcrumbs = await Promise.all(
      routes.map(async (route, i) => {
        const breadcrumb = route.routeConfig?.['breadcrumb'];

        if (breadcrumb === false) return;
        if (typeof breadcrumb === 'function')
          return breadcrumb(this.injector, route);
        if (breadcrumb instanceof Array) return breadcrumb;

        if (breadcrumb instanceof Observable) {
          return breadcrumb;
        }

        const path = routes
          .slice(0, i + 1)
          .map((route) => route.routeConfig?.path)
          .filter((e) => e) as string[];

        if (!path.length) return;

        const routeConfig = getRouteByPath(this.mappedRoutes, path);

        return [
          {
            label: `breadcrumb.${routeConfig?.['_key']}`,
            url: routeConfig?.['_navRoute'],
          },
        ];
      })
    );
    return (breadcrumbs as any).flat().filter((e: any) => e) as IBreadcrumb[];
  }
}
