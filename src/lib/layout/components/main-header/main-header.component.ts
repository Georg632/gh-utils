import { Component, Input } from '@angular/core';
import { MainHeaderModel } from '../../model/main-header.model';

@Component({
  selector: 'main-header',
  templateUrl: './main-header.component.html',
})
export class MainHeaderComponent {
  @Input() model: MainHeaderModel | null = { title: 'default' };
}
