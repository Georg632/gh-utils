import { registerLocaleData } from '@angular/common';
import localDe from '@angular/common/locales/de';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

registerLocaleData(localDe, 'de');

@Injectable({
  providedIn: 'root',
})
export class GhTranslationService {
  defaultLanguage: string = '';
  supportedLanguages: string[] = [];
  onLangChange = this.ngxTranslateService.onLangChange;
  cookiePrefix: string = '';
  getCookie!: Function;
  setCookie!: Function;

  //https://github.com/angular/angular/issues/15039
  //https://angular.io/guide/i18n

  constructor(private ngxTranslateService: TranslateService) {}

  get languageCookie(): string {
    return `${this.cookiePrefix}appLanguage`;
  }

  set language(desiredLanguage: string) {
    desiredLanguage = desiredLanguage || (this.ngxTranslateService.getBrowserCultureLang() ?? '');

    let usedLanguage = GhTranslationService.findBestMatchingLanguage(
      desiredLanguage,
      this.supportedLanguages
    );
    if (!usedLanguage) {
      usedLanguage = this.defaultLanguage;
    }

    this.setCookie(this.languageCookie, usedLanguage, 360);
    this.ngxTranslateService.use(usedLanguage);
  }

  get language(): string {
    return this.ngxTranslateService.currentLang;
  }

  static findBestMatchingLanguage(language: string, supportedLanguages: string[]) {
    if (!language) {
      language = '';
    }

    language = language.toLowerCase();
    const shortLanguage = language.split('-')[0];

    //try to find exact match
    let result = supportedLanguages.find(sl => sl.toLowerCase() === language);

    //try to remove "-" of target language (en-US -> en)
    if (!result) {
      result = supportedLanguages.find(sl => sl.toLowerCase() === shortLanguage);
    }

    //try to remove "-" of supported languages
    if (!result) {
      result = supportedLanguages.find(sl => sl.toLowerCase().split('-')[0] === shortLanguage);
    }

    return result;
  }

  init(appLanguages: string[], cookiePrefix: string, getCookie: Function, setCookie: Function) {
    if (appLanguages.length < 1)
      throw new Error('Init Languages Error: No Language found in settings');
    this.supportedLanguages = appLanguages;
    this.cookiePrefix = cookiePrefix;
    this.getCookie = getCookie;
    this.setCookie = setCookie;

    const defaultLanguage = appLanguages[0];
    this.ngxTranslateService.setDefaultLang(defaultLanguage);
    this.defaultLanguage = defaultLanguage;
    const persistedLang = this.getCookie(this.languageCookie);
    this.language = persistedLang;
  }

  instant(key: string): string {
    return this.ngxTranslateService.instant(key);
  }
}
