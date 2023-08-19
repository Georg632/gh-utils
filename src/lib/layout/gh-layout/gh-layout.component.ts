import { Component, Input } from '@angular/core';
import { combineLatest, map, of } from 'rxjs';
import { GhLayoutSessionService } from '../gh-layout-session/gh-layout-session.service';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'gh-layout',
  templateUrl: './gh-layout.component.html',
})
export class GhLayoutComponent {
  constructor(
    public session: GhLayoutSessionService,
    public auth: AuthService
  ) {}

  toggleMobile() {
    this.session.mobileActive.next(!this.session.mobileActive.getValue());
  }

  loginRedirect() {
    this.auth.loginWithRedirect();
  }
}
