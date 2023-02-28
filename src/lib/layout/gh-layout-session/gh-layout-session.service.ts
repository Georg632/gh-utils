import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface GhDomainModel {
  url: string[];
  label: string;
}

export interface GhLayoutProfile {
  imgUrl: string | undefined;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class GhLayoutSessionService {
  logoUrl: BehaviorSubject<string> = new BehaviorSubject('');
  mobileActive: BehaviorSubject<boolean> = new BehaviorSubject(true);
  domainNavigations: BehaviorSubject<GhDomainModel[]> = new BehaviorSubject<
    GhDomainModel[]
  >([]);
  userProfile: BehaviorSubject<GhLayoutProfile> =
    new BehaviorSubject<GhLayoutProfile>({ imgUrl: undefined, name: '' });

  constructor() {}
}
