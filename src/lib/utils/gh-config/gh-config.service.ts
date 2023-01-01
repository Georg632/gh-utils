import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { PlatformLocation } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { GhAppConfig } from './gh-config';

export class GhConfigService<TAppConfig extends GhAppConfig> {
  constructor(
    protected _http: HttpClient,
    protected _platformLocation: PlatformLocation,
    protected _titleService: Title
  ) {}

  load(configPath: string, defaultValues: any): Promise<TAppConfig> {
    //inspired by https://devblogs.microsoft.com/premier-developer/angular-how-to-editable-config-files/
    return new Promise<TAppConfig>((resolve, reject) => {
      lastValueFrom(this._http.get(configPath))
        .then((response: any) => {
          var settings = response as TAppConfig;
          this.setDefaultValues(settings, defaultValues);
          //inject default values if not set
          settings.api.url = this.replaceFQDN(settings.api.url);
          this._titleService.setTitle(settings.title);
          resolve(settings as TAppConfig);
        })
        .catch((response: any) => {
          console.log('cfg error');
          reject(
            `Could not load configuration file '${configPath}': ${JSON.stringify(
              response
            )}`
          );
        });
    });
  }

  private setDefaultValues(target: any, source: any) {
    for (const key of Reflect.ownKeys(source)) {
      const sourceChild = source[key];
      const sourceChildType = typeof sourceChild;
      const isArray = Array.isArray(sourceChild);

      if (!this.isDefined(target[key], sourceChildType, isArray)) {
        //property missing: set
        target[key] = sourceChild;
        continue;
      }

      if (sourceChildType === 'object') {
        //traverse child object
        if (!isArray) {
          this.setDefaultValues(target[key], sourceChild);
        }
      } else if (sourceChildType === 'string') {
        //overwrite if only empty string is set
        if ((target[key] as string).length <= 0) {
          target[key] = sourceChild;
        }
      }
    }
  }

  private isDefined(
    value: any,
    expectedType: string,
    isArray: boolean
  ): boolean {
    if (value === null || value === undefined) {
      //missing -> not defined
      return false;
    }
    if (expectedType !== typeof value) {
      //wrong type -> not defined
      return false;
    }

    if (isArray !== Array.isArray(value)) {
      //array missmatch -> not defined
      return false;
    }

    return true;
  }

  replaceFQDN(url: string): string {
    return url.replace('$host', this._platformLocation.hostname);
  }
}
