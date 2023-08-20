import { IconName } from '@fortawesome/fontawesome-svg-core';

export interface LayoutMenuModel {
  icon: IconName;
  label: string;
  url?: string[];
  callback?: Function;
}
