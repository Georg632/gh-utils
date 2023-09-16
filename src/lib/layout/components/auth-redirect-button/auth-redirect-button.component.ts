import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonStyles } from '@company-butler/shared/ui';

@Component({
  selector: 'auth-redirect-button',
  templateUrl: './auth-redirect-button.component.html',
})
export class AuthRedirectButtonComponent {
  @Output() onLogin: EventEmitter<any> = new EventEmitter();
  @Output() onSignUp: EventEmitter<any> = new EventEmitter();
  buttonStyles = ButtonStyles;
}
