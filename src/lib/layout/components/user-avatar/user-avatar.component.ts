import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { User } from '@auth0/auth0-angular';

@Component({
  selector: 'user-avatar',
  templateUrl: './user-avatar.component.html',
})
export class UserAvatarComponent {
  @Input() user: User | undefined | null = null;
  @Input() menu: TemplateRef<any> | undefined;
  @Output() onAvatarClicked: EventEmitter<any> = new EventEmitter();
}
