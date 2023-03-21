import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GhLayoutComponent } from './gh-layout/gh-layout.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { GhValueDirective } from '../rxjs-helpers/gh-value/gh-value.directive';

@NgModule({
  declarations: [GhLayoutComponent],
  imports: [CommonModule, RouterModule, TranslateModule, GhValueDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GhLayoutModule {}
