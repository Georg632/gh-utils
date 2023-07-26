# Directive - Breadcrumb


## Usage

### Routes
The Route type is automatically extended by a property called `breadcrumb`. Possible values are:
* `undefined`  or `true` automatically adds a breadcrumb element to the route. The label can then be translated using `TranslatePipe`,
* `false` to not automatically add a breadcrumb element,
* an array of custom breadcrumb elements,
* an awaitable function returning an array of breadcrumb elements, a `boolean` or `undefined`.

Example definition of routes with breadcrumbs:

```ts
const routes: Routes = [
  {
    path: ROUTING.getPath(p => p.administration.landing),
    component: AdminOverviewComponent,
    // skips adding a breadcrumb to this route
    breadcrumb: false,
  },
  {
    path: ROUTING.getPath(p => p.administration.notification),
    component: NotificationEditComponent,
    canDeactivate: [ConfirmationGuard],
  },
  {
    path: ROUTING.getPath(p => p.administration.notification.notificationId),
    component: NotificationEditComponent,
    canDeactivate: [ConfirmationGuard],
    // Returns custom breadcrumb elements, in this case a breadcrumb element with the title of the notification and a 
    // link to the resource.
    async breadcrumb(injector, route) {
      const notificationService = injector.get(NotificationsService);
      const notificationId = route?.snapshot.params['notificationId'];
      const notification = await notificationService.getNotificationById(notificationId);

      return [
        {
          label: notification.title!,
          url: ROUTING.getNavRoute(p => p.administration.notification.notificationId, notificationId),
        },
      ];
    },
  },
]
```

### Directive
It is mandatory to pass in the routes to the breadcrumb to enable automatic breadcrumbs. The context of the directive
contains a property `breadcrumbs`, which is an array of all breadcrumbs created for the current URL.

```html
<nav
  class="flex py-3"
  aria-label="Breadcrumb">
  <ol
    role="list"
    class="flex items-center space-x-4"
    *c4Breadcrumb="mappedRoutes; let ctx">
    <ng-container
      *ngFor="let element of ctx.breadcrumbs; index as i"
      [ngTemplateOutlet]="bcTemplate"
      [ngTemplateOutletContext]="{ element: element, i: i }">
    </ng-container>
  </ol>
</nav>

<ng-template
  #bcTemplate
  let-element="element"
  let-i="i">
  <li>
    <div class="flex items-center">
      <span
        *ngIf="i > 0"
        class="flex-shrink-0 w-5 h-5 text-gray-300"
        [bmiIcon]="IconKeys.slash"></span>
      <a
        [routerLink]="element.url"
        [queryParams]="element.queryParams"
        [class.ml-4]="i > 0"
        class="text-sm font-medium text-gray-500 hover:text-gray-700">
        <span
          *ngIf="element.icon"
          class="flex-shrink-0 w-5 h-5 text-gray-300"
          [bmiIcon]="element.icon"></span>
        {{ element.label | translate }}
      </a>
    </div>
  </li>
</ng-template>
```
