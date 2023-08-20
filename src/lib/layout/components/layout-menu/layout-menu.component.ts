import { Component, Input } from '@angular/core';
import { LayoutMenuModel } from '../../model/layout-menu.model';

@Component({
  selector: 'layout-menu',
  templateUrl: './layout-menu.component.html',
})
export class LayoutMenuComponent {
  @Input() layoutMenuModel: LayoutMenuModel[] = [];
}
