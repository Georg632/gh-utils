import { Component, Input } from '@angular/core';
import { NavigationModel } from '../../model/navigation.model';

@Component({
  selector: 'nav-list',
  templateUrl: './nav-list.component.html',
})
export class NavListComponent {
  @Input() navItems: NavigationModel[] = [];
}
