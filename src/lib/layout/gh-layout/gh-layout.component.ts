import { Component, Input } from '@angular/core';
import { combineLatest, map, of } from 'rxjs';
import { GhLayoutSessionService } from '../gh-layout-session/gh-layout-session.service';

@Component({
  selector: 'gh-layout',
  templateUrl: './gh-layout.component.html',
})
export class GhLayoutComponent {
  layoutModel$ = combineLatest([
    this.ghLayoutSessionService.domainNavigations,
    this.ghLayoutSessionService.logoUrl,
    this.ghLayoutSessionService.mobileActive,
    this.ghLayoutSessionService.userProfile,
    this.ghLayoutSessionService.darkModeActive,
  ]).pipe(
    map(([navs, logoUrl, mobileActive, userProfile, darkModeActive]) => {
      return { navs, logoUrl, mobileActive, userProfile, darkModeActive };
    })
  );

  constructor(public ghLayoutSessionService: GhLayoutSessionService) {}

  toggleMobile() {
    this.ghLayoutSessionService.mobileActive.next(
      !this.ghLayoutSessionService.mobileActive.getValue()
    );
  }

  toggleColorMode() {
    this.ghLayoutSessionService.darkModeActive.next(
      !this.ghLayoutSessionService.darkModeActive.getValue()
    );
  }
}
