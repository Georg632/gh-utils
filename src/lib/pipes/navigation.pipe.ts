import { Inject, InjectionToken, Pipe, PipeTransform } from '@angular/core';
import { RoutingHelper } from '../routing';
import { Routes, RoutesConfig } from '../routing/types';

export const ROUTING_SCOPE = new InjectionToken('ROUTING_SCOPE', { providedIn: 'root', factory: () => '' });

@Pipe({
  name: 'navigation',
  standalone: true,
})
export class NavigationPipe implements PipeTransform {
  constructor(@Inject(ROUTING_SCOPE) private scope: string) {}

  transform<T extends RoutesConfig>(value: Routes<T>, ...args: (string | undefined)[]): string[] {
    if (!RoutingHelper.isNavigationObject(value)) throw Error('nav object wrong');
    if (args.some(a => a === undefined)) throw Error('argument undefined');

    return RoutingHelper.pipeNavRouteWithScope(value, this.scope, ...(args as string[]));
  }
}
