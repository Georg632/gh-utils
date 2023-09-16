import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GhLayoutComponent } from './gh-layout/gh-layout.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { GhValueDirective } from '../rxjs-helpers/gh-value/gh-value.directive';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TopbarComponent } from './components/topbar/topbar.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { NavListComponent } from './components/nav-list/nav-list.component';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';
import { AuthRedirectButtonComponent } from './components/auth-redirect-button/auth-redirect-button.component';
import {
  GhButtonContentComponent,
  GhButtonDirective,
} from '@company-butler/shared/ui';
import { LayoutMenuComponent } from './components/layout-menu/layout-menu.component';
import { CdkMenu, CdkMenuTrigger } from '@angular/cdk/menu';

@NgModule({
  declarations: [
    GhLayoutComponent,
    TopbarComponent,
    MainHeaderComponent,
    NavListComponent,
    UserAvatarComponent,
    AuthRedirectButtonComponent,
    LayoutMenuComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    GhValueDirective,
    FontAwesomeModule,
    GhButtonDirective,
    CdkMenu,
    CdkMenuTrigger,
    GhButtonContentComponent,
  ],
})
export class GhLayoutModule {}
