import { Injectable } from '@angular/core';
import {
  AppConfigService,
  GhTheme,
  TwColorDefinition,
} from '@company-butler/shared/utils';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';
import { NavigationModel } from '../model/navigation.model';
import { MainHeaderModel } from '../model/main-header.model';
import { LayoutMenuModel } from '../model/layout-menu.model';

@Injectable({
  providedIn: 'root',
})
export class GhLayoutSessionService {
  activeTheme: BehaviorSubject<GhTheme | undefined> = new BehaviorSubject<
    GhTheme | undefined
  >(undefined);
  mobileActive: BehaviorSubject<boolean> = new BehaviorSubject(true);
  navigationItems$: BehaviorSubject<NavigationModel[]> = new BehaviorSubject<
    NavigationModel[]
  >([]);
  mainHeaderModel$: BehaviorSubject<MainHeaderModel> =
    new BehaviorSubject<MainHeaderModel>({ title: 'default' });

  layoutMenuModel$: BehaviorSubject<LayoutMenuModel[]> = new BehaviorSubject<
    LayoutMenuModel[]
  >([]);

  constructor() {}

  applyNavigationItems(navItems: NavigationModel[]) {
    this.navigationItems$.next(navItems);
  }

  applyLayoutMenuModel(layoutModels: LayoutMenuModel[]) {
    this.layoutMenuModel$.next(layoutModels);
  }

  applyTheme(themeId: string) {
    const theme = AppConfigService.settings.themes.find((t) => t.id == themeId);
    if (!theme) {
      console.log(`Theme with id '${themeId}' not found`);
      return;
    }

    this.applyColors(theme.colors);
    this.activeTheme.next(theme);
  }

  private applyColors(colors: { [key: string]: string | TwColorDefinition }) {
    const root = document.querySelector(':root')! as any;
    Object.keys(colors).forEach((colorName) => {
      if (_.isObject(colors[colorName])) {
        Object.keys(colors[colorName]).forEach((colorShade) => {
          root.style.setProperty(
            `--color-${colorName}-${colorShade}`,
            (colors[colorName] as any)[colorShade]
          );
        });
      } else {
        root.style.setProperty(`--color-${colorName}`, colors[colorName]);
      }
    });
  }
}
